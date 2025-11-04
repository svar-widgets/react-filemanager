import { useState, useEffect, useMemo, useRef, useContext, useCallback } from "react";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import { delegateClick } from "@svar-ui/lib-dom";
import Folder from "./Folder.jsx";
import { getSelectionOnNavigation } from "@svar-ui/filemanager-store";
import "./Tree.css";

export default function Tree() {
  const api = useContext(storeContext);

  const [data, dataCounter] = useStoreWithCounter(api, "data");
  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");

  const crumbs = useMemo(() => panels[activePanel]._crumbs, [panelsCounter, activePanel]);

  const toggle = useCallback(
    (id) => {
      api.exec("open-tree-folder", {
        id,
        mode: !data.byId(id).open,
      });
    },
    [api, dataCounter]
  );

  const click = useCallback(
    (id) => {
      const selectedId = getSelectionOnNavigation(id, crumbs);
      api.exec("set-path", {
        id,
        panel: activePanel,
        ...(selectedId && { selected: [selectedId] }),
      });
    },
    [api, crumbs, activePanel]
  );

  const [folders, setFolders] = useState([]);
  useEffect(() => {
    setFolders(data.byId(0).data);
  }, [dataCounter]);

  const ulRef = useRef(null);
  // delegate click has not cleaning, so need to ensure that it is initialized only once
  const clickHandlers = useRef();
  useEffect(() => {
    if (!clickHandlers.current) {
      clickHandlers.current = { click, toggle };
      delegateClick(ulRef.current, clickHandlers.current);
    } else {
        clickHandlers.current.click = click;
        clickHandlers.current.toggle = toggle;    
    }
  }, [click, toggle]);

  return (
    <ul ref={ulRef} className="wx-LyHJ6R6A">
      {folders.map((folder) =>
        folder.type === "folder" ? <Folder key={folder.id} folder={folder} /> : null
      )}
    </ul>
  );
}