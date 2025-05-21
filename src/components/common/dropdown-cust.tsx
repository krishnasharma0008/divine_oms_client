import React from "react";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  classes?: string;
  Labelclasses?: string;
  disabled?: boolean; // ✅ Add this line
}

const DropdownCust: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  classes,
  Labelclasses,
  disabled = false, // ✅ Default to false
}) => (
  <div className={`${classes} mb-4`}>
    <label
      className={`${Labelclasses} block text-gray-700 text-sm font-medium mb-2`}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled} // ✅ Apply the disabled prop
      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-400"
          : "border-gray-300 focus:ring-blue-500"
      }`}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default DropdownCust;
