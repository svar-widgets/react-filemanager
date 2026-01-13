import { useEffect, useRef, useState } from "react";
import { Filemanager } from "../../src";

function BackendFilter() {
  const server = "https://filemanager-backend.svar.dev";

  function previewURL(file, width, height) {
    const ext = file.ext;
    if (ext === "png" || ext === "jpg" || ext === "jpeg")
      return (
        server +
        `/preview?width=${width}&height=${height}&id=${encodeURIComponent(
          file.id
        )}`
      );

    return false;
  }

  function iconsURL(file, size) {
    if (file.type !== "file")
      return server + `/icons/${size}/${file.type}.svg`;

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

  function parseDates(data) {
    data.forEach(item => {
      if (item.date) item.date = new Date(item.date * 1000);
    });
    return data;
  }

  const fmApiRef = useRef(null);
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

  function init(api) {
    fmApiRef.current = api;

    api.on("download-file", ({ id }) => {
      window.open(getLink(id, true), "_self");
    });

    api.on("open-file", ({ id }) => {
      window.open(getLink(id), "_blank");
    });

    api.intercept("filter-files", ({ text }) => {
      const { panels, activePanel } = fmApiRef.current.getState();
      const id = panels[activePanel].path;
      fetch(
        server +
          "/files" +
          (id == "/" ? "" : `/${encodeURIComponent(id)}`) +
          `?text=${text || ""}`
      )
        .then(data => data.json())
        .then(data => {
          fmApiRef.current.exec("set-mode", { mode: text ? "search" : "cards" });
          fmApiRef.current.exec("provide-data", {
            id,
            data: parseDates(data),
          });
        });
      return false;
    });
  }

  return (
    <Filemanager
      init={init}
      data={rawData}
      drive={drive}
      icons={iconsURL}
      previews={previewURL}
      onRequestData={loadData}
    />
  );
}

export default BackendFilter;