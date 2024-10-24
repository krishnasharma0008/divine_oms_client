import { Input, InputProps } from "@material-tailwind/react";
import React from "react";

export interface InputTextProps extends InputProps {
  className?: string;
  containerClass?: string;
  id?: string;
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: "file" | "number" | "date" | "text" | "password" | "email";
  value?: string;
  errorText?: string;
}

const InputText: React.FC<InputTextProps> = ({
  className,
  containerClass,
  id,
  label,
  onChange,
  type,
  value,
  disabled,
  errorText,
  placeholder,
  onBlur,
  onKeyDown,
}) => {
  return (
    <div
      className={`mb-4 [&>div>label]:peer-focus:text-black font-[Montserrat] [&>div]:min-w-0 [&>div]:h-[2.4rem] ${
        !label || "mt-7"
      }  ${containerClass}`}
    >
      <Input
        variant="static"
        className={`border rounded inset-0 ${
          !errorText ? "!border-black [&+label]:!text-black" : ""
        } [&+label]:-mt-3.5 px-2 !pt-2 [&+label]:focus:!text-black ${className}`}
        color="gray"
        label={label}
        onChange={onChange}
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        error={!!errorText}
        placeholder={placeholder}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        labelProps={{
          className: "before:content-none after:content-none",
        }}
        // labelProps={{
        //   className: "hidden",
        // }}
        // containerProps={{
        //   className: "min-w-0",
        // }}
      />
    </div>
  );
};

export default InputText;
