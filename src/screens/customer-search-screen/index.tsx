"use client";

import React, { useContext, useState } from "react";
import CustomerCreateScreen from "./sub-components";
import { CustomerDetail } from "@/interface";
import NotificationContext from "@/context/notification-context";
import { getCustomerDetailValue } from "@/api/customer";

const CustomerSearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddingCustomer, setIsAddingCustomer] = useState<boolean>(false);
  const [isCustomerID, setIsCustomerID] = useState<string | null>(null);
  const { notifyErr } = useContext(NotificationContext);
  const [customerData, setCustomerDetail] = useState<Array<CustomerDetail>>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setLoading(true);
    if (value.trim() === "") {
      setShowSuggestions(false);
      setLoading(false);
      return;
    }

    try {
      const result = await getCustomerDetailValue(value);
      setCustomerDetail(result.data.data ?? []);
      setShowSuggestions(true);
    } catch (error) {
      notifyErr("An error occurred while fetching customer details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (id: string) => {
    setIsCustomerID(id);
    setShowSuggestions(false);
    setSearchQuery("");
    setIsAddingCustomer(false);
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

  const showForm = isAddingCustomer || isCustomerID;

  return (
    <div className="min-h-[calc(100vh-85px)] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Customer search
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Find an existing customer or register a new one to continue
          </p>
        </header>

        <div className="space-y-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by name or mobile..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            {loading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              </span>
            )}
            {showSuggestions && customerData.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {customerData.map((customer) => (
                  <li key={customer.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick(String(customer.id))}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <span className="font-medium">{customer.name}</span>
                      {customer.contactno && (
                        <span className="ml-2 text-gray-500">
                          {customer.contactno}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:bg-gray-50 sm:w-auto"
            onClick={handleAddCustomerClick}
          >
            + Add new customer
          </button>
        </div>

        {showForm ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <CustomerCreateScreen
              customerid={isAddingCustomer ? "new" : isCustomerID}
              onCustomerAdded={handleCustomerAdded}
            />
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A9C5C6]/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-8 w-8 text-gray-600"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-medium text-gray-900">
              Search for a customer
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Type a name or mobile number above, or add a new customer to get
              started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchScreen;
