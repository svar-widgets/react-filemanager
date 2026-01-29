import {
  useMemo,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';


// core widgets lib
import { Locale } from '@svar-ui/react-core';
import { en } from '@svar-ui/grid-locales';

// stores
import { EventBusRouter } from "@svar-ui/lib-state";
import { DataStore, getMenuOptions } from "@svar-ui/filemanager-store";
import Modals from "./Modals.jsx";
import { whitelist } from "../icons";
import { storeContext as StoreContext } from '../context';

// store factory (used by DataStore)
import { writable } from '@svar-ui/lib-react';

// ui
import Layout from "./Layout.jsx";

const camelize = (s) =>
  s
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ''))
    .join('');

function defaultIcons(file, size) {
  const { type, ext } = file;

  if (type === "folder") return false;

  let icon;

  if (type && type !== "file" && whitelist[type]) {
    icon = type;
  } else if (ext) {
    icon = whitelist[ext] ? ext : "file";
  } else icon = "unknown";

  return `https://cdn.svar.dev/icons/filemanager/vivid/${size}/${icon}.svg`;
}

const Filemanager = forwardRef(function Filemanager(props, ref) {
  const {
    data = [],
    mode = "cards",
    drive = null,
    preview = false,
    panels = null,
    activePanel = 0,
    readonly = false,
    menuOptions = getMenuOptions,
    extraInfo = null,
    init = null,
    icons = defaultIcons,
    previews = null,
    ...restProps
  } = props;

  // keep latest rest props for event routing
  const restPropsRef = useRef();
  restPropsRef.current = restProps;

  // init stores
  const dataStore = useMemo(() => new DataStore(writable), []);
  const firstInRoute = useMemo(() => dataStore.in, [dataStore]);
  

  const lastInRouteRef = useRef(null);
  if (lastInRouteRef.current === null) {
    lastInRouteRef.current = new EventBusRouter((a, b) => {
      const name = 'on' + camelize(a);
      if (restPropsRef.current && restPropsRef.current[name]) {
        restPropsRef.current[name](b);
      }
    });
    firstInRoute.setNext(lastInRouteRef.current);
  }

  // public API
  const api = useMemo(
    () => ({
      getState: dataStore.getState.bind(dataStore),
      getReactiveState: dataStore.getReactive.bind(dataStore),
      getStores: () => ({ data: dataStore }),
      exec: firstInRoute.exec,
      setNext: (ev) => {
        lastInRouteRef.current = lastInRouteRef.current.setNext(ev);
        return lastInRouteRef.current;
      },
      intercept: firstInRoute.intercept.bind(firstInRoute),
      on: firstInRoute.on.bind(firstInRoute),
      detach: firstInRoute.detach.bind(firstInRoute),
      getFile: dataStore.getFile.bind(dataStore),
      serialize: dataStore.serialize.bind(dataStore),
      templates: {
        preview: previews || (() => null),
        icon: icons === "simple" ? (() => null) : icons,
      },
    }),
    [dataStore, firstInRoute],
  );
 
  const initOnceRef = useRef(0);
  useEffect(() => {
    if (!initOnceRef.current) {
      if (init) init(api);
    } else {
      const prev = dataStore.getState();
      dataStore.init({
        data, mode, drive, preview, panels: panels || prev.panels || [], activePanel
      });
    }
    initOnceRef.current++;
  }, [
    dataStore,
    data,
    mode,
    drive,
    preview,
    panels,
    activePanel,
    init,
    api,
  ]);

  if (initOnceRef.current === 0) {
    dataStore.init({
      data, mode, drive, preview, panels: panels || [], activePanel
    });
  }

  // expose API via ref
  useImperativeHandle(
    ref,
    () => ({
      ...api,
    }),
    [api],
  );

  return (
    <StoreContext.Provider value={api}>
      <Locale words={en} optional={true}>
        <Modals>
          <Layout readonly={readonly} menuOptions={menuOptions} extraInfo={extraInfo} />
        </Modals>
      </Locale>
    </StoreContext.Provider>
  );
});

export default Filemanager;