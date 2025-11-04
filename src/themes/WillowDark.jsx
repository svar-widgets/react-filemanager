import { WillowDark as WxWillowDark } from "@svar-ui/react-core";
import "./WillowDark.css";

export default function WillowDark({ fonts = true, children }) {
  if (children) {
    return <WxWillowDark fonts={fonts}>{children}</WxWillowDark>;
  } else {
    return <WxWillowDark fonts={fonts} />;
  }
}