import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { context } from "@svar-ui/react-core";
import { dateToString } from "@svar-ui/lib-dom";
import { formatSize } from "@svar-ui/filemanager-store";
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import Icon from "./ui/Icon.jsx";
import { storeContext } from '../context';
import "./Info.css";

function Info({ narrowMode, extraInfo }) {
  const api = useContext(storeContext);
  const { preview, icon } = api.templates;

  const locale = useContext(context.i18n);
  const _ = useMemo(() => locale.getGroup("filemanager"), [locale]);
  const format = useMemo(
    () => dateToString("%D, %d %F %Y, %H:%i", locale.getRaw().calendar),
    [locale]
  );

  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");
  const activePanel = useStore(api, "activePanel");
  const rPreview = useStore(api, "preview");
  const search = useStore(api, "search");
  
  const found = useMemo(() => {
    const selectedLength =
      panels && activePanel != null
        ? panels[activePanel]?._selected?.length || 0
        : 0;
    return search && !selectedLength;
  }, [search, panelsCounter, activePanel]);

  const items = useMemo(() => {
    const panel =
      panels && activePanel != null
        ? panels[activePanel]
        : null;
    if (!panel) return [];
    return found ? panel._files : panel._selected;
  }, [found, panelsCounter, activePanel]);

  const getTotalCount = useCallback(
    (folders, files) => {
      return (
        (folders
          ? `${folders} ${_(folders > 1 ? "folders" : "folder")} `
          : "") + (files ? `${files} ${_(files > 1 ? "files" : "file")}` : "")
      );
    },
    [_]
  );

  const closePreview = useCallback(() => {
    api.exec("show-preview", { mode: !rPreview });
  }, [api, rPreview]);

  const getItemType = useCallback(
    (item) => {
      return item.type === "folder"
        ? _("Folder")
        : item.ext || _("Unknown file");
    },
    [_]
  );

  const basic = useMemo(() => {
    let name;
    let item;
    let previewSrc;
    let iconSrc;
    let showDownloadIcon;
    let type;
    let totalCount;
    let totalSize;

    if (items.length === 1 && !found) {
      item = items[0];
      name = item.name;
      const prev = preview(item, 400, 500);
      if (prev) {
        previewSrc = prev;
        iconSrc = "";
      } else {
        iconSrc = icon(item, "big");
        previewSrc = "";
      }
      showDownloadIcon = item.type !== "folder";
    } else {
      item = showDownloadIcon = null;
      name = "";
      if (items.length) {
        let sum = 0;
        let folders = 0;
        let files = 0;
        let extArr = [];
        let incorrectSize;
        items.forEach((item) => {
          if (typeof item.size === "undefined") {
            incorrectSize = true;
            sum = undefined;
          }

          if (!incorrectSize) {
            sum += item.size;
          }

          extArr.push(getItemType(item));
          item.type === "folder" ? folders++ : files++;
        });

        const singleExt = new Set(extArr);
        type = singleExt.size > 1 ? _("multiple") : [...singleExt][0];
        totalCount = getTotalCount(folders, files);
        totalSize = sum;
        if (!found) name = _("Multiple files");
      }
      iconSrc = icon(
        {
          type: found ? "search" : items.length ? "multiple" : "none",
        },
        "big"
      );
      previewSrc = "";
    }

    return {
      name,
      item,
      previewSrc,
      iconSrc,
      showDownloadIcon,
      type,
      totalCount,
      totalSize,
    };
  }, [items, found, preview, icon, _, getItemType, getTotalCount]);

  const name = basic.name;

  const downloadFile = useCallback(() => {
    api.exec("download-file", {
      id: items[0],
    });
  }, [api, items]);

  const getExtraInfo = useCallback(
    async (item) => {
      if (!extraInfo || !item) return null;
      try {
        return await extraInfo(item);
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    [extraInfo]
  );

  const [extraValues, setExtraValues] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setExtraValues(null);
    Promise.resolve(getExtraInfo(basic.item))
      .then((values) => {
        if (!cancelled) setExtraValues(values);
      })
      .catch(() => {
        if (!cancelled) setExtraValues(null);
      });
    return () => {
      cancelled = true;
    };
  }, [getExtraInfo, basic.item]);

  return (
    <div className="wx-O0BTtRrH wx-wrapper">
      {items && items.length ? (
        <>
          <div className="wx-O0BTtRrH wx-preview">
            <div className="wx-O0BTtRrH wx-toolbar">
              <div className="wx-O0BTtRrH wx-name">{name}</div>
              <div className="wx-O0BTtRrH wx-icons">
                {basic.showDownloadIcon ? (
                  <Icon name="download" onClick={downloadFile} />
                ) : null}
                {narrowMode ? <Icon name="close" onClick={closePreview} /> : null}
              </div>
            </div>
            {basic.previewSrc ? (
              <div className="wx-O0BTtRrH wx-img-wrapper">
                <img src={basic.previewSrc} alt={_("A miniature file preview")} />
              </div>
            ) : basic.iconSrc ? (
              <div className="wx-O0BTtRrH wx-icon-wrapper">
                <img src={basic.iconSrc} alt={_("A miniature file preview")} />
              </div>
            ) : (
              <div className="wx-O0BTtRrH wx-icon-wrapper">
                {basic.item ? (
                  <i className={`wx-O0BTtRrH wx-icon wxi-${basic.item.type}`}></i>
                ) : (
                  <i
                    className={`wx-O0BTtRrH wx-icon wxi-${found ? "search" : "file-multiple-outline"}`}
                  ></i>
                )}
              </div>
            )}
          </div>
          <div className="wx-O0BTtRrH wx-info-panel">
            <div className="wx-O0BTtRrH wx-title">{found ? _("Found") : _("Information")}</div>
            <div className="wx-O0BTtRrH wx-list">
              {basic.item ? (
                <>
                  <span className="wx-O0BTtRrH wx-name">{_("Type")}</span>
                  <span className="wx-O0BTtRrH wx-value">{getItemType(basic.item)}</span>
                  {typeof basic.item.size !== "undefined" ? (
                    <>
                      <span className="wx-O0BTtRrH wx-name">{_("Size")}</span>
                      <span className="wx-O0BTtRrH wx-value">{formatSize(basic.item.size)}</span>
                    </>
                  ) : null}
                  <span className="wx-O0BTtRrH wx-name">{_("Date")}</span>
                  <span className="wx-O0BTtRrH wx-value">{format(basic.item.date)} </span>
                </>
              ) : (
                <>
                  <span className="wx-O0BTtRrH wx-name">{_("Count")}</span>
                  <span className="wx-O0BTtRrH wx-value">{basic.totalCount}</span>
                  <span className="wx-O0BTtRrH wx-name">{_("Type")}</span>
                  <span className="wx-O0BTtRrH wx-value">{basic.type}</span>
                  {typeof basic.totalSize !== "undefined" ? (
                    <>
                      <span className="wx-O0BTtRrH wx-name">{_("Size")}</span>
                      <span className="wx-O0BTtRrH wx-value">{formatSize(basic.totalSize)}</span>
                    </>
                  ) : null}
                </>
              )}
              {extraValues
                ? Object.entries(extraValues).map(([n, value]) => (
                    <React.Fragment key={n}>
                      <span className="wx-O0BTtRrH wx-name">{n}</span>
                      <span className="wx-O0BTtRrH wx-value">{value}</span>
                    </React.Fragment>
                  ))
                : null}
            </div>
          </div>
        </>
      ) : (
        <div className="wx-O0BTtRrH wx-no-info-panel">
          <div className="wx-O0BTtRrH wx-toolbar">
            <div className="wx-O0BTtRrH wx-name">{name}</div>
            <div className="wx-O0BTtRrH wx-icons">
              {narrowMode ? <Icon name="close" onClick={closePreview} /> : null}
            </div>
          </div>
          <div className="wx-O0BTtRrH wx-no-info-wrapper">
            <div className="wx-O0BTtRrH wx-no-info">
              {basic.previewSrc ? (
                <div className="wx-O0BTtRrH wx-img-wrapper">
                  <img src={basic.previewSrc} alt={_("A miniature file preview")} />
                </div>
              ) : basic.iconSrc ? (
                <div className="wx-O0BTtRrH wx-icon-wrapper">
                  <img src={basic.iconSrc} alt={_("A miniature file preview")} />
                </div>
              ) : (
                <div className="wx-O0BTtRrH wx-icon-wrapper">
                  <i
                    className={`wx-O0BTtRrH wx-icon wxi-${found ? "search" : "message-question-outline"}`}
                  ></i>
                </div>
              )}
              <span className="wx-O0BTtRrH wx-text">
                {found ? "" : _("Select file or folder to view details")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Info;