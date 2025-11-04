import "./Icon.css";

function Icon({ name = "", spin = false, onClick }) {
  return (
    <i
      data-menu-ignore="true"
      className={`wx-uwcvNSAG wx-icon wxi-${name} ${spin ? 'wx-spin' : ''} ${onClick ? 'wx-clickable' : ''}`}
      onClick={() => {
        onClick && onClick();
      }}
    ></i>
  );
}

export default Icon;