import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { context } from "@svar-ui/react-core";
import { delegateClick } from "@svar-ui/lib-dom";
import { getSelectionOnNavigation } from "@svar-ui/filemanager-store";
import Icon from "./ui/Icon.jsx";
import { storeContext } from '../context';
import { useStoreWithCounter } from "@svar-ui/lib-react";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ panel }) {
  const api = useContext(storeContext);
  const i18n = useContext(context.i18n);
  const _ = useMemo(() => i18n.getGroup("filemanager"), [i18n]);

  const [panels, panelsCounter] = useStoreWithCounter(api, "panels");
  const files = useMemo(() => panels[panel]._files, [panelsCounter, panel]);
  const crumbs = useMemo(() => panels[panel]._crumbs || [], [panelsCounter, panel]);

  function click(id) {
    const selectedId = getSelectionOnNavigation(id, crumbs);
    api.exec("set-path", {
      id,
      panel,
      ...(selectedId && { selected: [selectedId] }),
    });
  }

  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (files) setLoading(null);
  }, [files]);

  function refresh() {
    setLoading(true);
    api.exec("request-data", {
      id: crumbs[crumbs.length - 1].id,
    });
    setTimeout(() => {
      setLoading(null);
    }, 5000);
  }

  const rootRef = useRef(null);
  // delegate click has not cleaning, so need to ensure that it is initialized only once
  const clickHandlers = useRef();
  useEffect(() => {
    if (!clickHandlers.current) {
      clickHandlers.current = { click };
      delegateClick(rootRef.current, clickHandlers.current);
    } else {
      clickHandlers.current.click = click;
    }
  }, [click]);

  return (
    <div className="wx-SNY5LTYx wx-breadcrumbs" data-menu-ignore="true" ref={rootRef}>
      <div className="wx-SNY5LTYx wx-refresh-icon">
        <Icon name="refresh" spin={!!loading} onClick={refresh} />
      </div>
      {crumbs.map((crumb, i) => (
        <React.Fragment key={i}>
          {i ? <Icon name="angle-right" /> : null}
          <div className="wx-SNY5LTYx wx-item" data-id={crumb.id} data-menu-ignore="true">
            {crumb.id == "/" ? _(crumb.name) : crumb.name}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}