import { useEffect, useMemo, useContext } from "react";
import { context } from "@svar-ui/react-core";
import { modalContext } from '../context';

import { Button } from "@svar-ui/react-core";
import { DropDownMenu, registerMenuItem } from "@svar-ui/react-menu";

import Tree from "./Tree/Tree.jsx";
import Drive from "./Drive.jsx";
import UploadButton from "./UploadButton.jsx";

import "./Sidebar.css";

export default function Sidebar({ readonly, menuOptions }) {
  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup("filemanager");
  const { showPrompt } = useContext(modalContext);

  useEffect(() => {
    registerMenuItem("upload", UploadButton);
  }, []);

  function handleClick({ action }) {
    if (action) {
      if (action.id === "add-file")
        showPrompt({
          item: {
            type: "file",
            size: 0,
            date: new Date(),
          },
          add: true,
        });
      else if (action.id === "add-folder")
        showPrompt({
          item: {
            type: "folder",
            date: new Date(),
          },
          add: true,
        });
    }
  }

  const options = useMemo(() => {
    return menuOptions("add").map(option => {
      option.text = _(option.text);
      return option;
    });
  }, [menuOptions, _]);

  return (
    <div className="wx-FlucfALM wx-wrapper">
      {!readonly && (
        <div className="wx-FlucfALM wx-button">
          <DropDownMenu options={options} at="bottom-fit" onClick={handleClick}>
            <Button type="primary block">{_("Add New")}</Button>
          </DropDownMenu>
        </div>
      )}
      <div className="wx-FlucfALM wx-tree">
        <Tree />
      </div>
      <Drive />
    </div>
  );
}