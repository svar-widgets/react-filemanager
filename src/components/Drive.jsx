import { useContext, useMemo } from "react";
import { useStore } from "@svar-ui/lib-react";
import { context } from "@svar-ui/react-core";
import { formatSize } from "@svar-ui/filemanager-store";
import { storeContext } from '../context';
import "./Drive.css";

function Drive() {
  const api = useContext(storeContext);
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const drive = useStore(api, "drive");

  const used = drive ? drive.used : "";
  const total = drive ? drive.total : "";

  if (!(used && total)) {
    return null;
  }

  return (
    <div className="wx-DetSyKGG wx-drive">
      <progress value={used} max={total} className="wx-DetSyKGG wx-progress"></progress>
      <p>
        {formatSize(used)} {_("of")} {formatSize(total)} {_("used")}
      </p>
    </div>
  );
}

export default Drive;