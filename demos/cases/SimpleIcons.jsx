import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";

function SimpleIcons() {
  return <Filemanager data={getData()} drive={getDrive()} icons={"simple"} />;
}

export default SimpleIcons;