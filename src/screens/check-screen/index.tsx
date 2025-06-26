"use client";

import React from "react";
import Select from "react-select";

const CheckScreen: React.FC = () => {
  return (
    <div className="App">
      <h1>Select Gender</h1>
      <Select
        //isMulti
        isClearable
        isSearchable
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
        onChange={(val) => {
          console.log("Selected value:", val);
        }}
      />
    </div>
  );
};
export default CheckScreen;
