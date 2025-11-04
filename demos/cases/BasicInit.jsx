import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";

function BasicInit() {
  return <Filemanager data={getData()} drive={getDrive()} />;
}

export default BasicInit;