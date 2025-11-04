import { useMemo, useContext } from "react";
import { context } from "@svar-ui/react-core";
import { storeContext } from '../../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Folder.css";

function Folder({ folderIcon = false, folder = {} }) {
  const api = useContext(storeContext);
  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");

  const path = useMemo(() => panels[activePanel].path, [panelsCounter, activePanel]);
  
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const hasFolders = useMemo(
    () => !!folder.data?.find((i) => i.type === "folder"),
    [folder]
  );
  const name = useMemo(
    () => (folder.id == "/" ? _(folder.name) : folder.name),
    [folder, _]
  );
  const padding = useMemo(
    () => (folder.$level > 1 ? (folder.$level - 1) * 20 : 0),
    [folder]
  );
  const open = folder.open;

  return (
    <>
      <li
        data-id={folder.id}
        className={`wx-NYfhvGIt wx-folder${path === folder.id ? " wx-selected" : ""}`}
        style={{ paddingLeft: `${padding}px` }}
      >
        {hasFolders ? (
          <i
            className={`wx-NYfhvGIt wx-toggle wxi-${open ? "angle-down" : "angle-right"}`}
            data-action="toggle"
          ></i>
        ) : (
          <span className="wx-NYfhvGIt wx-toggle-placeholder"></span>
        )}
        <i className={"wx-NYfhvGIt " + (folderIcon || "wxi-folder")}></i>
        <span className="wx-NYfhvGIt wx-name"> {name} </span>
      </li>

      {open && folder.data && folder.data.length && hasFolders ? (
        <>
          {folder.data.map((child) =>
            child.type === "folder" ? (
              <Folder key={child.id} folder={child} />
            ) : null
          )}
        </>
      ) : null}
    </>
  );
}

export default Folder;