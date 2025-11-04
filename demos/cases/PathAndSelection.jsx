import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";

export default function PathAndSelection() {
  const panels = [
    {
      path: "/Music",
      selected: ["/Music/Best_albums.xls"],
    },
    {
      path: "/",
      selected: ["/Music"],
    },
  ];

  return (
    <Filemanager data={getData()} drive={getDrive()} mode={"panels"} panels={panels} />
  );
}