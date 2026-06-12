import { useState, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { context } from "@svar-ui/react-core";
import { delegateClick, setID } from "@svar-ui/lib-dom";
import Item from "./Item.jsx";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Panel.css";

// Must match Item.css: width 210px + margin-right 20px
const COL_STRIDE = 230;
// Must match Item.css: height 200px + margin-bottom 20px
const ROW_HEIGHT = 220;
// Container left + right padding
const H_PADDING = 40;
// Back-link: margin 6px top + 18px line-height + 6px bottom
const BACK_LINK_HEIGHT = 30;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 10;
const OVERSCAN = 3;

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
    if (cardsRef.current) {
      if (!clickHandlers.current) {
        clickHandlers.current = { click, dblclick: ev => clickHandlers.current._dblclick(ev), _dblclick: dblclick, context: applySelection };
        delegateClick(cardsRef.current, clickHandlers.current);
      } else {
        clickHandlers.current.click = click;
        clickHandlers.current._dblclick = dblclick;
        clickHandlers.current.context = applySelection;
      }
    }
  }, [click, dblclick, applySelection]);

  const hasBackLink = path !== "/" && mode !== "search";
  const paddingStart = hasBackLink ? 0 : PADDING_TOP;

  // layout: container width + scroll position + viewport height
  const [layout, setLayout] = useState({ width: null, scrollTop: 0, viewportHeight: 600 });

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    setLayout({
      width: el.getBoundingClientRect().width,
      scrollTop: el.scrollTop,
      viewportHeight: el.clientHeight,
    });

    const onScroll = () => setLayout(l => ({ ...l, scrollTop: el.scrollTop }));
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      setLayout(l => ({
        ...l,
        width: el.getBoundingClientRect().width,
        viewportHeight: el.clientHeight,
      }));
    });
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const { rows, virtualItems, totalSize } = useMemo(() => {
    if (!layout.width) return { rows: [], virtualItems: [], totalSize: 0 };

    const colCount = Math.max(1, Math.floor((layout.width - H_PADDING) / COL_STRIDE));

    // bucket flat file list into rows
    const rows = [];
    const rowHeights = [];
    for (let i = 0; i < renderedFiles.length; ) {
      const item = renderedFiles[i];
      if (item.id === "/wx-filemanager-parent-link") {
        rows.push([item]);
        rowHeights.push(BACK_LINK_HEIGHT);
        i++;
      } else {
        rows.push(renderedFiles.slice(i, i + colCount));
        rowHeights.push(ROW_HEIGHT);
        i += colCount;
      }
    }

    // cumulative offsets: offsets[i] = y-start of row i
    const offsets = new Array(rows.length + 1);
    offsets[0] = paddingStart;
    for (let i = 0; i < rows.length; i++) {
      offsets[i + 1] = offsets[i] + rowHeights[i];
    }
    const totalSize = (offsets[rows.length] || paddingStart) + PADDING_BOTTOM;

    if (!rows.length) return { rows, virtualItems: [], totalSize };

    // binary search: first row whose bottom > scrollTop
    const rangeStart = layout.scrollTop;
    const rangeEnd = layout.scrollTop + layout.viewportHeight;
    let lo = 0, hi = rows.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid + 1] <= rangeStart) lo = mid + 1;
      else hi = mid;
    }
    const startIdx = Math.max(0, lo - OVERSCAN);

    // binary search: last row whose top < rangeEnd
    lo = 0; hi = rows.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (offsets[mid] < rangeEnd) lo = mid;
      else hi = mid - 1;
    }
    const endIdx = Math.min(rows.length - 1, lo + OVERSCAN);

    const virtualItems = [];
    for (let i = startIdx; i <= endIdx; i++) {
      virtualItems.push({ index: i, start: offsets[i], size: rowHeights[i] });
    }

    return { rows, virtualItems, totalSize };
  }, [layout, renderedFiles, paddingStart]);

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
      className={"wx-iyjASZCY " + ("wx-cards" + (hasBackLink ? " wx-has-back-link" : ""))}
      data-id={setID("body")}
      ref={cardsRef}
    >
      {layout.width !== null && (
        <div style={{ height: totalSize, position: "relative" }}>
          {virtualItems.map(vRow => (
            <div
              key={vRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${vRow.size}px`,
                transform: `translateY(${vRow.start}px)`,
                display: "flex",
              }}
            >
              {rows[vRow.index].map(item => (
                <Item item={item} key={item.id} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Panel;
