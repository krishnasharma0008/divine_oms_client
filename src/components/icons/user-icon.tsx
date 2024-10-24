import { SvgIconProps } from "./icon-props";

const UserIcon: React.FC<SvgIconProps> = (props) => (
  //   <svg width="24" height="24" fill="none" stroke="#fff" {...props}>
  //     <path d="M12 15a6 6 0 1 0 0-12 6 6 0 1 0 0 12z" strokeMiterlimit="10" />
  //     <path
  //       d="M2.906 20.25A10.5 10.5 0 0 1 12 14.999a10.5 10.5 0 0 1 9.094 5.251"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //   </svg>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    {...props}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default UserIcon;
