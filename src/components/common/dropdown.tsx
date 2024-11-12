import { Select, Option, SelectProps } from "@material-tailwind/react";
import React from "react";

type OptionType = { label: string; value: string };

export interface DropdownProps
  extends Omit<SelectProps, "children" | "onChange"> {
  //options: Array<string>;
  classes?: string;
  label: string;
  options: Array<OptionType>;
  value?: string;
  variant?: SelectProps["variant"];
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  classes = "",
  label,
  disabled,
  value,
  variant,
  onChange,
}) => {
  // Render the dropdown component
  return (
    <div className="mb-4 [&>div>ul]:my-0 [&>div>ul>li]:!text-black [&>div]:min-w-0">
      <Select
        label={label}
        className={`rounded bg-white  [&>span]:px-2 [&>span]:!pt-0  [&+label]:!text-black ${classes}`}
        style={{ minWidth: 0 }}
        color="gray"
        disabled={disabled}
        variant={variant}
        value={value}
        onChange={(e) => {
          if (typeof e === "string") {
            onChange(e); // Invoke the onChange prop with the selected value
          }
        }}
      >
        {options.map((item) => (
          <Option
            key={item.value}
            value={item.value}
            style={{ listStyleType: "none" }}
          >
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Dropdown;
