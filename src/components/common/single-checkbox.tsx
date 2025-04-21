//import { useState } from "react";
import { Checkbox } from "@material-tailwind/react";

interface SingleSelectCheckboxProps {
  title?: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  //onChange: (value: string | null) => void;
  onChange: (value: string) => void;
  classes?: string;
  disabled?: boolean;
}

const SingleSelectCheckbox: React.FC<SingleSelectCheckboxProps> = ({
  title,
  options,
  selectedValue,
  onChange,
  classes,
  disabled = false, // Default to false if not provided
}) => {
  //const [selected, setSelected] = useState<string | null>(selectedValue);

  //   const handleCheckboxChange = (value: string) => {
  //     const newValue = selected === value ? null : value; // Deselect if already selected
  //     setSelected(newValue);
  //     onChange(newValue);
  //   };

  return (
    <fieldset className="w-auto bg-white p-2 border border-black/10 rounded-md shadow-md">
      {title && <legend className="text-base font-semibold">{title}</legend>}
      <div className="flex flex-col gap-2 bg-white">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled} // Pass disabled prop to Checkbox
            />
            <span className={`${classes} text-black`}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

export default SingleSelectCheckbox;
