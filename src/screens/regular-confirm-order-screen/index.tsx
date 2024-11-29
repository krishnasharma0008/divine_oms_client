"use client";

import { Button } from "@/components/common";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
//import { useSearchParams } from "next/navigation";
//import { useEffect, useState } from "react";
import { useState } from "react";
import { BinIcon } from "@/components/icons";
import TextArea from "@/components/common/input-text-area";
import { useCustomerOrderStore } from "@/store/customerorderStore";

const RegularConfirmOrderScreen = () => {
  // Access customer data from Zustand store
  const { customerOrder } = useCustomerOrderStore();
  // const searchParams = useSearchParams();

  // const selectedSValue = searchParams.get("selectedSValue");
  // const selectedValue = searchParams.get("selectedValue");
  // const selectedOrderValue = searchParams.get("selectedOrderValue");
  // const selectedOrderForValue = searchParams.get("selectedOrderForValue");
  // const selectedContact = searchParams.get("selectedContact");
  // const selectedAdd = searchParams.get("selectedAdd");
  // const selectedDate = searchParams.get("selectedDate");

  // useEffect(() => {
  //   console.log("Received data:", {
  //     selectedValue,
  //     selectedOrderValue,
  //     selectedOrderForValue,
  //     selectedContact,
  //     selectedAdd,
  //     selectedDate,
  //   });
  // }, [searchParams]);

  const shapeoptions = [
    { label: "Select", value: "" },
    { label: "Round", value: "Round" },
  ];
  const sizeoptions = [
    { label: "Select", value: "" },
    { label: "0.10 to 0.13", value: "0.10 to 0.13" },
    { label: "0.14 to 0.17", value: "0.14 to 0.17" },
    { label: "0.18 to 0.22", value: "0.18 to 0.22" },
    { label: "0.23 to 0.29", value: "0.23 to 0.29" },
    { label: "0.30 to 0.38", value: "0.30 to 0.38" },
    { label: "0.39 to 0.44", value: "0.39 to 0.44" },
    { label: "0.45 to 0.49", value: "0.45 to 0.49" },
    { label: "0.50 to 0.59", value: "0.50 to 0.59" },
    { label: "0.60 to 0.69", value: "0.60 to 0.69" },
    { label: "0.70 to 0.79", value: "0.70 to 0.79" },
    { label: "0.80 to 0.89", value: "0.80 to 0.89" },
    { label: "0.90 to 0.99", value: "0.90 to 0.99" },
    { label: "1.00 to 1.23", value: "1.00 to 1.23" },
    { label: "1.24 to 1.49", value: "1.24 to 1.49" },
    { label: "1.50 to 1.69", value: "1.50 to 1.69" },
    { label: "1.70 to 1.99", value: "1.70 to 1.99" },
    { label: "2.00 to 2.49", value: "2.00 to 2.49" },
    { label: "2.50 to 2.99", value: "2.50 to 2.99" },
  ];

  const coloroptions = [
    { label: "Select", value: "" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
    { label: "F", value: "F" },
    { label: "G", value: "G" },
    { label: "H", value: "H" },
    { label: "I", value: "I" },
    { label: "J", value: "J" },
    { label: "K", value: "K" },
  ];

  const clarityptions = [
    { label: "Select", value: "" },
    { label: "IF", value: "IF" },
    { label: "VVS1", value: "VVS1" },
    { label: "VVS2", value: "VVS2" },
    { label: "VS1", value: "VS1" },
    { label: "VS2", value: "VS2" },
    { label: "SI1", value: "SI1" },
    { label: "SI2", value: "SI2" },
  ];

  const pcsOptions = Array.from({ length: 50 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const [rows, setRows] = useState([
    {
      shape: "",
      size: "",
      colorFrom: "",
      colorTo: "",
      clarityFrom: "",
      clarityTo: "",
      premiumsize: "",
      premiumper: "",
      pcs: "",
      min: "",
      max: "",
      remarks: "",
      isDynamic: false,
    },
  ]);

  const handleAdd = () => {
    setRows([
      ...rows,
      {
        shape: "",
        size: "",
        colorFrom: "",
        colorTo: "",
        clarityFrom: "",
        clarityTo: "",
        premiumsize: "",
        premiumper: "",
        pcs: "",
        min: "",
        max: "",
        remarks: "",
        isDynamic: true,
      },
    ]);
  };

  // Remove a row by index
  const handleRemove = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    if (field === "colorFrom") {
      updatedRows[index] = {
        ...row,
        colorFrom: value,
        colorTo: row.colorTo === row.colorFrom ? value : row.colorTo,
      };

      const colorFromIndex = coloroptions.findIndex(
        (option) => option.value === value
      );
      const colorToIndex = coloroptions.findIndex(
        (option) => option.value === updatedRows[index].colorTo
      );

      if (colorToIndex > colorFromIndex) {
        alert("Color To cannot exceed Color From");
        updatedRows[index].colorTo = updatedRows[index].colorFrom; // Reset colorTo to match colorFrom
        setRows(updatedRows);
        return; // Exit early to prevent invalid update
      }
    } else if (field === "colorTo") {
      const colorFromIndex = row.colorFrom
        ? coloroptions.findIndex((option) => option.value === row.colorFrom)
        : -1;
      const colorToIndex = coloroptions.findIndex(
        (option) => option.value === value
      );

      if (colorToIndex < colorFromIndex) {
        alert("Color To cannot be less than Color From");
        updatedRows[index].colorTo = row.colorFrom; // Reset colorTo to match colorFrom
        setRows(updatedRows);
        return; // Exit early to prevent invalid update
      }

      updatedRows[index] = {
        ...row,
        colorTo: value,
      };
    } else if (field === "clarityFrom") {
      updatedRows[index] = {
        ...row,
        clarityFrom: value,
        clarityTo: row.clarityTo === row.clarityFrom ? value : row.clarityTo,
      };

      // Restrict clarityTo to not exceed clarityFrom
      const clarityFromIndex = clarityptions.findIndex(
        (option) => option.value === value
      );
      const clarityToIndex = clarityptions.findIndex(
        (option) => option.value === updatedRows[index].clarityTo
      );

      if (clarityToIndex > clarityFromIndex) {
        alert("Clarity To cannot exceed Clarity From");
        updatedRows[index].clarityTo = updatedRows[index].clarityFrom; // Reset clarityTo to match clarityFrom
        setRows(updatedRows); // Update state
        return; // Exit early
      }
    } else if (field === "clarityTo") {
      // Restrict clarityTo to not exceed clarityFrom
      const clarityFromIndex = row.clarityFrom
        ? clarityptions.findIndex((option) => option.value === row.clarityFrom)
        : -1;
      const clarityToIndex = clarityptions.findIndex(
        (option) => option.value === value
      );

      if (clarityToIndex < clarityFromIndex) {
        alert("Clarity To cannot be less than Clarity From");
        console.log("Resetting colorTo to match colorFrom:", row.clarityFrom);
        updatedRows[index].clarityTo = row.clarityFrom; // Reset to match clarityFrom
        setRows(updatedRows); // Update state
        return; // Exit early
      }

      // Only update `clarityTo` if valid
      updatedRows[index] = {
        ...row,
        clarityTo: value,
      };
    } else {
      // Update other fields normally
      updatedRows[index] = {
        ...row,
        [field]: value,
      };
    }

    setRows(updatedRows); // Ensure state is updated at the end
  };

  const SumitOrder = () => {
    // Log or send the `rows` state which contains the data to be saved
    console.log(rows);
    // Here, you could make an API call to save the data
    // Example:
    // axios.post('/api/saveData', { rows }).then(response => console.log('Saved successfully', response));
  };

  return (
    <>
      <div className="font-body w-full min-h-screen flex flex-col gap-9 rounded overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div>
              <h2 className="font-medium text-2xl pb-4">
                {customerOrder?.store}
              </h2>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/3 flex flex-col">
                <p className="text-[#888]">Contact Detail</p>
                <div className="py-4">
                  <svg
                    className="svg-inline--fa fa-phone-alt fa-w-16"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="phone-alt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="12" // Set width
                    height="12" // Set height
                    fill="rgba(0, 0, 0, 0.5)" // Change fill to inherit color from parent
                  >
                    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
                  </svg>
                  {customerOrder?.contactno}
                </div>
              </div>
              <div className="w-2/3 flex flex-col">
                <p className="text-[#888]">Address</p>
                <div className="py-4">{customerOrder?.address}</div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div className="w-full flex flex-row gap-x-4">
              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Order Type</p>
                <div className="py-2">{"selectedOrderValue"}</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Incentive/Deduction</p>
                <div className="py-2">1%</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Delivery</p>
                <div className="py-2">Within 7 working days</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Price List</p>
                <div className="py-2">
                  Price at the time of booking or delivery whichever is lower
                </div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Courier charges</p>
                <div className="py-2">Not charged</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Comments</p>
                <div className="py-2">Invoice will go with 1% credit note</div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div>
              <h2 className="font-medium text-2xl pb-4">Select your order</h2>
            </div>
            <div className="flex flex-row gap-x-4 text-center">
              <div className="w-20">
                <p className="text-[#888]">Shape</p>
              </div>
              <div className="w-[136px]">
                <p className="text-[#888]">Size</p>
              </div>
              <div className="w-44">
                <p className="text-[#888]">Color</p>
              </div>

              <div className="w-44">
                <p className="text-[#888]">Clarity</p>
              </div>

              <div className="w-24">
                <p className="text-[#888]">Premium Size</p>
              </div>
              <div className="w-10">
                <p className="text-[#888]">Premium %</p>
              </div>
              <div className="w-20">
                <p className="text-[#888]">Pcs</p>
              </div>
              <div className="w-28">
                <p className="text-[#888]">Range</p>
              </div>
              <div className="w-24">
                <p className="text-[#888]">Remarks</p>
              </div>
            </div>

            {/* Render rows dynamically */}
            {rows.map((row, index) => (
              <div className="flex flex-row gap-x-4" key={index}>
                <div className="w-20">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={shapeoptions}
                    value={row.shape}
                    onChange={(value) => handleChange(index, "shape", value)}
                    disabled={false}
                  />
                </div>
                <div className="w-[136px]">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={sizeoptions}
                    value={row.size}
                    onChange={(value) => handleChange(index, "size", value)}
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="From"
                    variant="outlined"
                    options={coloroptions}
                    value={row.colorFrom}
                    onChange={(value) =>
                      handleChange(index, "colorFrom", value)
                    }
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="To"
                    variant="outlined"
                    options={coloroptions}
                    value={row.colorTo}
                    onChange={(value) => handleChange(index, "colorTo", value)}
                    disabled={false}
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="From"
                    variant="outlined"
                    options={clarityptions}
                    value={row.clarityFrom}
                    onChange={(value) =>
                      handleChange(index, "clarityFrom", value)
                    }
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="To"
                    variant="outlined"
                    options={clarityptions}
                    value={row.clarityTo}
                    onChange={(value) =>
                      handleChange(index, "clarityTo", value)
                    }
                    disabled={false}
                  />
                </div>
                <div className="w-24">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={shapeoptions}
                    value={row.premiumsize}
                    onChange={(value) =>
                      handleChange(index, "premiumsize", value)
                    }
                    disabled={false}
                  />
                </div>
                {/* Repeat for clarity, pcs, min, max, remarks */}
                <div className="w-10">
                  <InputText
                    type="text"
                    label=""
                    value={row.premiumper}
                    onChange={(e) =>
                      handleChange(index, "premiumper", e.target.value)
                    }
                    className="w-10"
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={pcsOptions}
                    value={row.pcs}
                    onChange={(value) => handleChange(index, "pcs", value)}
                    disabled={false}
                    className="w-[77px]"
                  />
                </div>
                <div className="w-10">
                  <InputText
                    type="text"
                    //label="Min"
                    value={row.min}
                    onChange={(e) => handleChange(index, "min", e.target.value)}
                    placeholder="Min"
                    className="w-10"
                  />
                </div>
                <div className="w-10">
                  <InputText
                    type="text"
                    placeholder="Max"
                    value={row.max}
                    onChange={(e) => handleChange(index, "max", e.target.value)}
                    className="w-10"
                  />
                </div>
                <div className="w-32">
                  {/* <InputText
                    type="text"
                    label=""
                    value={row.remarks}
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                    className="w-10"
                  /> */}
                  <TextArea
                    value={row.remarks}
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                    rows={1}
                    className="w-full"
                    containerClass="w-full"
                  />
                </div>

                {row.isDynamic && (
                  <div
                    className="w-6 flex items-center justify-center"
                    onClick={() => handleRemove(index)}
                  >
                    <BinIcon className="cursor-pointer text-red-500" />
                  </div>
                )}
              </div>
            ))}
            <div className="w-full bg-slate-200 h-[0.5px]"></div>
            <div className="w-full flex justify-between">
              <Button
                themeType="dark"
                classes="w-40 h-12 text-base"
                onClick={SumitOrder}
              >
                Submit Order
              </Button>
              <Button
                themeType="dark"
                classes="w-40 h-12 text-base"
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegularConfirmOrderScreen;
