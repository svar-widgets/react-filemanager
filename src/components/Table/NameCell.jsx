import { useContext, useState } from "react";
import { context } from "@svar-ui/react-core";
import { storeContext } from '../../context';
import "./NameCell.css";

function NameCell({ row }) {
  const i18n = useContext(context.i18n);
  const [_] = useState(() => i18n.getGroup("filemanager"));

  const filemanagerStore = useContext(storeContext);
  const templates = filemanagerStore.templates;

  const [icon] = useState(() => templates.icon(row, "small"));

  return (
    <div className="wx-qgAqG6sL wx-name-cell">
      {row.id === "/wx-filemanager-parent-link" ? (
        <>
          <i className="wx-qgAqG6sL wxi-arrow-left"></i>
          <span className="wx-qgAqG6sL wx-name"> {_("Back to parent folder")}</span>
        </>
      ) : (
        <>
          {icon ? (
            <img className="wx-qgAqG6sL wx-icon" alt="" src={icon} height="24px" width="24px" />
          ) : (
            <i className={`wx-qgAqG6sL wxi-${row.type}`}></i>
          )}
          <span className="wx-qgAqG6sL wx-name"> {row.name} </span>
        </>
      )}
    </div>
  );
}

export default NameCell;