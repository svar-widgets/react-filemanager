import { useContext, useMemo, useState } from "react";
import { Globals, Modal, Text } from "@svar-ui/react-core";
import { context } from "@svar-ui/react-core";
import { storeContext, modalContext as ModalContext } from "../context";
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./Modals.css";

function Modals({ children }) {
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const api = useContext(storeContext);
  const [panels] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");

  const path = panels[activePanel].path;

  const [prompt, setPrompt] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [value, setValue] = useState("");
  const [initialName, setInitialName] = useState("");
  const [error, setError] = useState(false);

  function promptOk() {
    const name = value.trim();
    if (!name) {
      setError(true);
      return;
    }

    if (prompt.add) {
      api.exec("create-file", {
        file: {
          ...prompt.item,
          name,
        },
        parent: path,
      });
    } else {
      if (initialName !== name)
        api.exec("rename-file", { id: prompt.item.id, name });
    }

    closePrompt();
  }

  function closePrompt() {
    setPrompt(null);
    setError(null);
    setInitialName("");
    setValue("");
  }

  function confirmOk() {
    api.exec("delete-files", { ids: confirm.selected });
    setConfirm(null);
  }

  const modalsContextValue = useMemo(
    () => ({
      showPrompt(config) {
        const defaultName =
          config.item.name ||
          (config.item.type === "folder"
            ? _("New folder")
            : `${_("New file")}.txt`);
        setInitialName(defaultName);
        setValue(defaultName);
        setPrompt({ ...config });
      },
      showConfirm(config) {
        setConfirm({ ...config });
      },
    }),
    [_]
  );

  return (
    <ModalContext.Provider value={modalsContextValue}>
      <Globals>{children}</Globals>

      {prompt ? (
        <Modal
          title={_(`Enter ${prompt.item.type} name`)}
          onConfirm={promptOk}
          onCancel={closePrompt}
        >
          <Text
            error={error}
            select={true}
            focus={true}
            value={value}
            onChange={({ value }) => setValue(value)}
          />
        </Modal>
      ) : null}

      {confirm ? (
        <Modal
          title={_("Are you sure you want to delete these items:")}
          onConfirm={confirmOk}
          onCancel={() => setConfirm(null)}
        >
          {confirm.selected ? (
            <ul className="wx-gq7BMzEP wx-list">
              {confirm.selected.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : null}
        </Modal>
      ) : null}
    </ModalContext.Provider>
  );
}

export default Modals;