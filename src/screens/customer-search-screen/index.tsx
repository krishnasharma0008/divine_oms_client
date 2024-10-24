"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import CustomerCreateScreen from "./sub-components";
import { CustomerDetail } from "@/interface";
import NotificationContext from "@/context/notification-context";
import LoaderContext from "@/context/loader-context";
import { getCustomerDetailValue } from "@/api/customer";

const CustomerSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddingCustomer, setIsAddingCustomer] = useState<boolean>(false);
  const [isCustomerID, setIsCustomerID] = useState<string | null>(null);
  const { notifyErr } = useContext(NotificationContext);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const [customerData, setCustomerDetail] = useState<Array<CustomerDetail>>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setShowSuggestions(false);
      return;
    }

    try {
      showLoader();
      const result = await getCustomerDetailValue(value);
      setCustomerDetail(result.data.data ?? []);
      setShowSuggestions(true);
    } catch (error) {
      notifyErr("An error occurred while fetching customer details.");
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const handleSuggestionClick = (id: string) => {
    setIsCustomerID(id);
    setShowSuggestions(false);
    setSearchQuery(""); // Optionally clear the search query
  };

  const handleAddCustomerClick = () => {
    setIsAddingCustomer(true);
    setIsCustomerID(null);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleCustomerAdded = () => {
    setIsAddingCustomer(false);
    setSearchQuery("");
    setIsCustomerID(null);
  };

  return (
    <div className="w-full h-auto bg-white flex items-center justify-center">
      <div className="w-full flex flex-col items-center p-8 gap-3">
        <div className="w-full flex justify-between items-center mb-3 relative">
          <div className="relative w-2/3">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {/* Magnifying glass SVG */}
              <svg
                width="35"
                height="34"
                viewBox="0 0 35 34"
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
                    <use xlinkHref="#image0_166_1548" transform="scale(0.02)" />
                  </pattern>
                  <image
                    id="image0_166_1548"
                    width="50"
                    height="50"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADuElEQVR4nN2aTahVVRTH96uslJAmTcykLyoqGmiEZhgEfQyKIroQYt3eu/v/2/c+u+IVBKnBnViDJkEQNUiKPqy0UMSkiQ0iApOgkAYFVmbq84NSotQsja3P2F3vPu9xzj7Xd/rDGj3e+q//2Wutvc4615gcaLfblzjnHpb0kqTPgDHgKHAqsJOSfpG0A3gfWNpqta4yUwHtdnsmsNoH2BP0pEzS38AWa+288yKg2+1eACwDDuYR0Mf8aa211s4emIjR0dHLJG2cILC/gE+AFcBD/ok3m80bgUXAYuBlYHef/xtzzi0sXYRz7krg6wwBRyW9MDw8fMUk3A055+6VtL0n3Y5JeqI0EcAM4MsMEZ/mLN4hSSNhc5B0ArivBBmnydZniFhTq9UuLkLgnLsD2Bv4/NWnYzoJxhhr7VMZIt71QlPwNBqN2yT9FpzMtlS+TafTmS7pp0j73O7/bhLC30e+iwUcjydxDKyMtUzg9iQk53J+EAjZWTRtPYaA7yOnsdaUBGvtDcCfAd8jRR3Oj9VG2f0e2Bw8tPeKOnsmImTM3+7Jou7PbQO+g4WKfny46yfk7aRR9+ee08M5J7ez3ls3sOdNyajVaheOjzqnOa219+R2BnwbKfSnk0Yd598T1ORjuR1J+m6qCKFI54qllqTnzABSS2dmrrO8d+V2BqyLCHnLlAw/gPJf3utyO5P0bETIvrLbr3OuEfDtL9R+Jd2ZMSwuSBr5udybAiHrU7zS7ooIeceUhFardS1wPOCqFXYKrMpYHMxNEnn2RbwHmJbC6QxJP0fEbKvX65eahLDWPhiO8cDyUgqvj72ZkOdmSUeCB/VVt9u9KJX/s7WyISZG0itFj9+nabhZkfRHKfsuvwaaYIOydWRkZFbOd54lwO9h/RUaSSaCn0AlfZMhxgezul6vXz5Jf4skfd5zuid8KptBrEklfZQh5tR46/zY73ettfdba29xzl3t7x7gUUkvRt48DwMPmEGhdmbEXhWmQ1GT9GHO1CwOv6sd38AfyRm8v4s2SLrbTAV0Op3p/vYFXgW+kHSoJ+BjESEbTZUADEeEHCp7+EwKa+01sfRqNpu3mioB+DEiZqmpEoA3IkLWmSrBxhfhB5ItqgeBPnuqf80Pi6ZKkPRDREzLVAnA65E2XGy3O2gA9YiQYsuFQaPPiie0m0yVQPx7izNVArBm0B+OSoFz7slIau01VUIro078JzdTJUjaGREiUyVIeu18fQlLCv9bk/9FnVhrZ8fqpNFoXJ+C5B9KiNaRUnbwoAAAAABJRU5ErkJggg=="
                  />
                </defs>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search customer here..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-3 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {/* Dropdown suggestion box */}
            {showSuggestions && customerData.length > 0 && (
              <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto z-10">
                {customerData.map((customer) => (
                  <li
                    key={customer.id}
                    onClick={() => handleSuggestionClick(String(customer.id))}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  >
                    {customer.name} ({customer.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="ml-4 py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleAddCustomerClick}
          >
            + Add New Customer
          </button>
        </div>

        {isAddingCustomer ? (
          <div className="w-full rounded-lg shadow-md flex flex-col items-center">
            <CustomerCreateScreen
              customerid={"new"}
              onCustomerAdded={handleCustomerAdded}
            />
          </div>
        ) : isCustomerID ? (
          <div className="w-full rounded-lg shadow-md flex flex-col items-center">
            <CustomerCreateScreen
              customerid={isCustomerID}
              onCustomerAdded={handleCustomerAdded}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Search for customer
            </h2>
            <Image
              src="/3d-magnifying-glass.png"
              alt="No results"
              height={520}
              width={612}
              sizes="100vw"
              className="w-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchScreen;
