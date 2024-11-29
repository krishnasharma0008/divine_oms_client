"use client";

import React, { useContext, useEffect, useState } from "react";
import CheckboxGroup from "@/components/common/checkbox";
import JewelleryHomeDiv from "@/components/common/jewellery-home";
import { useSearchParams } from "next/navigation";
import PJDetailModal from "@/components/common/pj-detail-modal";
//import JewelDetailModal from "@/components/common/jewellery-detail-modal";
import { Jewellery } from "@/interface";
//import LoaderContext from "@/context/loader-context";
import { getJewelleryDetailID } from "@/api/jewellery-detail";
import NotificationContext from "@/context/notification-context";
import BulkImportModal from "@/components/common/bulk-import-modal";

function JewelleyScreen() {
  //const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [selectedcategory, setSelectedCategory] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Control spinner visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //to show pjdetails
  //const [isJDetailModalOpen, setIsJDetailModalOpen] = useState<boolean>(false); //to show pjdetails
  const [selectedJewelleryItem, setSelectedJewelleryItem] = useState<
    Array<Jewellery>
  >([]);
  //const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notifyErr } = useContext(NotificationContext);

  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [isLoadingMore, setIsLoadingMore] = useState(false); //load more button
  //const [selectedJewellery, setSelectedJewellery] = useState<JewelleryDetail | null>(null); //eye click

  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const searchParams = useSearchParams();

  const selectedJValue = searchParams.get("isCustomerName"); //jeweller
  const selectedSValue = searchParams.get("store_city"); //store
  const selectedAdd = searchParams.get("selectedAdd");
  const selectedContact = searchParams.get("selectedContact");
  const selectedValue = searchParams.get("selectedValue");

  //const selectedDate = searchParams.get("selectedDate");
  // Fetch initial data and handle updates on search params change
  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 on search param change
    setSelectedJewelleryItem([]); // Clear previous items
    FetchListdata(1); // Load first page of new search results
  }, [searchParams]);

  // Fetch data when the page number increments
  useEffect(() => {
    if (currentPage > 1) {
      FetchListdata(currentPage);
    }
  }, [currentPage]);

  const optionsCategory = [
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
    { label: "Category 3", value: "category3" },
  ];

  const handleClearAll = () => {
    //setCategory("");
    setDate("");
    setSelectedCategory([]);
    setSearchText("");
  };

  const handleSearch = () => {
    setLoading(true); // Show spinner
    console.log("Searching with filters:", {
      //category,
      date,
      selectedcategory,
      searchText,
    });

    // Simulate search delay
    setTimeout(() => {
      setLoading(false); // Hide spinner once search is done
    }, 2000);
  };

  const FetchListdata = async (pageno: number) => {
    try {
      setIsLoadingMore(true);
      const response = await getJewelleryDetailID(pageno);
      const newItems = response.data.data ?? [];
      if (pageno === 1) {
        setSelectedJewelleryItem(newItems);
      } else {
        setSelectedJewelleryItem((prevItems) => [...prevItems, ...newItems]); // Append new data
      }
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
    } finally {
      setIsLoadingMore(false); // Ensure reset after fetching
    }
  };

  const handleLoadMore = () => {
    //setItemsToShow((prev) => prev + LOAD_MORE_COUNT);
    console.log("Page_No : ", currentPage);
    setCurrentPage((prevPage) => prevPage + 1); // Increment page number
  };

  const handlePjDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleBulkImport = () => {
    //setIsBulkImportOpen(true);
  };

  return (
    <div className="flex max-h-[calc(100vh_-_80px)] overflow-y-auto gap-x-2 m-0.5">
      {/* Left Div with 20% width */}
      <div className="w-1/5 flex flex-col bg-gray-100 text-white my-0.5 ml-0.5">
        {/* Fixed Header */}
        <div className="h-20 bg-gray-100 p-2 sticky top-0">
          <h1 className="text-xl font-bold text-black">Filter By</h1>

          <div className="flex space-x-2 mb-2 overflow-y-auto">
            <button
              onClick={handleClearAll}
              className="flex-1 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Clear All
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-auto p-4 h-[90vh]">
          {/* Search Input with Spinner */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-2 text-black border rounded-md pr-10"
            />
            {loading && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <div className="loader"></div>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <CheckboxGroup
            title="Category"
            options={optionsCategory}
            selectedValues={selectedcategory}
            onChange={setSelectedCategory}
          />

          {/* Date Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Fixed Footer */}
        {/* <div className="h-16 bg-blue-700 p-4">
          <h1 className="text-xl font-bold">Left Footer</h1>
        </div> */}
      </div>

      {/* Right Div with the remaining width (80%) */}
      <div className="w-4/5 flex flex-col bg-white text-white shadow-md border my-0.5">
        {/* Fixed Header */}
        <div className="h-16 bg-white p-4 sticky top-0">
          <div className="flex justify-end space-x-2 mb-4">
            <button
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
              onClick={handleBulkImport}
            >
              Bulk Import
            </button>
            <button
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
              onClick={() => handlePjDetailClick()}
            >
              Pj-Detail
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        {/* <div className="flex-1 overflow-auto p-4 h-[80vh]"></div> */}
        <div className="flex-1 overflow-y-auto h-[90vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-2">
            {selectedJewelleryItem.map((item, index) => (
              <JewelleryHomeDiv
                key={index}
                //Item_id={item.Item_id}
                olddesign_no={item.old_varient}
                design_no={item.item_number}
                g_wt={item.weight}
                d_size={item.solitaire_slab}
                imgurl={item.image_url}
                //onClick={() => handlejewelleryDetailClick(item.item_number)}
              />
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        {/* <div className="h-16 bg-green-700 p-4"></div> */}
        <div className="flex justify-center mt-4 mb-2">
          <button
            onClick={handleLoadMore}
            className={`w-22 px-4 py-2 text-sm tracking-wide rounded-lg text-white bg-black focus:outline-none ${
              isLoadingMore ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              // Spinner inside the button
              <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <PJDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          //   selectedJValue,//jeweller
          // selectedSValue, // store
          // selectedAdd,//add
          // selectedContact,//contact
          // selectedValue,// item type
          selectedJValue={selectedJValue} //jeweller
          selectedSValue={selectedSValue} // store
          selectedAdd={selectedAdd} //add
          selectedContact={selectedContact} //contact
          selectedValue={selectedValue} // item type
          // selectedOrderValue={selectedOrderValue}
          // selectedOrderForValue={selectedOrderForValue}

          // selectedDate={selectedDate}
        />
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />
      {/* Modal */}
      {/* {isJDetailModalOpen && (
        <JewelDetailModal
          isOpen={isJDetailModalOpen}
          onClose={() => setIsJDetailModalOpen(false)}
          //jewelleryItem={selectedJewelleryItem}
          jewelleryItem={selectedJewellery}
        />
      )} */}
    </div>
  );
}

export default JewelleyScreen;
