import React from "react";
import { Radio } from "@material-tailwind/react";
import { RadioClickIcon } from "../icons";

interface RadioButtonProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string; // Add a 'name' prop for uniqueness
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedValue,
  onChange,
  name, // Use 'name' prop to distinguish groups
}) => {
  return (
    <div className="flex space-x-6">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <Radio
            id={option.value}
            name={name} // Use 'name' prop here for each group
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            ripple={true}
            icon={<RadioClickIcon />}
            color="gray" // You can change the color to suit your design
          />
          <span className="text-black">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
