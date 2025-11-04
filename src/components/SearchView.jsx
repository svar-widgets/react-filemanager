import { useContext, useMemo, Fragment } from "react";
import { context } from "@svar-ui/react-core";
import Panel from "./Cards/Panel.jsx";
import Icon from "./ui/Icon.jsx";
import { storeContext } from '../context';
import { useStore, useStoreWithCounter } from "@svar-ui/lib-react";
import "./SearchView.css";

export default function SearchView() {
  const _i18n = useContext(context.i18n);
  const _ = _i18n.getGroup("filemanager");
  const api = useContext(storeContext);

  const activePanel = useStore(api, "activePanel");
  const [panels] = useStoreWithCounter(api, "panels");

  const crumbs = useMemo(() => {
    return panels[activePanel]._crumbs;
  }, [panels, activePanel]);

  function clearSearch() {
    api.exec("filter-files", {
      text: "",
    });
  }

  return (
    <div className="wx-GDJvtROw wx-search">
      <div className="wx-GDJvtROw wx-toolbar">
        <div className="wx-GDJvtROw wx-back-icon">
          <Icon name="angle-left" onClick={clearSearch} />
        </div>
        <div className="wx-GDJvtROw wx-text">
          {_("Search results in")}
          {Array.isArray(crumbs) &&
            crumbs.map((crumb, i) => (
              <Fragment key={i}>
                {i ? "/" : null}
                {crumb.id == "/" ? _(crumb.name) : crumb.name}
              </Fragment>
            ))}
        </div>
      </div>
      <Panel />
    </div>
  );
}