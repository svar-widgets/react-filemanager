import { useContext, useMemo } from "react";
import { context } from "@svar-ui/react-core";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Item.css";

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

  return (
    <>
      {item.id == "/wx-filemanager-parent-link" ? (
        mode !== "search" ? (
          <div className="wx-GAOa4kDV wx-back-item">
            <div
              className={`wx-GAOa4kDV wx-back ${item.navigation ? "wx-selected" : ""}`}
              data-id="/wx-filemanager-parent-link"
            >
              <i className="wx-GAOa4kDV wxi-arrow-left"></i>
              <span>{_("Back to parent folder")}</span>
            </div>
          </div>
        ) : null
      ) : (
        <div
          className={`wx-GAOa4kDV wx-item ${selection?.length && selection.indexOf(item.id) >= 0 ? "wx-selected" : ""}`}
          data-id={item.id}
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
                <span className="wx-GAOa4kDV wx-name">{item.name}</span>
              </div>
              <div data-action-id={item.id} className="wx-GAOa4kDV wx-more">
                <i className="wx-GAOa4kDV wxi-dots-v"></i>
              </div>
            </div>
          ) : (
            <div className="wx-GAOa4kDV wx-info">
              <div className="wx-GAOa4kDV wx-file-name">
                <span className="wx-GAOa4kDV wx-name">{item.name}</span>
              </div>
              <div data-action-id={item.id} className="wx-GAOa4kDV wx-more">
                <i className="wx-GAOa4kDV wxi-dots-v"></i>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}