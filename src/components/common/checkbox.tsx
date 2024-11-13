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
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  title,
  options,
  selectedValues,
  onChange,
}) => {
  const handleCheckboxChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newSelectedValues);
  };

  return (
    <Card className="w-auto p-4">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="flex flex-col ">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              //color="black" // Change the color to suit your design
            />
            <span className="text-black">{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};

export default CheckboxGroup;
