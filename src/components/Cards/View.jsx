import { useContext } from "react";
import { storeContext } from '../../context';

import Breadcrumbs from "../Breadcrumbs.jsx";
import Panel from "./Panel.jsx";
import UploadDropArea from "../UploadDropArea.jsx";
import { useStore } from "@svar-ui/lib-react";

import "./View.css";

function View() {
  const api = useContext(storeContext);
  const activePanel = useStore(api, "activePanel");

  return (
    <div className="wx-NwohNJzN wx-wrapper">
      <Breadcrumbs panel={activePanel} />
      <UploadDropArea>
        <Panel />
      </UploadDropArea>
    </div>
  );
}

export default View;