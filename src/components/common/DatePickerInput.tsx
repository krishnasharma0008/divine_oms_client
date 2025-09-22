"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//import dayjs from "dayjs";

export interface DatePickerInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  placeholder = "Select date",
}) => {
  
  return (
    <DatePicker
      selected={value}
      onChange={(date) => onChange(date)}
      dateFormat="dd MMM, yyyy" // 👈 format shown to user
      placeholderText={placeholder}
      className="w-full p-1 text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
      isClearable
      showIcon
    />
  );
};

export default DatePickerInput;
