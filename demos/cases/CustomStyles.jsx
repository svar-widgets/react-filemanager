import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";
import "./CustomStyles.css";

export default function CustomStyles() {
  return (
    <div className="wx-azWmsyFW filemanager">
      <Filemanager data={getData()} drive={getDrive()} />
    </div>
  );
}