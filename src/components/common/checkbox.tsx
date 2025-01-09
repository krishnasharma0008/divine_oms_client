import React from "react";
import { Checkbox, Card } from "@material-tailwind/react";

interface CheckboxOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  title?: string;
  options: CheckboxOption[];
  selectedValues: string[]; // Array of selected values for multiple checkboxes
  onChange: (value: string[]) => void; // Handler to manage checkbox changes
  classes?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  options,
  selectedValues,
  onChange,
  classes,
}) => {
  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  return (
    <Card
      className="w-full p-2"
      style={{ borderTop: "1px solid rgb(0 0 0 / 0.1)" }}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div
        className="flex flex-col space-y-2 "
        // style={{
        //   maxHeight: "160px", // Approximately 4 items tall (adjust as needed)
        // }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-1" // Reduced padding between options
          >
            <Checkbox
              id={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
            />
            <span className={`${classes} text-black`}>{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};

export default CheckboxGroup;
