import { useState } from "react";
import { Locale, Segmented } from "@svar-ui/react-core";
import { cn } from "@svar-ui/filemanager-locales";
import { cn as cnCore } from "@svar-ui/core-locales";

import { getData, getDrive } from "../data";
import { Filemanager } from "../../src/";

import "./Locales.css";

export default function Locales() {
  const [lang, setLang] = useState("en");
  const options = [
    { id: "en", label: "EN" },
    { id: "cn", label: "CN" },
  ];

  return (
    <div className="wx-2AsPDt7h demo">
      <div className="wx-2AsPDt7h bar">
        <Segmented options={options} value={lang} onChange={({ value }) => setLang(value)} />
      </div>
      {lang === "en" && <Filemanager data={getData()} drive={getDrive()} />}
      {lang === "cn" && (
        <Locale words={{ ...cn, ...cnCore }}>
          <Filemanager data={getData()} drive={getDrive()} />
        </Locale>
      )}
    </div>
  );
}