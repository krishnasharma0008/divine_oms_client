import { SvgIconProps } from "./icon-props";

const BinIcon: React.FC<SvgIconProps> = (props) => (
  <svg
    className={`svg-inline--fa fa-trash-alt fa-w-14`}
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="trash-alt"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    style={{ width: 12, height: 12 }} // Apply width and height via style
    fill="rgba(0, 0, 0, 0.5)" // Use fill to define color
    data-fa-i2svg=""
    {...props}
  >
    <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
  </svg>
);

export default BinIcon;
