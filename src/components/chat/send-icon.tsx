interface SendIconProps {
  disabled?: boolean;
  chatWindow?: boolean;
  styles?: {
    width?: string | number;
    height?: string | number;
    enabledFill?: string;
    disabledFill?: string;
    arrowEnabledColor?: string;
    arrowDisabledColor?: string;
    cursorEnabled?: string;
    cursorDisabled?: string;
  };
}

const SendIcon = ({
  disabled,
  chatWindow,
  styles,
}: SendIconProps) => {
  const width = styles?.width ?? (chatWindow ? "40" : "47");
  const height = styles?.height ?? (chatWindow ? "40" : "47");
  const circleFill = disabled
    ? styles?.disabledFill ?? "#d4d4d4"
    : styles?.enabledFill ?? "#F8E300";
  const arrowColor = disabled
    ? styles?.arrowDisabledColor ?? "#a3a3a3"
    : styles?.arrowEnabledColor ?? "#000000";
  const cursorClass = disabled
    ? styles?.cursorDisabled ?? "cursor-not-allowed"
    : styles?.cursorEnabled ?? "";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 47 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cursorClass}
    >
      <circle
        cx="23.473"
        cy="23.8139"
        r="23.1222"
        fill={circleFill}
      />
      <path
        d="M22.6818 36.3083V17.3794L14.5694 25.4918L13.4105 24.4719L23.4544 14.428L33.4983 24.4719L32.3394 25.4918L24.227 17.3794V36.3083H22.6818Z"
        fill={arrowColor}
      />
    </svg>
  );
};

export default SendIcon;
