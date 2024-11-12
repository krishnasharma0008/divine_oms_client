"use client";

import React, { useEffect, useState } from "react";
import CheckboxGroup from "@/components/common/checkbox";
import JewelleryHomeDiv from "@/components/common/jewellery-home";
import { useSearchParams } from "next/navigation";
import PJDetailModal from "@/components/common/pj-detail-modal";
//import JewelDetailModal from "@/components/common/jewellery-detail-modal";
// import { JewelleryDetail } from "@/interface";
// import LoaderContext from "@/context/loader-context";
//import { getJewelleryDetailID } from "@/api/jewellery-detail";
//import NotificationContext from "@/context/notification-context";

const INITIAL_ITEMS = 4; // Initial items to show
const LOAD_MORE_COUNT = 4; // Number of items to load per click

function JewelleyScreen() {
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [selectedcategory, setSelectedCategory] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Control spinner visibility
  const [itemsToShow, setItemsToShow] = useState<number>(INITIAL_ITEMS); //data to show
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //to show pjdetails
  //const [isJDetailModalOpen, setIsJDetailModalOpen] = useState<boolean>(false); //to show pjdetails
  // const [selectedJewelleryItem, setSelectedJewelleryItem] = useState<
  //   Array<JewelleryDetail>
  // >([]);
  // const { showLoader, hideLoader } = useContext(LoaderContext);
  // const { notifyErr } = useContext(NotificationContext);

  const searchParams = useSearchParams();

  const selectedJValue = searchParams.get("isCustomerName"); //jeweller
  const selectedSValue = searchParams.get("store_city"); //store
  const selectedAdd = searchParams.get("selectedAdd");
  const selectedContact = searchParams.get("selectedContact");
  const selectedValue = searchParams.get("selectedValue");

  //const selectedDate = searchParams.get("selectedDate");

  useEffect(() => {
    console.log("Received data:", {
      selectedJValue, //jeweller
      selectedSValue, // store
      selectedAdd, //add
      selectedContact, //contact
      selectedValue, // item type
    });
  }, [searchParams]);

  const optionsCategory = [
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
    { label: "Category 3", value: "category3" },
  ];

  const handleClearAll = () => {
    setCategory("");
    setDate("");
    setSelectedCategory([]);
    setSearchText("");
  };

  const handleSearch = () => {
    setLoading(true); // Show spinner
    console.log("Searching with filters:", {
      category,
      date,
      selectedcategory,
      searchText,
    });

    // Simulate search delay
    setTimeout(() => {
      setLoading(false); // Hide spinner once search is done
    }, 2000);
  };

  const sampleJewelleryData = [
    {
      id: 1,
      design_no: "Design 001",
      g_wt: "1.30",
      d_size: "0.14-0.17",
      imgurl: "/path/to/image1.jpg",
    },
    {
      id: 2,
      design_no: "Design 002",
      g_wt: "1.50",
      d_size: "0.18-0.20",
      imgurl: "/path/to/image2.jpg",
    },
    {
      id: 3,
      design_no: "Design 003",
      g_wt: "1.70",
      d_size: "0.21-0.25",
      imgurl: "/path/to/image3.jpg",
    },
    {
      id: 4,
      design_no: "Design 004",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image4.jpg",
    },
    {
      id: 5,
      design_no: "Design 005",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image5.jpg",
    },
    {
      id: 6,
      design_no: "Design 006",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image6.jpg",
    },
    {
      id: 7,
      design_no: "Design 007",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image7.jpg",
    },
    {
      id: 8,
      design_no: "Design 008",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image8.jpg",
    },
    {
      id: 9,
      design_no: "Design 009",
      g_wt: "1.80",
      d_size: "0.26-0.30",
      imgurl: "/path/to/image9.jpg",
    },
  ];

  const handleLoadMore = () => {
    setItemsToShow((prev) =>
      Math.min(prev + LOAD_MORE_COUNT, sampleJewelleryData.length)
    );
  };

  const handlePjDetailClick = () => {
    setIsModalOpen(true);
  };

  const handlejewelleryDetailClick = async (jewelleryid: number) => {
    console.log(jewelleryid);
    // try {
    //   showLoader();
    //   const result = await getJewelleryDetailID(jewelleryid);
    //   setSelectedJewelleryItem(result.data.data ?? []);
    // } catch (error) {
    //   notifyErr("An error occurred while fetching Jewellery details.");
    //   console.error(error);
    // } finally {
    //   hideLoader();
    // }
    // setIsJDetailModalOpen(true);
  };

  return (
    <div className="flex space-x-4">
      {/* Filter Section */}
      <div className="w-1/4 p-2 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filter By</h2>

        {/* Buttons */}
        <div className="flex space-x-2 mb-4">
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

        {/* Search Input with Spinner */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full p-2 border rounded-md pr-10"
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

      {/* Data Section */}
      <div className="flex-1 p-4 bg-white rounded-lg shadow-md h-[600px] overflow-y-auto">
        {/* Buttons above Data Header */}
        <div className="flex justify-end space-x-2 mb-4">
          <button className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black">
            Bulk Edit
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
            onClick={() => handlePjDetailClick()}
          >
            Pj-Detail
          </button>
        </div>
        {/* <h2 className="text-lg font-semibold mb-4">Data Section</h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sampleJewelleryData.slice(0, itemsToShow).map((item, index) => (
            <JewelleryHomeDiv
              key={index}
              design_no={item.design_no}
              g_wt={item.g_wt}
              d_size={item.d_size}
              imgurl={item.imgurl}
              onClick={() => handlejewelleryDetailClick(item.id)}
            />
          ))}
        </div>
        {/* Load More Button */}
        {itemsToShow < sampleJewelleryData.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 border border-black bg-black text-white rounded hover:bg-white hover:text-black"
            >
              Load More
            </button>
          </div>
        )}
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

      {/* Modal */}
      {/* {isJDetailModalOpen && (
        <JewelDetailModal
          isOpen={isJDetailModalOpen}
          onClose={() => setIsJDetailModalOpen(false)}
          //jewelleryItem={selectedJewelleryItem}
          jewelleryItem={sampleJewelleryData[0]}
        />
      )} */}
    </div>
  );
}

export default JewelleyScreen;
