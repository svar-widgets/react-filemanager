import { useContext } from "react";
import { Segmented, TwoState } from "@svar-ui/react-core";
import { context } from "@svar-ui/react-core";
import Search from "./ui/Search.jsx";
import Icon from "./ui/Icon.jsx";
import { storeContext } from '../context';
import { useStore } from "@svar-ui/lib-react";
import "./Toolbar.css";

export default function Toolbar({ narrowMode = false, onShowTree }) {
  const api = useContext(storeContext);
  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup("filemanager");

  const mode = useStore(api, "mode");
  const info = useStore(api, "preview");
  const searchValue = useStore(api, "search");

  const options = [
    { icon: "wxi-view-sequential", id: "table" },
    { icon: "wxi-view-grid", id: "cards" },
    { icon: "wxi-view-column", id: "panels" },
  ];

  function changeMode({ value }) {
    api.exec("set-mode", { mode: value });
  }

  function toggleInfo(e) {
    e.preventDefault();
    api.exec("show-preview", { mode: !info });
  }

  function search(e) {
    api.exec("filter-files", { text: e.value });
  }

  return (
    <div className="wx-5PZQQztG wx-toolbar">
      <div className={"wx-5PZQQztG wx-left " + (narrowMode ? "wx-left-narrow" : "")}>
        {!narrowMode ? (
          <div className="wx-5PZQQztG wx-name">{_("Files")}</div>
        ) : !(mode === "panels" || mode === "search") ? (
          <div className="wx-5PZQQztG wx-sidebar-icon" data-id="toggle-tree">
            <Icon onClick={() => onShowTree && onShowTree()} name="subtask" />
          </div>
        ) : null}
        <Search onSearch={search} value={searchValue} />
      </div>

      <div className="wx-5PZQQztG wx-right">
        {!narrowMode ? (
          <div className="wx-5PZQQztG wx-preview-icon">
            <TwoState onClick={toggleInfo} value={info}>
              <i className="wx-5PZQQztG wxi-eye"></i>
            </TwoState>
          </div>
        ) : null}
        <div className="wx-5PZQQztG wx-modes">
          <Segmented value={mode} options={options} onChange={changeMode} />
        </div>
      </div>
    </div>
  );
}