"use client";
import React from "react";
import Select from "react-select";

type OptionType = {
  label: string;
  value: string;
};

interface SearchableSelectProps {
  options: OptionType[];
  //value?: OptionType | null;
  onChange: (selected: OptionType) => void;
  placeholder?: string;
  //isClearable?: boolean;
  //label?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  //value,
  onChange,
  placeholder = "Select...",
  //isClearable = true,
  //label,
}) => {
  //const [isFocused, setIsFocused] = useState(false);

  return (
    // <div className="relative w-full">
    //   <label
    //     className={`absolute left-3 top-2 text-sm text-gray-500 transition-all duration-200 z-10
    //       ${
    //         isFocused || value
    //           ? "text-sm -top-3.5 text-blue-600 bg-white px-1"
    //           : "top-2.5 text-base text-gray-400"
    //       }
    //       pointer-events-none
    //     `}
    //   >
    //     {label}
    //   </label>
    <Select
      options={options}
      //value={value}
      //onMenuOpen={() => setIsFocused(true)}
      //onMenuClose={() => setIsFocused(false)}
      onChange={(selected) => {
        if (selected) onChange(selected);
      }}
      isClearable
      placeholder={placeholder}
      styles={{
        indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
      }}
    />
    // </div>
  );
};

export default SearchableSelect;
