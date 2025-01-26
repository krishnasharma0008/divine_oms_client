import { SvgIconProps } from "./icon-props";

const ChevronLeftIcon: React.FC<SvgIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="h-4 w-4 bi bi-chevron-left"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M11.854 1.146a.5.5 0 0 0 0 .708L6.707 7.5H15a.5.5 0 0 0 0 1H6.707l5.147 5.146a.5.5 0 1 0-.708.708l-6-6a.5.5 0 0 0 0-.708l6-6a.5.5 0 0 0-.708 0z" />
  </svg>
);
export default ChevronLeftIcon;
