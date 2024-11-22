//import { useState } from "react";
import { Checkbox, Card } from "@material-tailwind/react";

interface SingleSelectCheckboxProps {
  title?: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  //onChange: (value: string | null) => void;
  onChange: (value: string) => void;
  classes?: string;
}

const SingleSelectCheckbox: React.FC<SingleSelectCheckboxProps> = ({
  title,
  options,
  selectedValue,
  onChange,
  classes,
}) => {
  //const [selected, setSelected] = useState<string | null>(selectedValue);

  //   const handleCheckboxChange = (value: string) => {
  //     const newValue = selected === value ? null : value; // Deselect if already selected
  //     setSelected(newValue);
  //     onChange(newValue);
  //   };

  return (
    <Card
      className="w-auto p-4"
      style={{ borderTop: "1px solid rgb(0 0 0 / 0.1)" }}
    >
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="flex flex-col space-y-2">
        {options.map((option) => (
          //   <label key={option.value} className="flex items-center space-x-2">
          //     <input
          //       type="checkbox"
          //       id={option.value}
          //       //checked={selected === option.value}
          //       //onChange={() => handleCheckboxChange(option.value)}
          //       checked={selectedValue === option.value}
          //       onChange={() => onChange(option.value)}
          //       className="form-checkbox text-gray-600" // Tailwind styling example
          //     />
          //     <span className="text-black">{option.label}</span>
          //   </label>
          <label key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              //color="black" // Change the color to suit your design
            />
            <span className={`${classes} text-black`}>{option.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
};

export default SingleSelectCheckbox;
