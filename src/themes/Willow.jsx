import { Willow as WillowCore } from "@svar-ui/react-core";
import "./Willow.css";

function Willow({ fonts = true, children }) {
  return children ? (
    <WillowCore fonts={fonts}>{children}</WillowCore>
  ) : (
    <WillowCore fonts={fonts} />
  );
}

export default Willow;