import { useState, useEffect, useRef, useCallback } from "react";
import { RestDataProvider } from "@svar-ui/filemanager-data-provider";
import { formatSize } from "@svar-ui/filemanager-store";
import { Filemanager } from "../../src";

const server = "https://filemanager-backend.svar.dev";

export default function DataProvider() {
  const restProviderRef = useRef(null);
  if (!restProviderRef.current) {
    restProviderRef.current = new RestDataProvider(server);
  }
  const restProvider = restProviderRef.current;

  const fmApiRef = useRef(null);

  const previewURL = useCallback((file, width, height) => {
    const ext = file.ext;
    if (ext === "png" || ext === "jpg" || ext === "jpeg") {
      return (
        server +
        `/preview?width=${width}&height=${height}&id=${encodeURIComponent(file.id)}`
      );
    }
    return false;
  }, []);

  const iconsURL = useCallback((file, size) => {
    if (file.type !== "file")
      return server + `/icons/${size}/${file.type}.svg`;

    return server + `/icons/${size}/${file.ext}.svg`;
  }, []);

  const getLink = useCallback((id, download) => {
    return (
      server +
      "/direct?id=" +
      encodeURIComponent(id) +
      (download ? "&download=true" : "")
    );
  }, []);

  const requestInfo = useCallback((file) => {
    if (file.type == "folder" || file.ext == "jpg" || file.ext == "png") {
      return restProvider.loadInfo(file.id).then((data) => {
        if (file.type == "folder") data.Size = formatSize(data.Size);
        return data;
      });
    }
  }, [restProvider]);

  const [data, setData] = useState([]);
  const [drive, setDrive] = useState({});

  const init = useCallback((api) => {
    fmApiRef.current = api;
    api.setNext(restProvider);

    fmApiRef.current.on("download-file", ({ id }) => {
      window.open(getLink(id, true), "_self");
    });

    fmApiRef.current.on("open-file", ({ id }) => {
      window.open(getLink(id), "_blank");
    });
  }, [restProvider, getLink]);

  useEffect(() => {
    restProvider.on("file-renamed", ({ id, newId }) => {
      const name = newId.slice(newId.lastIndexOf("/") + 1);
      fmApiRef.current.exec("rename-file", { id, name, skipProvider: true });
    });

    Promise.all([restProvider.loadFiles(), restProvider.loadInfo()]).then(
      ([files, info]) => {
        setData(files);
        setDrive(info);
      }
    );
  }, [restProvider]);

  const loadData = useCallback((ev) => {
    const id = ev.id;
    restProvider.loadFiles(id).then((files) => {
      fmApiRef.current.exec("provide-data", {
        id,
        data: files,
      });
    });
  }, [restProvider]);

  return (
    <Filemanager
      init={init}
      data={data}
      drive={drive}
      icons={iconsURL}
      previews={previewURL}
      extraInfo={requestInfo}
      onRequestData={loadData}
    />
  );
}