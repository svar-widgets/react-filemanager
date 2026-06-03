import { useContext, useMemo } from "react";
import { setID } from "@svar-ui/lib-dom";
import { context } from "@svar-ui/react-core";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Item.css";

function splitFileName(name) {
  const MAX_TAIL_LENGTH = 10;
  const NO_EXT_TAIL_LENGTH = 5;

  const lastDotIndex = name.lastIndexOf(".");
  const hasExtension = lastDotIndex > 0 && lastDotIndex < name.length - 1;
  const tailLength = hasExtension
    ? Math.min(MAX_TAIL_LENGTH, name.length - lastDotIndex)
    : Math.min(NO_EXT_TAIL_LENGTH, name.length);

  const nameStart = name.slice(0, -tailLength);
  const nameTail = name.slice(-tailLength);

  return [nameStart, nameTail];
}

export default function Item({ item }) {
  const api = useContext(storeContext);
  const _ = useContext(context.i18n).getGroup("filemanager");
  const templates = useContext(storeContext).templates;

  const [panels] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");
  const mode = useStore(api, "mode");

  const selection = panels[activePanel].selected;

  const preview = useMemo(() => templates.preview(item, 214, 163), [templates, item]);
  const icon = useMemo(() => templates.icon(item, "big"), [templates, item]);
  const [nameStart, nameTail] = useMemo(() => splitFileName(item.name), [item.name]);

  return (
    <>
      {item.id === "/wx-filemanager-parent-link" ? (
        mode !== "search" ? (
          <div className="wx-GAOa4kDV wx-back-item">
            <div
              className={`wx-GAOa4kDV wx-back ${item.navigation ? "wx-selected" : ""}`}
              data-id={setID("/wx-filemanager-parent-link")}
            >
              <i className="wx-GAOa4kDV wxi-arrow-left"></i>
              <span>{_("Back to parent folder")}</span>
            </div>
          </div>
        ) : null
      ) : (
        <div
          className={`wx-GAOa4kDV wx-item ${selection?.length && selection.indexOf(item.id) >= 0 ? "wx-selected" : ""}`}
          data-id={setID(item.id)}
        >
          {preview ? (
            <div className="wx-GAOa4kDV wx-preview wx-file-preview">
              <img className="wx-GAOa4kDV wx-card-preview" alt={_("A miniature file preview")} src={preview} />
            </div>
          ) : icon ? (
            <div className="wx-GAOa4kDV wx-preview wx-file-icon">
              <img className="wx-GAOa4kDV wx-card-preview" alt="" src={icon} />
            </div>
          ) : (
            <div className="wx-GAOa4kDV wx-preview">
              <i className={`wx-GAOa4kDV wxi-${item.type}`}></i>
            </div>
          )}

          {item.type === "folder" ? (
            <div className="wx-GAOa4kDV wx-info">
              <div className="wx-GAOa4kDV wx-folder-name">
                <span className="wx-GAOa4kDV wx-type">{_("Folder")}</span>
                <span className="wx-GAOa4kDV wx-name">
                  <span>{nameStart}</span><span>{nameTail}</span>
                </span>
              </div>
              <div data-action-id={setID(item.id)} className="wx-GAOa4kDV wx-more">
                <i className="wx-GAOa4kDV wxi-dots-v"></i>
              </div>
            </div>
          ) : (
            <div className="wx-GAOa4kDV wx-info">
              <div className="wx-GAOa4kDV wx-file-name">
                <span className="wx-GAOa4kDV wx-name">
                  <span>{nameStart}</span><span>{nameTail}</span>
                </span>
              </div>
              <div data-action-id={setID(item.id)} className="wx-GAOa4kDV wx-more">
                <i className="wx-GAOa4kDV wxi-dots-v"></i>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
