import { useRef, useCallback } from "react";
import { getData, getDrive } from "../data";
import { Filemanager, getMenuOptions } from "../../src/";

export default function ContextMenu() {
  const fmApiRef = useRef();

  const init = useCallback((api) => {
    fmApiRef.current = api;

    fmApiRef.current.on("download-file", ({ id }) => {
      window.alert(`No server data - no download. File ID: ${id}`);
    });
  }, []);

  const menuOptions = useCallback((mode, item) => {
    switch (mode) {
      case "file":
      case "folder":
        if (item.id === "/Code") return false;
        if (item.id === "/Pictures")
          return getMenuOptions().filter((o) => o.id === "rename");
        return [
          ...getMenuOptions(mode),
          {
            comp: "separator",
          },
          {
            icon: "wxi-cat",
            text: "Clone",
            id: "clone",
            hotkey: "Ctrl+Shift+V",
            handler: ({ context }) => {
              const { panels, activePanel } = fmApiRef.current.getState();
              fmApiRef.current.exec("copy-files", {
                ids: [context.id],
                target: panels[activePanel].path,
              });
            },
          },
        ];

      default:
        return getMenuOptions(mode);
    }
  }, []);

  return (
    <Filemanager
      init={init}
      data={getData()}
      drive={getDrive()}
      menuOptions={menuOptions}
    />
  );
}