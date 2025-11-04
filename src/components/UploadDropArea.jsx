import { useContext, useEffect, useMemo, useRef } from "react";
import { storeContext } from '../context';
import { uploaderContext } from '../context';
import { useStore } from "@svar-ui/lib-react";
import { locateAttr } from "@svar-ui/lib-dom";
import "./UploadDropArea.css";

function UploadDropArea({ children }) {
  const api = useContext(storeContext);
  const activePanel = useStore(api, "activePanel");

  const uploaderApi = useContext(uploaderContext);

  const selfRef = useRef(null);

  let apiSettings = useRef({});
  apiSettings.current.drop = () => {
    const el = selfRef.current;
    const panel = locateAttr(el, "data-panel");
    if (panel && panel != activePanel) {
      api.exec("set-active-panel", {
        panel: panel * 1,
      });
    }
  };
  apiSettings.current.dragEnter = () => {
    const el = selfRef.current;
    if (el) el.classList.toggle("wx-active");
  };
  apiSettings.current.dragLeave = () => {
    const el = selfRef.current;
    if (el) el.classList.toggle("wx-active");
  };

  useEffect(() => {
    const el = selfRef.current;
    return uploaderApi.droparea(el, apiSettings.current);
  }, []);

  return (
    <div className="wx-LT9X7tb7 wx-upload-area" ref={selfRef}>
      { children}
    </div>
  );
}

export default UploadDropArea;