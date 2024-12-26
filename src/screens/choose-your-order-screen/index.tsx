"use client";

import React, { useContext, useEffect, useState } from "react";
import RadioButton from "@/components/common/input-radio";
//import CheckboxGroup from "@/components/common/checkbox";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
import { Button, SingleSelectCheckbox } from "@/components/common";
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

dayjs.extend(utcPlugin);

interface OptionType {
  value: string;
  label: string;
}

const ChooseYourOrderScreen = () => {
  const { setCustomerOrder, resetCustomerOrder } = useCustomerOrderStore(); // Use the customer store
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCustomerName, setIsCustomerName] = useState<string | null>(null);
  const { notifyErr } = useContext(NotificationContext);
  //const { showLoader, hideLoader } = useContext(LoaderContext);
  const [customerData, setCustomerDetail] = useState<OptionType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Control spinner visibility

  const [stores, setStores] = useState<PJCustomerStoreDetail[]>([]); // Store details
  const [selectedSValue, setSelectedSValue] = useState<string>(""); // Selected store state
  const [selectedValue, setSelectedValue] = useState("jewellery"); // Item type radio button
  const [selectedContact, setSelectedContact] = useState("");
  const [selectedAdd, setSelectedAdd] = useState("");
  const [selectedconsignmen, setSelectedConsignment] = useState(""); // Single checkbox
  const [selectedsor, setSelectedSOR] = useState(""); // Single checkbox
  const [selectedoutrightpur, setSelectedOutrightPur] = useState(""); // Single checkbox
  const [selectedCustOrder, setSelectedCustOrder] = useState(""); // Single checkbox
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(""); // Delivery Date

  const [orderType, setOrderType] = useState("");

  const router = useRouter();

  // Access customer data from Zustand store
  const { customer } = useCustomerStore();

  useEffect(() => {
    // Calculate current date + 14 days
    const today = new Date();
    const expDeliveryDate = new Date(today);
    expDeliveryDate.setDate(today.getDate() + 14); // Add 14 days

    // Format the date using dayjs
    const formattedExpDeliveryDate =
      dayjs(expDeliveryDate).format("DD-MM-YYYY");
    console.log(formattedExpDeliveryDate);
    // Update the state to show the calculated date
    setExpectedDeliveryDate(formattedExpDeliveryDate);
  }, [customer, expectedDeliveryDate]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setLoading(true);
    if (value.trim() === "") {
      // Clear suggestions when input is empty
      setShowSuggestions(false);
      setLoading(false);
      setCustomerDetail([]);
      setStores([]);
      setSelectedAdd("");
      setSelectedContact("");
      return;
    }

    try {
      //showLoader();
      const result = await getpjCustomer(value);
      const pjCustOptions = result.data.data.map((item: string) => ({
        label: item,
        value: item,
      }));
      setCustomerDetail(pjCustOptions);
      setShowSuggestions(true);
    } catch (error) {
      notifyErr("An error occurred while fetching customer details.");
      console.error(error);
    } finally {
      //hideLoader();
      setLoading(false);
    }
  };

  const handleSuggestionClick = (id: string) => {
    console.log("Selected customer", id);
    setIsCustomerName(id);
    getpjstoredata(id); //fetch store data
    setShowSuggestions(false);
    setSearchQuery(id); // Optionally clear the search query
    setStores([]);
    setSelectedAdd("");
    setSelectedContact("");
  };

  const getpjstoredata = async (custName?: string) => {
    try {
      //console.log("Jeweller Name :", custName);
      const response = await getpjStore(custName);
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
  };

  const handleOrderTypeChange = (value: string) => {
    console.log("selected Order Type", value);
    if (value === "tcs" || value === "rroexhibitation") {
      console.log("selected Consignment", value);
      setSelectedConsignment(value);
      setSelectedSOR("");
      setSelectedOutrightPur("");
      setSelectedCustOrder("");
    } else if (value === "sor") {
      console.log("selected Sale Of Order", value);
      setSelectedConsignment("");
      setSelectedSOR(value);
      setSelectedOutrightPur("");
      setSelectedCustOrder("");
    } else if (value === "outpur") {
      console.log("selected Out Purchase", value);
      setSelectedConsignment("");
      setSelectedSOR("");
      setSelectedOutrightPur(value);
      setSelectedCustOrder("");
    } else if (value === "rco" || value === "sco") {
      console.log("selected Customer Order", value);
      setSelectedConsignment("");
      setSelectedSOR("");
      setSelectedOutrightPur("");
      setSelectedCustOrder(value);
    }
    setOrderType(value);
  };

  const Ioptions = [
    { label: "Solitaire", value: "solitaire" },
    { label: "Jewellery", value: "jewellery" },
  ];

  const Consignmentoptions = [
    { label: "TCS", value: "tcs" },
    { label: "RRO / Exhibition", value: "rroexhibitation" },
  ];
  const SORoptions = [{ label: "Sale or Return(SOR)", value: "sor" }];
  const Outpurchaseoptions = [{ label: "Outright Purchase", value: "outpur" }];
  const CustomerOrderoptions = [
    { label: "RCO", value: "rco" },
    { label: "SCO", value: "sco" },
  ];

  const handleProceed = () => {
    // Reset customer order before proceeding
    resetCustomerOrder();
    console.log("Store : ", selectedSValue);
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

    // Prepare payload based on the customer type
    const payload: CustomerOrderDetail = {
      order_for: getCustType() ?? "",
      customer_id:
        getCustType() === "Jeweller"
          ? Number(selectedStore?.CustomerID)
          : customer?.id ?? 0,
      product_type: selectedValue, //itemtype
      order_type: orderType, //ordertype
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
    // <div className="bg-white rounded p-2 m-2 shadow-md space-y-2">
    <div className="bg-white min-h-[calc(100vh_-_96px)] rounded p-2 m-2 shadow-md space-y-2 ">
      {/* <div>
        <h2 className="font-medium text-xl">Choose Your Order Type</h2>
      </div> */}

      {/* Scrollable content */}
      {/* <div className="overflow-y-auto max-h-[50vh] space-y-4 px-4"> */}
      {/* overflow-y-auto max-h-[48vh] */}
      <div className="mb-2 px-4">
        <div className="flex w-full justify-between mt-2">
          <div className="w-full px-4">
            {getCustType() === "Jeweller" ? (
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {/* Magnifying glass SVG */}
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
                </div>
                <input
                  type="text"
                  placeholder="Search partner jeweller"
                  //value={isCustomerID?.toString()}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full p-2 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {loading && (
                  <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                    <div className="loader"></div>
                  </div>
                )}
                {/* Dropdown suggestion box */}
                {showSuggestions && customerData.length > 0 && (
                  <ul className="absolute left-0 top-full  w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10">
                    {customerData.map((customer) => (
                      <li
                        key={customer.value}
                        onClick={() =>
                          handleSuggestionClick(String(customer.value))
                        }
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        {customer.value} {/*({customer.email}) */}
                      </li>
                    ))}
                  </ul>
                )}
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

        <div className="w-full flex">
          <div className="w-1/3 flex flex-col">
            <div>
              <p className="text-[#888]">Select Item Type</p>
            </div>
            <div>
              <RadioButton
                name="Select Item Type"
                options={Ioptions}
                selectedValue={selectedValue}
                onChange={handleItemTypeChange}
              />
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
          <div className="w-2/3">
            <div className="mb-2">
              <p className="text-[#888]">Order Type</p>
            </div>
            <div className="flex justify-around">
              <SingleSelectCheckbox
                title="Consignment"
                options={Consignmentoptions}
                //onSelect={handleConsignment}
                selectedValue={selectedconsignmen}
                onChange={handleOrderTypeChange}
              />
              <SingleSelectCheckbox
                title="" /*Sales or Return(SOR)*/
                options={SORoptions}
                selectedValue={selectedsor}
                onChange={handleOrderTypeChange}
                classes="font-semibold"
              />
              <SingleSelectCheckbox
                title="" /*"Outright Purchase"*/
                options={Outpurchaseoptions}
                selectedValue={selectedoutrightpur}
                onChange={handleOrderTypeChange}
                classes="font-semibold"
              />
              <SingleSelectCheckbox
                title="Customer Order"
                options={CustomerOrderoptions}
                //onSelect={handleConsignment}
                selectedValue={selectedCustOrder}
                onChange={handleOrderTypeChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-[#888] px-4">
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
      {/* <div className="g-container">
        
      </div> */}
    </div>
  );
};

export default ChooseYourOrderScreen;
