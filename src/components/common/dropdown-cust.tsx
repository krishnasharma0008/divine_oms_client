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
  <div className={`${classes} `}>
    {label && (
      <label
        className={`${Labelclasses} block text-gray-700 text-sm font-medium mb-2`}
      >
        {label}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 ${
        error
          ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
          : "border-gray-300 focus:border-gray-900 focus:ring-gray-900/10"
      } disabled:bg-gray-100 disabled:text-gray-500`}
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
