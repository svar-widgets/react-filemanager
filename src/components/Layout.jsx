import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clickOutside, locateID } from "@svar-ui/lib-dom";
import { ActionMenu, ContextMenu } from "@svar-ui/react-menu";
import { Uploader, useUploaderState } from "@svar-ui/react-uploader";
import { hotkeys } from "@svar-ui/filemanager-store";
import { context } from "@svar-ui/react-core";
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import { uploaderContext as UploaderContext } from '../context';

import SearchView from "./SearchView.jsx";
import Info from "./Info.jsx";
import Panels from "./Panels.jsx";
import Sidebar from "./Sidebar.jsx";
import Toolbar from "./Toolbar.jsx";
import TableView from "./Table/View.jsx";
import CardsView from "./Cards/View.jsx";
import { storeContext, modalContext } from '../context';

import "./Layout.css";

function Layout({ readonly = false, menuOptions, extraInfo }) {
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [sidebarWidth, setSidebarWidth] = useState(undefined);
  const [narrowMode, setNarrowMode] = useState(undefined);
  const [showSidebar, setShowSidebar] = useState(false);

  const uploaderState = useUploaderState();

  const api = useContext(storeContext);
  const { showPrompt, showConfirm } = useContext(modalContext);
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const mode = useStore(api, "mode");
  const preview = useStore(api, "preview");
  const activePanel = useStore(api, "activePanel");
  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");

  const selected = useMemo(() => {
    const p = panels && activePanel != null ? panels[activePanel] : null;
    return p?.selected ?? [];
  }, [panelsCounter, activePanel]);

  const path = useMemo(() => {
    const p = panels && activePanel != null ? panels[activePanel] : null;
    return p?.path;
  }, [panelsCounter, activePanel]);

  const [contextMenuOptions, setContextMenuOptions] = useState([]);

  // use:resize equivalent on container
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(entries => {
      const size = entries[0]?.borderBoxSize?.[0]?.inlineSize;
      if (typeof size === "number") {
        setNarrowMode(size < 768);
      }
    });
    ro.observe(node);
    return () => {
      ro.disconnect();
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setShowSidebar(v => !v);
  }, []);

  const hideSidebar = useCallback(
    ev => {
      if (narrowMode && locateID(ev) !== "toggle-tree") {
        setShowSidebar(false);
      }
    },
    [narrowMode]
  );

  // use:clickOutside on sidebar
  useEffect(() => {
    const node = sidebarRef.current;
    if(node)
      return clickOutside(node, hideSidebar).destroy;
  }, [hideSidebar]);

  // bind:clientWidth on sidebar
  useEffect(() => {
    const node = sidebarRef.current;
    if (!node) return;
    const ro = new ResizeObserver(() => {
      if (node) setSidebarWidth(node.clientWidth);
    });
    ro.observe(node);
    // initialize immediately
    if (node) setSidebarWidth(node.clientWidth);
    return () => {
      ro.disconnect();
    };
  }, []);

  const previewOption = useMemo(
    () => ({
      icon: "wxi-eye",
      text: "Preview",
      id: "preview",
    }),
    []
  );

  const getReadonlyMenu = useCallback(
    type => {
      let options = narrowMode ? [previewOption] : [];
      if (type === "file") {
        options = [...options, ...menuOptions().filter(o => o.id === "download")];
      }
      return options;
    },
    [narrowMode, previewOption, menuOptions]
  );

  const copyRef = useRef(null);

  const performAction = useCallback(
    (action, contextArg, inTree) => {
      const ids = inTree ? [contextArg.id] : selected;
      switch (action) {
        case "download":
          api.exec("download-file", { id: contextArg.id });
          break;
        case "copy":
        case "move":
          copyRef.current = {
            action,
            ids: ids,
          };
          break;
        case "paste":
          if (copyRef.current) {
            api.exec(copyRef.current.action === "copy" ? "copy-files" : "move-files", {
              ids: copyRef.current.ids,
              target: contextArg?.type === "folder" ? contextArg.id : path,
            });
            copyRef.current = null;
          }
          break;
        case "rename":
          showPrompt({ item: contextArg });
          break;
        case "delete":
          showConfirm({ selected: ids });
          break;
        case "preview":
          api.exec("show-preview", { mode: !preview });
          break;
        default:
          break;
      }
    },
    [api, selected, path, showPrompt, showConfirm, preview]
  );

  const getPanel = useCallback(() => {
    return panels?.[activePanel];
  }, [panels, activePanel]);

  // use:hotkeys on container
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const opts = {
      api,
      menuOptions: readonly ? getReadonlyMenu : menuOptions,
      performAction,
      getPanel,
    };
    const res = hotkeys(node, opts);
    return () => {
      if (typeof res === "function") res();
      else if (res && typeof res.destroy === "function") res.destroy();
    };
  }, [api, readonly, getReadonlyMenu, menuOptions, performAction, getPanel]);

  const resolveContext = useCallback(
    (id, e) => {
      const item = id ? api.getFile(id) : null;
      const inTree = e.target.closest(".tree-item.folder");

      let options;

      if (readonly) {
        options = getReadonlyMenu(item?.type);
      } else {
        switch (id) {
          case "body":
            options = menuOptions(id);
            break;
          default:
            if (item) {
              if (!inTree && selected.length > 1) {
                options = narrowMode ? [previewOption, ...menuOptions("multiselect")] : menuOptions("multiselect");
              } else if (id === "/") {
                options = menuOptions("folder", item).filter(o => o.id === "paste");
              } else {
                const mOptions = menuOptions(item.type, item);
                if (mOptions) {
                  options = narrowMode ? [previewOption, ...mOptions] : mOptions;
                }
              }
            }
        }
        if (mode === "search") {
          options = options?.filter(o => o.id !== "paste");
        }
      }

      if (item?.id && (!selected.length || !selected.some(i => i === item.id)) && !inTree) {
        api.exec("select-file", { id: item.id });
      }

      if (options?.length) {
        options.forEach(o => {
          if (inTree) o.hotkey = "";
          if (o.text) o.text = _(o.text);
          if (o.hotkey) o.subtext = o.hotkey;
        });
        setContextMenuOptions(options);
        return item || {};
      }
    },
    [api, readonly, getReadonlyMenu, menuOptions, selected, narrowMode, previewOption, mode, _]
  );

  const handleMenu = useCallback(
    e => {
      const { action, context: ctx } = e;
      if (action) {
        performAction(action.id, ctx, !action.hotkey);
      }
    },
    [performAction]
  );

  async function handleUpload(f) {
    await Promise.resolve();
    const { name, size } = f.file;

    api.exec("create-file", {
      file: {
        name,
        size,
        date: new Date(),
        file: f.file,
      },
      parent: path,
    });
  }

  return (
    <div
      className="wx-RJbNonjJ wx-filemanager wx-flex"
      ref={containerRef}
      data-menu-ignore="false"
    >
      {narrowMode && preview ? (
        <div className="wx-RJbNonjJ wx-info-narrow">
          <Info narrowMode={narrowMode} extraInfo={extraInfo} />
        </div>
      ) : (
        <>
          <Toolbar narrowMode={narrowMode} onShowTree={toggleSidebar} />
          <ContextMenu
            dataKey={"id"}
            at={"point"}
            options={contextMenuOptions}
            resolver={resolveContext}
            onClick={handleMenu}
          >
            <ActionMenu
              dataKey="actionId"
              options={contextMenuOptions}
              resolver={resolveContext}
              onClick={handleMenu}
            >
              <Uploader data={uploaderState} apiOnly={true} uploadURL={handleUpload} />
              <UploaderContext.Provider value={uploaderState}>
                <div className="wx-RJbNonjJ wx-content-wrapper wx-flex">
                  {mode !== "panels" && mode !== "search" ? (
                    <>
                      <div
                        className={"wx-RJbNonjJ " + [
                          "wx-sidebar",
                          narrowMode ? "wx-sidebar-narrow" : "",
                          showSidebar ? "wx-sidebar-visible" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        ref={sidebarRef}
                      >
                        <Sidebar readonly={readonly} menuOptions={menuOptions} />
                      </div>
                      <div
                        className="wx-RJbNonjJ wx-content"
                        style={{ width: `calc(100% - ${sidebarWidth || 0}px - 10px)` }}
                      >
                        <div
                          className={`wx-RJbNonjJ wx-content-item${preview ? "" : "-fit"}`}
                          data-id="body"
                        >
                          {mode === "table" ? (
                            <TableView panel={activePanel} />
                          ) : (
                            <CardsView />
                          )}
                        </div>
                        {preview ? (
                          <div className="wx-RJbNonjJ wx-info">
                            <Info extraInfo={extraInfo} />
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`wx-RJbNonjJ wx-content-item${preview ? "" : "-fit"}`}>
                        {mode === "panels" ? <Panels /> : <SearchView />}
                      </div>
                      {preview ? (
                        <div className="wx-RJbNonjJ wx-info">
                          <Info extraInfo={extraInfo} />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </UploaderContext.Provider>
            </ActionMenu>
          </ContextMenu>
        </>
      )}
    </div>
  );
}

export default Layout;