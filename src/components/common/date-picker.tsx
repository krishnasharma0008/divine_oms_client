import { useState } from "react";
import DatePickerTw from "react-datepicker";
import { SvgIconProps } from "../icons";

interface DatePickerProps {
  className?: string;
  label: string;
  value?: Date | null;
  showIcon?: boolean;
  icon: React.ComponentType<SvgIconProps & { onClick: () => void }>;
  onChange: (date: Date | null) => void; // Update to handle Date | null
  errorText?: string; // Add errorText prop
}

const DatePicker: React.FC<DatePickerProps> = ({
  showIcon,
  onChange,
  className,
  label,
  value,
  icon: Icon,
  errorText, // Destructure errorText
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleIconClick = () => {
    setIsDatePickerOpen(true);
  };

  const handleDateChange = (date: Date | null) => {
    onChange(date); // Pass the possibly null date to onChange
    setIsDatePickerOpen(false);
  };

  const id = label?.toLowerCase().replace(/\s+/g, "-") || "date-picker";

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex p-2.5 rounded justify-between items-center ${
          showIcon === true ? "border border-black" : "bg-[#eceff1]"
        }`}
      >
        <DatePickerTw
          selected={value}
          onChange={handleDateChange} // Handle Date | null change
          dateFormat="dd MMMM yyyy"
          className={`focus:outline-none focus:border-none ${
            showIcon === true ? "" : "bg-[#eceff1]"
          }`}
          readOnly={true} // Make the DatePicker read-only
          open={isDatePickerOpen} // Control visibility of the DatePicker based on state
          onClickOutside={() => setIsDatePickerOpen(false)} // Close the DatePicker when clicking outside
        />
        {showIcon && (
          <Icon className="cursor-pointer" onClick={handleIconClick} />
        )}
      </div>
      {errorText && (
        <span className="text-red-500 text-xs mt-1">{errorText}</span>
      )}{" "}
      {/* Display errorText if present */}
    </div>
  );
};

export default DatePicker;
export { type DatePickerProps };
