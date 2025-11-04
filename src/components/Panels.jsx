import { useContext } from "react";
import TableView from "./Table/View.jsx";
import { storeContext } from '../context';
import { useStore } from "@svar-ui/lib-react";
import "./Panels.css";

export default function Panels() {
  const api = useContext(storeContext);
  const activePanel = useStore(api, "activePanel");
  
  function toggleActive(panel) {
    api.exec("set-active-panel", { panel });
  }

  return (
    <div className="wx-L55BfJa2 wx-panels" data-id="body">
      <div className="wx-L55BfJa2 wx-item" data-panel={0}>
        <TableView
          panel={0}
          active={activePanel == 0}
          onClick={() => toggleActive(0)}
          onContextMenu={() => toggleActive(0)}
        />
      </div>
      <div className="wx-L55BfJa2 wx-item" data-panel={1}>
        <TableView
          panel={1}
          active={activePanel == 1}
          onClick={() => toggleActive(1)}
          onContextMenu={() => toggleActive(1)}
        />
      </div>
    </div>
  );
}