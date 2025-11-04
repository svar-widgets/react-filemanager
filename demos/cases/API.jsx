import { useState, useRef, useCallback } from "react";
import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";
import { Button } from "@svar-ui/react-core";
import "./API.css";

const data = getData();
const drive = getDrive();

function API() {
  const api = useRef(null);
  const [serializedData, setSerializedData] = useState([]);

  const serialize = useCallback(() => {
    const result = api.current.serialize("/Code");
    setSerializedData(result);
    api.current.exec("provide-data", {
      id: "/Code",
      data: [],
    });
  }, []);

  const parse = useCallback(() => {
    api.current.exec("provide-data", {
      id: "/Code",
      data: serializedData,
    });
  }, [serializedData]);

  return (
    <div className="wx-DZXRPbpa demo">
      <div className="wx-DZXRPbpa bar">
        <Button onClick={serialize}>
          Serialize and clear the "Code" folder
        </Button>
        <Button onClick={parse}>Load data back</Button>
      </div>
      <Filemanager
        ref={api}
        data={data}
        drive={drive}
        panels={[{ path: "/Code" }]}
      />
    </div>
  );
}

export default API;