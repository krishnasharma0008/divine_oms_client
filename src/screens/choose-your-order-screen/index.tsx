"use client";

import React, { useContext, useEffect, useState } from "react";
import RadioButton from "@/components/common/input-radio";
//import CheckboxGroup from "@/components/common/checkbox";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
//import { Button, SingleSelectCheckbox } from "@/components/common";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/store/customerStore";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import { getCustType } from "@/local-storage";
import { PJCustomerStoreDetail } from "@/interface/pj-custome-store";
import NotificationContext from "@/context/notification-context";
import TextArea from "@/components/common/input-text-area";
import { getpjCustomer, getpjStore } from "@/api/pjcustomer-store-detail";
import { CustomerOrderDetail } from "@/interface";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import SearchableSelect from "@/components/common/searchDropdown";

dayjs.extend(utcPlugin);

interface OptionType {
  // value: string;
  // label: string;
  code: string;
  name: string;
}

const ChooseYourOrderScreen = () => {
  const { setCustomerOrder, resetCustomerOrder } = useCustomerOrderStore(); // Use the customer store
  //const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCustomerName, setIsCustomerName] = useState<string | null>(null);
  // const [isSelectedCustomer, setIsSelectedCustomer] = useState<string | null>(
  //   null
  // );

  const { notifyErr } = useContext(NotificationContext);
  //const { showLoader, hideLoader } = useContext(LoaderContext);
  const [customerData, setCustomerDetail] = useState<OptionType[]>([]);
  //const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  //const [loading, setLoading] = useState<boolean>(false); // Control spinner visibility

  const [stores, setStores] = useState<PJCustomerStoreDetail[]>([]); // Store details
  const [selectedSValue, setSelectedSValue] = useState<string>(""); // Selected store state
  const [selectedValue, setSelectedValue] = useState("jewellery"); // Item type radio button
  const [selectedCustCode, setSelectedCustCode] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedAdd, setSelectedAdd] = useState("");
  // const [selectedconsignmen, setSelectedConsignment] = useState(""); // Single checkbox
  // const [selectedsor, setSelectedSOR] = useState(""); // Single checkbox
  // const [selectedoutrightpur, setSelectedOutrightPur] = useState(""); // Single checkbox
  // const [selectedCustOrder, setSelectedCustOrder] = useState(""); // Single checkbox
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(""); // Delivery Date
  const [selectedOrderFor, setSelectedOrderFor] = useState(
    getCustType() === "Retail Customer" ? "Retail Customer" : "Stock"
  );

  const [orderType, setOrderType] = useState("");

  const router = useRouter();

  // Access customer data from Zustand store
  const { customer } = useCustomerStore();

  useEffect(() => {
    const today = new Date();
    const expDeliveryDate = new Date(today);

    if (selectedValue === "solitaire") {
      expDeliveryDate.setDate(today.getDate() + 7); // Add 14 days for solitaire changed to 25 days
    } else {
      expDeliveryDate.setDate(today.getDate() + 15); // Add 21 days for jewellery changed to 25 days
    }

    const formattedExpDeliveryDate =
      dayjs(expDeliveryDate).format("DD-MM-YYYY");

    setExpectedDeliveryDate(formattedExpDeliveryDate);

    getpjCustomerdata();
  }, [selectedValue]);

  // const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setSearchQuery(value);
  //   setLoading(true);
  //   if (value.trim() === "") {
  //     // Clear suggestions when input is empty
  //     setShowSuggestions(false);
  //     setLoading(false);
  //     setCustomerDetail([]);
  //     setStores([]);
  //     setSelectedAdd("");
  //     setSelectedContact("");
  //     return;
  //   }

  //   try {
  //     //showLoader();
  //     const result = await getpjCustomer(value);
  //     const pjCustOptions = result.data.data.map((item: OptionType) => ({
  //       code: item.code,
  //       name: item.name,
  //     }));
  //     setCustomerDetail(pjCustOptions);
  //     setShowSuggestions(true);
  //   } catch (error) {
  //     notifyErr("An error occurred while fetching customer details.");
  //     console.error(error);
  //   } finally {
  //     //hideLoader();
  //     setLoading(false);
  //   }
  // };

  const handleSuggestionClick = (id: string, name: string) => {
    console.log("Selected customer Code ", id);
    console.log("Selected customer Name ", name);
    // setIsCustomerName(id); old
    //setIsSelectedCustomer(id); // Store the selected customer name
    setIsCustomerName(name);
    getpjstoredata(id); //fetch store data
    //setShowSuggestions(false);
    //setSearchQuery(name); // Optionally clear the search query
    setStores([]);
    setSelectedAdd("");
    setSelectedContact("");
  };

  const getpjCustomerdata = async () => {
    //showLoader();
    try {
      //showLoader();
      const result = await getpjCustomer();
      const pjCustOptions = result.data.data.map((item: OptionType) => ({
        code: item.code,
        name: item.name,
      }));
      setCustomerDetail(pjCustOptions);
      //setShowSuggestions(true);
    } catch (error) {
      notifyErr("An error occurred while fetching customer details.");
      console.error(error);
    } finally {
      //hideLoader();
      //setLoading(false);
    }
  };

  const getpjstoredata = async (code?: string) => {
    try {
      //console.log("Jeweller Name :", custName);
      const response = await getpjStore(code);
      //console.log(response.data.data ?? []);
      setStores(response.data.data ?? []);
      //setSelectedSValue(stores[0].CustomerID.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const handleSDropdownChange = (selectedStoreValue: string) => {
    //console.log("Store Selected:", selectedStoreValue);
    const selectedStore = stores.find(
      (store) => store.CustomerID.toString() === selectedStoreValue
    );

    if (selectedStore) {
      setSelectedCustCode(
        selectedStore.Code === null ? "" : selectedStore.Code
      );
      // Set the contact and address based on the selected store
      setSelectedContact(
        selectedStore.ContactNo === null ? "" : selectedStore.ContactNo
      );
      setSelectedAdd(
        selectedStore.Address === null ? "" : selectedStore.Address
      );
      setSelectedSValue(selectedStoreValue); // <-- Update selected value
    }
  };

  const handleItemTypeChange = (value: string) => {
    console.log("selected Item Type", value);
    setSelectedValue(value);

    // Calculate current date + 14 days or 21 days based on the value
    const today = new Date();
    const expDeliveryDate = new Date(today);

    // Fixing the condition to add either 14 or 21 days based on the value
    if (value === "solitaire") {
      expDeliveryDate.setDate(today.getDate() + 7); // Add 14 days changed back to 25 days
    } else {
      expDeliveryDate.setDate(today.getDate() + 15); // Add 21 days changed back to 25 days
    }

    // Format the date using dayjs
    const formattedExpDeliveryDate =
      dayjs(expDeliveryDate).format("DD-MM-YYYY");
    console.log(formattedExpDeliveryDate);

    // Update the state to show the calculated date
    setExpectedDeliveryDate(formattedExpDeliveryDate);
  };

  const handleOrderForChange = (value: string) => {
    console.log("selected Order For", value);
    setSelectedOrderFor(value);
    if (value === "Customer") {
      console.log("Setting Order Type to RCO for Customer");
      setOrderType("RCO");
      // setSelectedCustOrder("RCO"); // Ensure Customer Order is also set
      // setSelectedConsignment("");
      // setSelectedSOR("");
      // setSelectedOutrightPur("");
    } else {
      setOrderType(""); // Reset Order Type if not Customer
      // setSelectedCustOrder("");
      // setSelectedConsignment("");
      // setSelectedSOR("");
      // setSelectedOutrightPur("");
    }
  };

  // useEffect(() => {
  //   if (selectedOrderFor === "Customer") {
  //     setSelectedConsignment("");
  //     setSelectedSOR("");
  //     setSelectedOutrightPur("");
  //   }
  // }, [selectedOrderFor]);

  const handleOrderTypeChange = (value: string) => {
    console.log("selected Order Type", value);
    // if (value === "TCS" || value === "RRO / Exhibition") {
    //   console.log("selected Consignment", value);
    //   setSelectedConsignment(value);
    //   setSelectedSOR("");
    //   setSelectedOutrightPur("");
    //   setSelectedCustOrder("");
    // } else if (value === "SOR") {
    //   console.log("selected Sale Of Order", value);
    //   setSelectedConsignment("");
    //   setSelectedSOR(value);
    //   setSelectedOutrightPur("");
    //   setSelectedCustOrder("");
    // } else if (value === "OP") {
    //   console.log("selected Out Purchase", value);
    //   setSelectedConsignment("");
    //   setSelectedSOR("");
    //   setSelectedOutrightPur(value);
    //   setSelectedCustOrder("");
    // } else if (value === "RCO" || value === "SCO") {
    //   console.log("selected Customer Order", value);
    //   setSelectedConsignment("");
    //   setSelectedSOR("");
    //   setSelectedOutrightPur("");
    //   setSelectedCustOrder(value);
    // }
    setOrderType(value);
  };

  const Ioptions = [
    { label: "Solitaire", value: "solitaire" },
    { label: "Jewellery", value: "jewellery" },
  ];

  const OrderForoptions = [];

  if (getCustType() === "Retail Customer") {
    OrderForoptions.push({
      label: "Retail Customer",
      value: "Retail Customer",
    });
  } else {
    OrderForoptions.push(
      { label: "Stock", value: "Stock" },
      { label: "Customer", value: "Customer" }
    );
  }

  // const Consignmentoptions = [
  //   { label: "TCS", value: "TCS" },
  //   { label: "RRO / Exhibition", value: "RRO / Exhibition" },
  // ];
  // const SORoptions = [{ label: "SOR", value: "SOR" }];
  // const Outpurchaseoptions = [{ label: "OP", value: "OP" }];
  const CVoptions = [];
  if (selectedOrderFor === "Customer") {
    CVoptions.push({ label: "RCO", value: "RCO" });
  } else {
    CVoptions.push(
      { label: "Outright", value: "Outright" },
      { label: "SOR", value: "SOR" },
      { label: "DPSC", value: "DPSC" },
      { label: "ZBH", value: "ZBH" },
      { label: "Exhibition", value: "Exhibition" },
      { label: "SD Replenishment", value: "SD Replenishment" }
    );
  }

  const handleProceed = () => {
    // Reset customer order before proceeding
    resetCustomerOrder();
    //console.log("Store : ", selectedSValue);
    // Find the selected store
    const selectedStore = stores.find(
      (store) => store.CustomerID.toString() === selectedSValue
    );

    // Validation checks for required fields
    if (getCustType() === "Jeweller" && !isCustomerName) {
      notifyErr("Customer name is required. Please select a customer.");
      return;
    } else if (getCustType() === "Retail Customer" && !customer?.name) {
      notifyErr("Customer name is required. Please select a customer.");
      return;
    }
    if (getCustType() === "Jeweller") {
      if (!selectedStore || !selectedStore.NickName) {
        notifyErr("Store selection is required. Please select a valid store.");
        return;
      }
    }

    if (!orderType) {
      notifyErr("Order Type is required. Please select a valid Order.");
      return;
    }
    //   selectedOrderFor === "Customer" &&
    //   selectedCustOrder !== "RCO"
    // Prepare payload based on the customer type
    console.log("isCustomerName :", isCustomerName);
    const payload: CustomerOrderDetail = {
      order_for: selectedOrderFor, // getCustType() ?? "",
      customer_id:
        getCustType() === "Jeweller"
          ? Number(selectedStore?.CustomerID)
          : customer?.id ?? 0,
      product_type: selectedValue, //itemtype
      order_type: orderType, //ordertype
      cust_code: getCustType() === "Jeweller" ? selectedCustCode : "", //customer code
      cust_name:
        getCustType() === "Jeweller"
          ? isCustomerName ?? ""
          : customer?.name ?? "",

      store:
        getCustType() === "Jeweller"
          ? selectedStore?.NickName ?? ""
          : "Mumbai HO",
      contactno:
        getCustType() === "Jeweller"
          ? selectedContact
          : customer?.contactno ?? "",
      address:
        getCustType() === "Jeweller" ? selectedAdd : customer?.address ?? "",
      exp_dlv_date: expectedDeliveryDate, //new Date(expectedDeliveryDate || Date.now()).toISOString(),
      old_varient: "",
    };

    //console.log("Payload", payload);
    setCustomerOrder(payload);
    console.log("Item Type : ", selectedValue);

    // Navigate based on the selected item type
    if (selectedValue === "solitaire") {
      console.log("Navigating to /regular-confirm-order");
      router.push(`/regular-confirm-order`);
    } else if (selectedValue === "jewellery") {
      console.log("Navigating to /jewellery");
      router.push(`/jewellery`);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen md:min-h-[calc(100vh_-_85px)] rounded p-2 m-2 shadow-md space-y-2">
      {/* Header */}
      {/* <header className="bg-blue-500 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-semibold">Choose Your Order</h1>
      </header> */}

      {/* Scrollable content */}
      {/* <div className="overflow-y-auto max-h-[50vh] space-y-4 px-4"> */}
      {/* overflow-y-auto max-h-[48vh] */}
      <main className="flex-1 p-2 space-y-2 bg-white">
        <div>
          <div className="flex md:flex-row flex-col w-full justify-between mt-2">
            <div className="w-full px-4">
              {getCustType() === "Jeweller" ? (
                <div className="relative">
                  {/* <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <rect
                        x="0.90918"
                        y="7.51172"
                        width="27.0468"
                        height="27.0468"
                        transform="rotate(-15 0.90918 7.51172)"
                        fill="url(#pattern0_166_1548)"
                      />
                      <defs>
                        <pattern
                          id="pattern0_166_1548"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_166_1548"
                            transform="scale(0.02)"
                          />
                        </pattern>
                        <image
                          id="image0_166_1548"
                          width="30"
                          height="30"
                          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADuElEQVR4nN2aTahVVRTH96uslJAmTcykLyoqGmiEZhgEfQyKIroQYt3eu/v/2/c+u+IVBKnBnViDJkEQNUiKPqy0UMSkiQ0iApOgkAYFVmbq84NSotQsja3P2F3vPu9xzj7Xd/rDGj3e+q//2Wutvc4615gcaLfblzjnHpb0kqTPgDHgKHAqsJOSfpG0A3gfWNpqta4yUwHtdnsmsNoH2BP0pEzS38AWa+288yKg2+1eACwDDuYR0Mf8aa211s4emIjR0dHLJG2cILC/gE+AFcBD/ok3m80bgUXAYuBlYHef/xtzzi0sXYRz7krg6wwBRyW9MDw8fMUk3A055+6VtL0n3Y5JeqI0EcAM4MsMEZ/mLN4hSSNhc5B0ArivBBmnydZniFhTq9UuLkLgnLsD2Bv4/NWnYzoJxhhr7VMZIt71QlPwNBqN2yT9FpzMtlS+TafTmS7pp0j73O7/bhLC30e+iwUcjydxDKyMtUzg9iQk53J+EAjZWTRtPYaA7yOnsdaUBGvtDcCfAd8jRR3Oj9VG2f0e2Bw8tPeKOnsmImTM3+7Jou7PbQO+g4WKfny46yfk7aRR9+ee08M5J7ez3ls3sOdNyajVaheOjzqnOa219+R2BnwbKfSnk0Yd598T1ORjuR1J+m6qCKFI54qllqTnzABSS2dmrrO8d+V2BqyLCHnLlAw/gPJf3utyO5P0bETIvrLbr3OuEfDtL9R+Jd2ZMSwuSBr5udybAiHrU7zS7ooIeceUhFardS1wPOCqFXYKrMpYHMxNEnn2RbwHmJbC6QxJP0fEbKvX65eahLDWPhiO8cDyUgqvj72ZkOdmSUeCB/VVt9u9KJX/s7WyISZG0itFj9+nabhZkfRHKfsuvwaaYIOydWRkZFbOd54lwO9h/RUaSSaCn0AlfZMhxgezul6vXz5Jf4skfd5zuid8KptBrEklfZQh5tR46/zY73ettfdba29xzl3t7x7gUUkvRt48DwMPmEGhdmbEXhWmQ1GT9GHO1CwOv6sd38AfyRm8v4s2SLrbTAV0Op3p/vYFXgW+kHSoJ+BjESEbTZUADEeEHCp7+EwKa+01sfRqNpu3mioB+DEiZqmpEoA3IkLWmSrBxhfhB5ItqgeBPnuqf80Pi6ZKkPRDREzLVAnA65E2XGy3O2gA9YiQYsuFQaPPiie0m0yVQPx7izNVArBm0B+OSoFz7slIau01VUIro078JzdTJUjaGREiUyVIeu18fQlLCv9bk/9FnVhrZ8fqpNFoXJ+C5B9KiNaRUnbwoAAAAABJRU5ErkJggg=="
                        />
                      </defs>
                    </svg>
                  </div> */}
                  {/* <input
                    type="text"
                    placeholder="Search partner jeweller"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full p-2 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {loading && (
                    <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                      <div className="loader"></div>
                    </div>
                  )} */}
                  {/* Dropdown suggestion box */}
                  {/* {showSuggestions && customerData.length > 0 && (
                    <ul className="absolute left-0 top-full  w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10">
                      {customerData.map((customer) => (
                        <li
                          key={customer.code}
                          onClick={() =>
                            handleSuggestionClick(
                              String(customer.code),
                              customer.name
                            )
                          }
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                          {customer.name}
                        </li>
                      ))}
                    </ul>
                  )} */}
                  <SearchableSelect
                    options={customerData.map((store) => ({
                      label: store.name,
                      value: store.code,
                    }))}
                    onChange={(val) => {
                      console.log("User cleared the selection", val);
                      console.log("User cleared the selection");
                      if (val) {
                        handleSuggestionClick(val.value, val.label);
                      }
                    }}
                    //isClearable
                    placeholder="Search partner jeweller..."
                  />
                </div>
              ) : (
                <div className="w-full">
                  <InputText
                    type="text"
                    label="Customer Name"
                    value={customer?.name}
                    disabled={true}
                  />
                </div>
              )}
            </div>
            <div className="w-full px-4">
              {getCustType() === "Jeweller" && (
                <Dropdown
                  label="Select Store"
                  variant="outlined"
                  options={stores.map((store) => ({
                    label: store.NickName,
                    value: store.CustomerID.toString(),
                  }))}
                  value={stores.toString()} // Ensure this is the correct state selectedSValue
                  onChange={handleSDropdownChange}
                />
              )}
            </div>
          </div>
          <div className="flex flex-row w-full">
            <div className="w-full px-4">
              <TextArea
                label="Contact Detail"
                value={
                  getCustType() === "Jeweller"
                    ? selectedContact
                    : customer?.contactno
                }
                disabled={true}
              />
            </div>
            <div className="w-full px-4">
              <TextArea
                label="Address"
                value={
                  getCustType() === "Jeweller" ? selectedAdd : customer?.address
                }
                disabled={true}
              />
            </div>
          </div>
          {/* </div> */}

          <div className="w-full flex md:flex-row flex-col justify-between pl-4">
            <fieldset className="w-auto p-2 border border-black/10 rounded-md">
              <legend className="text-base font-semibold">
                Select Item Type
              </legend>
              <div className="px-4">
                <RadioButton
                  name="Select Item Type"
                  options={Ioptions}
                  selectedValue={selectedValue}
                  onChange={handleItemTypeChange}
                />
              </div>
            </fieldset>
            <div className="px-4">
              <fieldset className="w-auto p-2 border border-black/10 rounded-md">
                <legend className="text-base font-semibold">Order For</legend>

                <RadioButton
                  name="Order For"
                  options={OrderForoptions}
                  selectedValue={selectedOrderFor}
                  onChange={handleOrderForChange}
                />
              </fieldset>
            </div>
            <div className="flex px-4 mt-4">
              <InputText
                type="text"
                label="EXPECTED DELIVERY DATE"
                value={expectedDeliveryDate} //selectedDate
                disabled={true}
              />
            </div>
          </div>
          <div className="w-full flex md:flex-row flex-col justify-between pl-4 mt-6 px-6">
            <fieldset className="p-2 border border-black/10 rounded-md px-6">
              <legend className="text-base font-semibold">Order Type</legend>
              <div className="flex md:flex-row flex-col justify-between">
                {/* {selectedOrderFor !== "Customer" && (
                  <>
                    <SingleSelectCheckbox
                      title="Consignment"
                      options={Consignmentoptions}
                      //onSelect={handleConsignment}
                      selectedValue={selectedconsignmen}
                      onChange={handleOrderTypeChange}
                      //disabled={selectedOrderFor === "Customer" ? true : false}
                    />
                    <SingleSelectCheckbox
                      title="Sales or Return" 
                      options={SORoptions}
                      selectedValue={selectedsor}
                      onChange={handleOrderTypeChange}
                      //disabled={selectedOrderFor === "Customer" ? true : false}
                      //classes="font-semibold"
                    />
                    <SingleSelectCheckbox
                      title="Outright Purchase" 
                      options={Outpurchaseoptions}
                      selectedValue={selectedoutrightpur}
                      onChange={handleOrderTypeChange}
                      //disabled={selectedOrderFor === "Customer" ? true : false}
                      //classes="font-semibold"
                    />
                  </>
                )}

                <SingleSelectCheckbox
                  title="Customer Order"
                  options={CustomerOrderoptions}
                  //onSelect={handleConsignment}
                  selectedValue={selectedCustOrder}
                  onChange={handleOrderTypeChange}
                /> */}
                <RadioButton
                  name=""
                  options={CVoptions}
                  selectedValue={orderType}
                  onChange={handleOrderTypeChange}
                />
              </div>
            </fieldset>
          </div>
        </div>
      </main>
      <footer>
        <div className="w-full text-[#888] px-6">
          Disclaimer: We are not committing for delivering the order on the
          delivery date. We will try our best to deliver within time.
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
      </footer>
    </div>
  );
};

export default ChooseYourOrderScreen;
