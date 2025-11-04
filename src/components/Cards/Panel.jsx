import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { context } from "@svar-ui/react-core";
import { delegateClick } from "@svar-ui/lib-dom";
import Item from "./Item.jsx";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Panel.css";

function Panel() {
  const api = useContext(storeContext);
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const [panels] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");
  const mode = useStore(api, "mode");
  
  const files = panels[activePanel]._files;
  const selected = panels[activePanel].selected;
  const path = panels[activePanel].path;
  const crumbs = panels[activePanel]._crumbs;
  const selectNavigation = panels[activePanel]._selectNavigation;

  const click = useCallback(
    (id, e) => {
      const ctrl = e && (e.ctrlKey || e.metaKey);
      const shift = e && e.shiftKey;

      if (id === "/wx-filemanager-parent-link") {
        if (selected.length && (ctrl || shift)) return;
        api.exec("select-file", {
          type: "navigation",
        });
        return;
      }

      const isFile = id !== "body";
      let newSelection = !isFile && e ? null : id;

      const actionClick =
        e.target.className.indexOf("wx-more") !== -1 ||
        e.target.className.indexOf("wxi-dots-v") !== -1;

      // tricky, changes in state caused by select-file cause re-render of view, which in order breaks event propogation
      // event doesn't processed on body correctly and click-outside doesn't work
      setTimeout(() => {
        api.exec("select-file", {
          id: newSelection,
          toggle: ctrl && !actionClick,
          range: shift && !actionClick,
          panel: activePanel,
        });
      }, 1);
    },
    [api, selected, activePanel]
  );

  const backToParent = useCallback(() => {
    if (crumbs.length > 1) {
      api.exec("set-path", {
        id: crumbs[crumbs.length - 2].id,
        panel: activePanel,
        selected: [crumbs[crumbs.length - 1].id],
      });
    }
  }, [api, crumbs, activePanel]);

  const dblclick = useCallback(
    (id) => {
      if (id === "/wx-filemanager-parent-link") {
        return backToParent();
      }

      if (mode === "search") {
        api.exec("filter-files", {
          text: "",
        });
      }

      const item = files.find(a => a.id === id);

      if (item) {
        if (item.type == "folder") {
          api.exec("set-path", {
            id: item.id,
            panel: activePanel,
          });
        } else {
          api.exec("open-file", {
            id: item.id,
          });
        }
      }
    },
    [api, backToParent, mode, files, activePanel]
  );

  const applySelection = useCallback(
    (id, ev) => {
      if (
        !selected?.length ||
        !selected.filter(i => i?.id === id).length > 0
      ) {
        click(id, ev);
      }
    },
    [selected, click]
  );

  const renderedFiles = useMemo(
    () =>
      path !== "/"
        ? [
            {
              id: "/wx-filemanager-parent-link",
              name: _("Back to parent folder"),
              navigation: selectNavigation,
            },
            ...files,
          ]
        : files,
    [path, _, selectNavigation, files]
  );

  const cardsRef = useRef(null);
  // delegate click has not cleaning, so need to ensure that it is initialized only once
  const clickHandlers = useRef();
  useEffect(() => {
    if (!clickHandlers.current) {
      clickHandlers.current = { click, dblclick: ev => clickHandlers.current._dblclick(ev), _dblclick: dblclick, context: applySelection };
      delegateClick(cardsRef.current, clickHandlers.current);
    } else {
      clickHandlers.current.click = click;
      clickHandlers.current._dblclick = dblclick;
      clickHandlers.current.context = applySelection;
    }
  }, [click, dblclick, applySelection]);

  if (mode == "search" && !renderedFiles.length) {
    return (
      <div className="wx-iyjASZCY wx-not-found">
        <div className="wx-iyjASZCY wx-not-found-text">{_("Looks like nothing is here")}</div>
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      className={"wx-iyjASZCY " + ("wx-cards" + (path !== "/" && mode !== "search" ? " wx-has-back-link" : ""))}
      data-id={"body"}
      ref={cardsRef}
    >
      {renderedFiles.map((child) => (
        <Item item={child} key={child.id} />
      ))}
    </div>
  );
}

export default Panel;