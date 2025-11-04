import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";

const Readonly = () => {
  return <Filemanager data={getData()} drive={getDrive()} readonly />;
};

export default Readonly;