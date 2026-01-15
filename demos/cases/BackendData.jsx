import { useEffect, useRef, useState } from "react";
import { Filemanager } from "../../src";
import { formatSize } from "@svar-ui/filemanager-store";

export default function BackendData() {
  const server = "https://master--svar-filemanager-go--dev.webix.io";

  function previewURL(file, width, height) {
    const ext = file.ext;
    if (ext === "png" || ext === "jpg" || ext === "jpeg")
      return (
        server +
        `/preview?width=${width}&height=${height}&id=${encodeURIComponent(file.id)}`
      );

    return false;
  }

  function iconsURL(file, size) {
    if (file.type !== "file") return server + `/icons/${size}/${file.type}.svg`;

    return server + `/icons/${size}/${file.ext}.svg`;
  }

  function getLink(id, download) {
    return (
      server +
      "/direct?id=" +
      encodeURIComponent(id) +
      (download ? "&download=true" : "")
    );
  }

  function requestInfo(file) {
    if (file.type == "folder" || file.ext == "jpg" || file.ext == "png") {
      return fetch(server + "/info/" + encodeURIComponent(file.id)).then(data => {
        if (data.ok) {
          return data.json().then(d => {
            if (file.type == "folder") d.Size = formatSize(d.Size);
            return d;
          });
        }
      });
    }
  }

  function parseDates(data) {
    data.forEach(item => {
      if (item.date) item.date = new Date(item.date);
    });
    return data;
  }

  const fmApiRef = useRef();

  function loadData(ev) {
    const id = ev.id;
    fetch(server + "/files/" + encodeURIComponent(id))
      .then(data => data.json())
      .then(data => {
        setTimeout(() => {
          fmApiRef.current.exec("provide-data", {
            id,
            data: parseDates(data),
          });
        }, 500);
      });
  }

  const [rawData, setRawData] = useState([]);
  const [drive, setDrive] = useState({});

  useEffect(() => {
    Promise.all([
      fetch(server + "/files").then(data => data.json()),
      fetch(server + "/info").then(data => data.json()),
    ]).then(([files, info]) => {
      setRawData(parseDates(files));
      setDrive(info);
    });
  }, []);

  function init(api) {
    api.on("download-file", ({ id }) => {
      window.open(getLink(id, true), "_self");
    });

    api.on("open-file", ({ id }) => {
      window.open(getLink(id), "_blank");
    });

    fmApiRef.current = api;
  }

  return (
    <Filemanager
      init={init}
      data={rawData}
      drive={drive}
      icons={iconsURL}
      previews={previewURL}
      extraInfo={requestInfo}
      onRequestData={loadData}
    />
  );
}