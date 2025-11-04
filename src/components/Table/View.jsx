import { useContext, useEffect, useMemo, useRef } from "react";
import { formatSize } from "@svar-ui/filemanager-store";
import { delegateClick, dateToString } from "@svar-ui/lib-dom";
import { Grid } from "@svar-ui/react-grid";
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import { context } from "@svar-ui/react-core"
import { storeContext } from '../../context';

import Breadcrumbs from "../Breadcrumbs.jsx";
import NameCell from "./NameCell.jsx";
import UploadDropArea from "../UploadDropArea.jsx";

import "./View.css";

function View({ panel, active = false, onClick, onContextMenu }) {
  const api = useContext(storeContext);
  const locale = useContext(context.i18n);
  const _ = useMemo(() => locale.getGroup("filemanager"), [locale]);
  const format = useMemo(
    () => dateToString("%d %M %Y", locale.getRaw().calendar),
    [locale]
  );

  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");
  
  const selection = panels[panel].selected;
  const path = panels[panel].path;
  const crumbs = panels[panel]._crumbs;
  const sorts = panels[panel]._sorts;
  const selectNavigation = panels[panel]._selectNavigation;
  const files = panels[panel]._files;

  const columns = useMemo(() => [
    {
      id: "name",
      header: _("Name"),
      flexgrow: 3,
      sort: true,
      resize: true,
      cell: NameCell,
    },
    {
      id: "size",
      header: _("Size"),
      width: 100,
      sort: true,
      resize: true,
      template: v => (typeof v === "number" ? formatSize(v) : ""),
    },
    {
      id: "date",
      header: _("Date"),
      width: 120,
      sort: true,
      resize: true,
      template: v => (v ? format(v) : ""),
    },
  ], [_, format]);

  const sortClick = useRef(null);
  const resizeClick = useRef(null);

  const tableSelection = useMemo(
    () =>
      selectNavigation
        ? ["/wx-filemanager-parent-link"]
        : [...selection],
    [selectNavigation, selection]
  );

  function click(id, e) {
    if (e && e.target && e.target.className && e.target.className.indexOf("wx-grip") !== -1) return;

    const ctrl = e && (e.ctrlKey || e.metaKey);
    const shift = e && e.shiftKey;

    if (id === "/wx-filemanager-parent-link") {
      if (selection.length && (ctrl || shift)) return;
      api.exec("select-file", {
        type: "navigation",
      });
      return;
    }

    const isFile = id !== "body";
    let newSelection = !isFile && e ? null : id;

    if (!sortClick.current && !resizeClick.current) {
      api.exec("select-file", {
        id: newSelection,
        toggle: ctrl,
        range: shift,
        panel: panel,
      });
    } else {
      sortClick.current = null;
      resizeClick.current = null;
    }
  }

  function backToParent() {
    if (crumbs.length > 1) {
      api.exec("set-path", {
        id: crumbs[crumbs.length - 2].id,
        panel: panel,
        selected: [crumbs[crumbs.length - 1].id],
      });
    }
  }

  function dblclick(id) {
    if (id === "/wx-filemanager-parent-link") {
      return backToParent();
    }
    const item = files.find(a => a.id === id);

    if (item) {
      if (item.type === "folder") {
        api.exec("set-path", {
          id: item.id,
          panel: panel,
        });
      } else {
        api.exec("open-file", {
          id: item.id,
        });
      }
    }
  }

  function handleSort(e) {
    const col = e.key;
    const prevSort = sorts[path];
    let order = !prevSort ? "desc" : "asc";

    if (prevSort && prevSort.key === col) {
      order = prevSort.order === "asc" ? "desc" : "asc";
    }

    api.exec("sort-files", {
      key: col,
      order,
      panel,
      path,
    });
  }

  function initTable(api) {
    api.intercept("sort-rows", e => {
      sortClick.current = true;
      handleSort(e);
      return false;
    });

    api.intercept("select-row", () => false);

    api.on("resize-column", () => (resizeClick.current = true));

    api.intercept("hotkey", () => false);
  }

  const renderedFiles = useMemo(
    () =>
      path !== "/"
        ? [
            {
              id: "/wx-filemanager-parent-link",
              name: _("Back to parent folder"),
            },
            ...files,
          ]
        : files,
    [path, files, _]
  );

  const sortMarks = useMemo(() => {
    if (renderedFiles && sorts && sorts[path]) {
      const { key, order } = sorts[path];
      return { [key]: { order } };
    }
    return undefined;
  }, [renderedFiles, sorts, path]);

  const listRef = useRef(null);
  // delegate click has not cleaning, so need to ensure that it is initialized only once
  const clickHandlers = useRef();
  useEffect(() => {
    if (!clickHandlers.current) {
      clickHandlers.current = { click, dblclick: ev => clickHandlers.current._dblclick(ev), _dblclick: dblclick };
      delegateClick(listRef.current, clickHandlers.current);
    } else {
      clickHandlers.current.click = click;
      clickHandlers.current._dblclick = dblclick;
    }
  }, [click, dblclick]);
  
  return (
    <div onClick={onClick} onContextMenu={onContextMenu} className="wx-SSaVhET7 wx-wrapper">
      <Breadcrumbs panel={panel} />
      <div
        data-id="body"
        className={`wx-SSaVhET7 wx-list ${active ? "wx-active" : ""}`}
        ref={listRef}
      >
        <UploadDropArea>
          <Grid
            init={initTable}
            data={renderedFiles}
            columns={columns}
            selectedRows={tableSelection}
            columnStyle={() => "wx-SSaVhET7 wx-each-cell"}
            sizes={{ rowHeight: 42, headerHeight: 42 }}
            sortMarks={sortMarks}
          />
        </UploadDropArea>
      </div>
    </div>
  );
}

export default View;