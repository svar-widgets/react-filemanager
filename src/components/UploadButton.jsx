import { useContext, useCallback } from "react";
import { context } from "@svar-ui/react-core";
import { uploaderContext } from '../context';
import "./UploadButton.css";

const apiKey = "uploaderApi";
function UploadButton({ option }) {
  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup("filemanager");
  const uploaderApi = useContext(uploaderContext);

  const openFileChooserDialog = useCallback(() => {
    uploaderApi.open({});
  }, [uploaderApi]);

  return (
    <div className="wx-9XiKcxq5 wx-upload-button" onClick={openFileChooserDialog}>
      <span>{_(option.text)}</span>
    </div>
  );
}

export default UploadButton;