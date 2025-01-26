import { SvgIconProps } from "./icon-props";

const ChevronRightIcon: React.FC<SvgIconProps> = (props) => (
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width="16"
  //   height="16"
  //   fill="currentColor"
  //   className="h-4 w-4 bi bi-chevron-right"
  //   viewBox="0 0 16 16"
  //   {...props}
  // >
  //   <path d="M4.146 1.146a.5.5 0 0 0 0 .708L9.293 7.5H1a.5.5 0 0 0 0 1h8.293L4.146 14.354a.5.5 0 1 0 .708.708l6-6a.5.5 0 0 0 0-.708l-6-6a.5.5 0 0 0-.708 0z" />
  // </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="h-6 w-6 bi bi-chevron-left"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="M10 7L15 12L10 17"
      stroke="#000000"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export default ChevronRightIcon;
