import { SvgIconProps } from "./icon-props";

const MessageCloseIcon: React.FC<SvgIconProps> = (props) => (

<svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
<circle cx="19.5" cy="19.5" r="19.5" fill="#FFF0CD" fill-opacity="0.9"/>
<circle cx="19.5" cy="19.5" r="19" stroke="#FFD674" stroke-opacity="0.99"/>
<path d="M14.3218 26.4233L20.3723 20.3728M20.3723 20.3728L26.4228 14.3223M20.3723 20.3728L14.3218 14.3223M20.3723 20.3728L26.4228 26.4233" stroke="#2B2B2B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
);

export default MessageCloseIcon;