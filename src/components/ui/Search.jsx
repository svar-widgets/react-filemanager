import { useMemo, useRef, useContext } from "react";
import { useWritableProp } from "@svar-ui/lib-react";
import { context } from "@svar-ui/react-core";
import "./Search.css";

function Search({ value: propValue = "", onSearch }) {
  const [value, setValue] = useWritableProp(propValue);

  const i18n = useContext(context.i18n);
  const _ = i18n.getGroup("filemanager");

  const node = useRef(null);
  const icon = useMemo(() => (value !== "" ? "wxi-close" : "wxi-search"), [value]);

  function oninput(e) {
    const next = e.target.value;
    setValue(next);
    if (onSearch) onSearch({ value: next });
  }

  function clear() {
    setValue("");
    if (node.current) node.current.focus();
    if (onSearch) onSearch({ value: "" });
  }

  return (
    <div className="wx-lUZMtgT1 wx-search-input">
      <i className={`wx-lUZMtgT1 wx-icon ${icon}`} onClick={clear}></i>
      <input
        type="text"
        className="wx-lUZMtgT1 wx-text"
        ref={node}
        value={value}
        onInput={oninput}
        placeholder={_("Search")}
      />
    </div>
  );
}

export default Search;