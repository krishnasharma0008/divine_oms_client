"use client";

import { Button } from "@/components/common";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BinIcon } from "@/components/icons";
import TextArea from "@/components/common/input-text-area";

const RegularConfirmOrderScreen = () => {
  const searchParams = useSearchParams();

  const selectedSValue = searchParams.get("selectedSValue");
  const selectedValue = searchParams.get("selectedValue");
  const selectedOrderValue = searchParams.get("selectedOrderValue");
  const selectedOrderForValue = searchParams.get("selectedOrderForValue");
  const selectedContact = searchParams.get("selectedContact");
  const selectedAdd = searchParams.get("selectedAdd");
  const selectedDate = searchParams.get("selectedDate");

  useEffect(() => {
    console.log("Received data:", {
      selectedValue,
      selectedOrderValue,
      selectedOrderForValue,
      selectedContact,
      selectedAdd,
      selectedDate,
    });
  }, [searchParams]);

  // const [selectedShape, setSelectedShape] = useState("");
  // const [selectedSize, setSelectedSize] = useState("");
  // const [selectedColorFrom, setSelectedColorFrom] = useState("");
  // const [selectedColorTo, setSelectedColorTo] = useState("");
  // const [selectedClarityFrom, setSelectedClarityFrom] = useState("");
  // const [selectedClarityTo, setSelectedClarityTo] = useState("");
  // const [selectedPremiumSize, setSelectedPremiumSize] = useState("");
  // const [selectedPcs, setSelectedPcs] = useState("");
  // const [premiumPercentage, setPremiumPercentage] = useState("");
  // const [minValue, setMinValue] = useState("");
  // const [maxValue, setMaxValue] = useState("");
  // const [remarks, setRemarks] = useState("");

  const shapeoptions = [{ label: "Round", value: "Round" }];

  // const handleShapeDropdownChange = (selectedValue: string) => {
  //   setSelectedShape(selectedValue);
  // };

  ///
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

  // Update row values on change
  const handleChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    };
    setRows(updatedRows);
  };

  const SumitOrder = () => {
    // Log or send the `rows` state which contains the data to be saved
    console.log(rows);
    // Here, you could make an API call to save the data
    // Example:
    // axios.post('/api/saveData', { rows }).then(response => console.log('Saved successfully', response));
  };

  return (
    // <div>
    //   <h1>New Page</h1>
    //   <p>Selected Store State: {selectedSValue}</p>
    //   <p>Selected Value: {selectedValue}</p>
    //   <p>Order Value: {selectedOrderValue}</p>
    //   <p>Order For: {selectedOrderForValue}</p>
    //   <p>Contact: {selectedContact}</p>
    //   <p>Address: {selectedAdd}</p>
    //   <p>Selected Date: {selectedDate}</p>
    // </div>
    <>
      <div className="font-body w-full min-h-screen flex flex-col gap-9 rounded">
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div>
              <h2 className="font-medium text-2xl pb-4">{selectedSValue}</h2>
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
                </div>
              </div>
              <div className="w-2/3 flex flex-col">
                <p className="text-[#888]">Address</p>
                <div className="py-4"></div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div className="w-full flex flex-row gap-x-4">
              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Order Type</p>
                <div className="py-2">{selectedOrderValue}</div>
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
              <div className="w-20">
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
            {/* <div className="flex flex-row  gap-x-4 ">
              <div className="w-20">
                <Dropdown
                  label=""
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label=""
                  variant="outlined"
                  options={shapeoptions} // Example: different options for size
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="w-[77px]"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label="From"
                  variant="outlined"
                  options={shapeoptions} // Example: different options for color
                  value={selectedColorFrom}
                  onChange={setSelectedColorFrom}
                  className="w-[77px]"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label="To"
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label="From"
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label="To"
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-24">
                <Dropdown
                  label=""
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-10">
                <InputText
                  type="text"
                  label=""
                  value={""}
                  disabled={false}
                  className="w-10"
                />
              </div>
              <div className="w-20">
                <Dropdown
                  label=""
                  variant="outlined"
                  options={shapeoptions}
                  value={selectedShape}
                  onChange={handleShapeDropdownChange}
                  disabled={false}
                  className="w-[77px]"
                />
              </div>
              <div className="w-10">
                <InputText
                  type="text"
                  label=""
                  value={""}
                  disabled={false}
                  className="w-10"
                />
              </div>
              <div className="w-10">
                <InputText type="text" label="" value={""} disabled={false} />
              </div>
              <div className="w-20">
                <InputText
                  type="text"
                  label=""
                  value={""}
                  disabled={false}
                  className="w-10"
                />
              </div>
            </div> */}

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
                <div className="w-20">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={shapeoptions}
                    value={row.size}
                    onChange={(value) => handleChange(index, "size", value)}
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="From"
                    variant="outlined"
                    options={shapeoptions}
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
                    options={shapeoptions}
                    value={row.colorTo}
                    onChange={(value) => handleChange(index, "colorTo", value)}
                    disabled={false}
                  />
                </div>
                <div className="w-20">
                  <Dropdown
                    label="From"
                    variant="outlined"
                    options={shapeoptions}
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
                    options={shapeoptions}
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
                    options={shapeoptions}
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
