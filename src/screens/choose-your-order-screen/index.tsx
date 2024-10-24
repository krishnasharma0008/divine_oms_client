"use client";

import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import RadioButton from "@/components/common/input-radio";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
import { Button } from "@/components/common";
import DatePicker from "@/components/common/date-picker";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "@/components";
//import { CalendarIcon } from "@/components/icons";
import { useCustomerStore } from "@/store/customerStore";

dayjs.extend(utcPlugin);

const ChooseYourOrderScreen = () => {
  const [selectedValue, setSelectedValue] = useState(""); // Item type radio button
  const [selectedOrderValue, setSelectedOrderValue] = useState(""); // Order type radio button
  const [selectedOrderForValue, setSelectedOrderForValue] = useState(""); // Order for radio button

  const [selectedJValue, setSelectedJValue] = useState("");
  const [selectedSValue, setSelectedSValue] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedAdd, setSelectedAdd] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();

  // Access customer data from Zustand store
  const { customer } = useCustomerStore();

  useEffect(() => {
    if (customer) {
      console.log(" contact from customer data : ", customer.contactno); // Set contact from customer data
      console.log("address from customer data : ", customer.address); // Set address from customer data
    }
  }, [customer]);

  const handleSDropdownChange = (selectedValue: string) => {
    setSelectedContact("Contact Number " + selectedValue);
    setSelectedAdd("Selected Address " + selectedValue);
    setSelectedSValue(selectedValue);
  };

  const handleJDropdownChange = (selectedValue: string) => {
    setSelectedJValue(selectedValue);
  };

  const handleItemTypeChange = (value: string) => {
    console.log("selected Item Type", value);
    setSelectedValue(value);
  };

  const handleOrderTypeChange = (value: string) => {
    console.log("selected Order Type", value);
    setSelectedOrderValue(value);
  };

  const handleOrderForChange = (value: string) => {
    console.log("selected Order For", value);
    setSelectedOrderForValue(value);
  };

  const Joptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  const options = [
    { label: "Solitaires", value: "Solitaires" },
    { label: "Jewellery", value: "Jewellery" },
    { label: "Pyds", value: "Pyds" },
  ];

  const Orderoptions = [
    { label: "Regular Confirm Order", value: "Regular Confirm Order" },
    { label: "Consigned Stock Approved", value: "Consigned Stock Approved" },
    { label: "Regular Request Order", value: "Regular Request Order" },
    { label: "Specific Confirm Order", value: "Specific Confirm Order" },
  ];

  const OrderForoptions = [
    { label: "Stock", value: "Stock" },
    { label: "Customer", value: "Customer" },
  ];

  const isPydsSelected = selectedValue === "Pyds";

  const filteredOrderOptions =
    selectedValue === "Jewellery"
      ? Orderoptions.filter(
          (option) =>
            option.value !== "Regular Request Order" &&
            option.value !== "Specific Confirm Order"
        )
      : Orderoptions;

  const DateFormat = "YYYY-MM-DD HH:mm:ss";

  const onDateChangeHandler = (date: Date | null) => {
    if (date) {
      console.log("Selected Date:", date.toISOString());
      setSelectedDate(date);
    }
  };

  const handleProceed = () => {
    const queryParams = new URLSearchParams({
      selectedSValue,
      selectedValue,
      selectedOrderValue,
      selectedOrderForValue,
      selectedContact,
      selectedAdd,
      selectedDate: selectedDate ? selectedDate.toISOString() : "",
    }).toString();

    router.push(`/regular-confirm-order?${queryParams}`);
  };

  return (
    <div className="bg-white rounded p-4 shadow-md space-y-4">
      <div>
        <div>
          <h2 className="font-medium text-2xl mb-4">Choose Your Order Type</h2>
        </div>
        <div className="flex w-full justify-between">
          <div className="w-full px-4">
            <Dropdown
              label="Select Partner Jeweller"
              variant="outlined"
              options={Joptions}
              value={selectedJValue}
              onChange={handleJDropdownChange}
              disabled={false}
            />
          </div>
          <div className="w-full px-4">
            <Dropdown
              label="Select Store"
              variant="outlined"
              options={options}
              value={selectedSValue}
              onChange={handleSDropdownChange}
              disabled={false}
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="w-full px-4">
            <InputText
              type="text"
              label="Contact Detail"
              value={selectedContact}
              disabled={true}
            />
          </div>
          <div className="w-full px-4">
            <InputText
              type="text"
              label="Address"
              value={selectedAdd}
              disabled={true}
            />
          </div>
        </div>
      </div>

      {/* Item Type Radio Buttons */}
      <div className="w-full flex flex-col px-4">
        <div>
          <p className="text-[#888]">Select Item Type</p>
        </div>
        <div>
          <RadioButton
            name="Select Item Type"
            options={options}
            selectedValue={selectedValue}
            onChange={handleItemTypeChange}
          />
        </div>
      </div>
      {!isPydsSelected && (
        <>
          {/* Order Type Radio Buttons */}
          <div className="w-full flex flex-col px-4">
            <div>
              <p className="text-[#888]">Select Order Type</p>
            </div>
            <div>
              <RadioButton
                name="Select Order Type"
                options={filteredOrderOptions}
                selectedValue={selectedOrderValue}
                onChange={handleOrderTypeChange}
              />
            </div>
          </div>

          {/* Order For Radio Buttons */}
          <div className="flex flex-row items-start">
            <div className="flex flex-col px-4">
              <div>
                <p className="text-[#888]">Order For</p>
              </div>
              <div className="flex flex-row">
                <div>
                  <RadioButton
                    name="Order For"
                    options={OrderForoptions}
                    selectedValue={selectedOrderForValue}
                    onChange={handleOrderForChange}
                  />
                </div>
              </div>
            </div>
            <div className="flex px-4">
              <DatePicker
                onChange={onDateChangeHandler} // Pass the handler without invoking it
                label="Requested Delivery Date"
                value={
                  selectedDate
                    ? new Date(dayjs.utc(selectedDate).format(DateFormat))
                    : null
                }
                className=""
                showIcon={true}
                icon={CalendarIcon}
              />
            </div>
            <div className=" flex px-4">
              <DatePicker
                onChange={onDateChangeHandler}
                label="Delivery Date"
                value={
                  selectedDate
                    ? new Date(dayjs.utc(selectedDate).format(DateFormat))
                    : null
                }
                showIcon={true}
                icon={CalendarIcon}
              />
            </div>
          </div>
        </>
      )}
      <div className="w-full text-[#888] px-4">
        Disclaimer: We are not committing to delivering the order on the
        required delivery date. We will try our best to deliver within time.
      </div>
      <div className="w-full bg-slate-200 h-[0.5px]"></div>
      <div className="w-full flex justify-end">
        <Button
          themeType="dark"
          classes="w-40 h-12 text-base"
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ChooseYourOrderScreen;
