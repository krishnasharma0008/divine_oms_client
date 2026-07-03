"use client";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/common";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/store/customerStore";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import { getCustType } from "@/local-storage";
import { PJCustomerStoreDetail } from "@/interface/pj-custome-store";
import NotificationContext from "@/context/notification-context";
import { getpjCustomer, getpjStore } from "@/api/pjcustomer-store-detail";
import { CustomerOrderDetail } from "@/interface";
import dayjs from "dayjs";
import utcPlugin from "dayjs/plugin/utc";
import SearchableSelect from "@/components/common/searchDropdown";

dayjs.extend(utcPlugin);

interface OptionType {
  code: string;
  name: string;
}

interface OptionPillsProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

function OptionPills({ options, value, onChange }: OptionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`min-h-[44px] rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            value === opt.value
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="min-h-[44px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm leading-snug text-gray-900">
        {value?.trim() || "—"}
      </p>
    </div>
  );
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
    setIsCustomerName(name);
    getpjstoredata(id);
    setStores([]);
    setSelectedSValue("");
    setSelectedCustCode("");
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

  const isJeweller = getCustType() === "Jeweller";
  const contactDisplay = isJeweller ? selectedContact : customer?.contactno;
  const addressDisplay = isJeweller ? selectedAdd : customer?.address;
  const selectedStore = stores.find(
    (store) => store.CustomerID.toString() === selectedSValue
  );
  const selectedStoreLabel =
    selectedStore?.NickName?.trim() ||
    selectedStore?.Name?.trim() ||
    "";
  const retailStoreLabel = "Mumbai HO";

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
    console.log("cust_code : ",selectedCustCode);
    console.log("cust_name : ",isCustomerName);
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
    <div className="min-h-[calc(100vh-85px)] bg-gray-50 pb-32 lg:pb-10">
      <div className="mx-auto max-w-3xl px-3 py-5 sm:px-6 lg:max-w-4xl lg:py-10">
        <header className="mb-5 sm:mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Choose your order
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Set partner, store, and order options before browsing products
          </p>
        </header>

        <div className="space-y-3 sm:space-y-4">
          {/* Customer & store */}
          <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Customer
            </h2>
            <div className="mt-3 space-y-4 sm:mt-4">
              {isJeweller ? (
                <>
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-gray-700 sm:text-sm">
                      Partner jeweller
                    </p>
                    <SearchableSelect
                      options={customerData.map((store) => ({
                        label: store.name,
                        value: store.code,
                      }))}
                      onChange={(val) => {
                        if (val) {
                          handleSuggestionClick(val.value, val.label);
                        }
                      }}
                      placeholder="Search partner jeweller..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="store-select"
                      className="mb-1.5 block text-xs font-medium text-gray-700 sm:text-sm"
                    >
                      Select store
                    </label>
                    <select
                      id="store-select"
                      value={selectedSValue}
                      onChange={(e) => handleSDropdownChange(e.target.value)}
                      disabled={stores.length === 0}
                      className="w-full min-h-[44px] rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">
                        {stores.length === 0
                          ? "Select a partner first"
                          : "Choose a store"}
                      </option>
                      {stores.map((store) => (
                        <option
                          key={store.CustomerID}
                          value={store.CustomerID.toString()}
                        >
                          {store.NickName || store.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <ReadOnlyField label="Customer name" value={customer?.name} />
              )}

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <ReadOnlyField label="Contact" value={contactDisplay} />
                <ReadOnlyField label="Address" value={addressDisplay} />
              </div>

              {/* Selection summary — visible once partner/store chosen */}
              {(isJeweller
                ? isCustomerName || selectedStoreLabel
                : customer?.name) && (
                <div className="rounded-lg border border-[#A9C5C6]/50 bg-[#A9C5C6]/10 p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Selected for this order
                  </p>
                  <dl className="mt-2 space-y-2 text-sm">
                    {isJeweller && isCustomerName && (
                      <div>
                        <dt className="text-gray-500">Partner</dt>
                        <dd className="font-medium text-gray-900">
                          {isCustomerName}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-gray-500">Store</dt>
                      <dd className="font-semibold text-gray-900">
                        {isJeweller
                          ? selectedStoreLabel || "Not selected yet"
                          : retailStoreLabel}
                      </dd>
                    </div>
                    {contactDisplay?.trim() && (
                      <div>
                        <dt className="text-gray-500">Contact</dt>
                        <dd className="text-gray-900">{contactDisplay}</dd>
                      </div>
                    )}
                    {addressDisplay?.trim() && (
                      <div>
                        <dt className="text-gray-500">Address</dt>
                        <dd className="text-gray-900">{addressDisplay}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </section>

          {/* Item type & order for */}
          <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Product & delivery
            </h2>
            <div className="mt-3 space-y-4 sm:mt-4 sm:space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                  Item type
                </p>
                <OptionPills
                  options={Ioptions}
                  value={selectedValue}
                  onChange={handleItemTypeChange}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                  Order for
                </p>
                <OptionPills
                  options={OrderForoptions}
                  value={selectedOrderFor}
                  onChange={handleOrderForChange}
                />
              </div>
              <ReadOnlyField
                label="Expected delivery date"
                value={expectedDeliveryDate}
              />
            </div>
          </section>

          {/* Order type */}
          <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Order type
            </h2>
            <div className="mt-3 sm:mt-4">
              <OptionPills
                options={CVoptions}
                value={orderType}
                onChange={handleOrderTypeChange}
              />
            </div>
          </section>

          <p className="px-1 text-xs leading-relaxed text-gray-500">
            Disclaimer: We are not committing for delivering the order on the
            delivery date. We will try our best to deliver within time.
          </p>

          <div className="hidden justify-end pt-2 lg:flex">
            <Button
              themeType="dark"
              classes="min-w-[160px] h-11 text-sm font-semibold"
              onClick={handleProceed}
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky proceed bar — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <Button
          themeType="dark"
          classes="w-full h-11 text-sm font-semibold"
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ChooseYourOrderScreen;
