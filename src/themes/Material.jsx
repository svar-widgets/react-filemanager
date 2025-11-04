import { Material as WxMaterial } from "@svar-ui/react-core";
import "./Material.css";

function Material({ fonts = true, children }) {
  if (children) {
    return <WxMaterial fonts={fonts}>{children}</WxMaterial>;
  } else {
    return <WxMaterial fonts={fonts} />;
  }
}

export default Material;