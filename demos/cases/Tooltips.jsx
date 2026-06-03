import { useMemo, useState } from "react";
import { getData, getDrive } from "../data";
import { Filemanager, Tooltip } from "../../src";

export default function Tooltips() {
  const [api, setApi] = useState(null);
  const data = useMemo(() => {
    const d = getData();
    d.push({
      id: "/Hover me for tooltip. Visible for entries with overflow.txt",
      size: 1025,
      date: new Date(2023, 11, 1, 14, 45),
      type: "file",
    });
    return d;
  }, []);

  return (
    <Tooltip overflow api={api}>
      <Filemanager ref={setApi} data={data} drive={getDrive()} />
    </Tooltip>
  );
}
