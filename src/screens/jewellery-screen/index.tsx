"use client";

//import { Switch } from "@material-tailwind/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import CheckboxGroup from "@/components/common/checkbox";
import JewelleryHomeDiv from "@/components/common/jewellery-home";
import { useSearchParams, useRouter } from "next/navigation";
import PJDetailModal from "@/components/common/pj-detail-modal";
import { Jewellery } from "@/interface";
//import LoaderContext from "@/context/loader-context";
import { getJewelleryDetailID } from "@/api/jewellery-detail";
import NotificationContext from "@/context/notification-context";
//import BulkImportModal from "@/components/common/bulk-import-modal";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import MessageModal from "@/components/common/message-modal";
import { ProductFilters } from "@/api/jewellery-filters";
import Loader from "@/components/common/loader";

interface OptionType {
  value: string;
  label: string;
}

function JewelleyScreen() {
  //const [category, setCategory] = useState<string>("");
  const dataContainer = useRef<HTMLDivElement>(null);

  const { customerOrder } = useCustomerOrderStore();
  //const [date, setDate] = useState<string>("");
  const [selectedcategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubCategory] = useState<string[]>([]);
  const [selectedcollection, setSelectedCollection] = useState<string[]>([]);
  const [selectedMetal, setSelectedMetal] = useState<string[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Control spinner visibility
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //to show pjdetails
  const [selectedJewelleryItem, setSelectedJewelleryItem] = useState<
    Array<Jewellery>
  >([]);

  const [productCategory, setProductCategory] = useState<OptionType[]>([]);
  const [productSubCategory, setProductSubCategory] = useState<OptionType[]>(
    []
  );
  const [productCollection, setProductCollection] = useState<OptionType[]>([]);
  const { notifyErr } = useContext(NotificationContext);

  const [currentPage, setCurrentPage] = useState<number>(1); // Track current page
  const [isLoadingMore, setIsLoadingMore] = useState(false); //load more button
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); //message popup

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const [totRecords, setTotRecords] = useState<number>(1); // Track current page
  const [newLaunch, setNewLaunch] = useState<number>(1); // Track current page

  const searchParams = useSearchParams();
  const router = useRouter();

  const metaloptions = [
    { label: "18KT", value: "18KT" },
    { label: "950PT", value: "950PT" },
  ];

  const portfoliooptions = [
    { label: "Divine (DSJ)", value: "Divine (DSJ)" },
    { label: "Non-Divine (NDSJ)", value: "Non-Divine (NDSJ)" },
  ];

  // if (customerOrder?.order_for === "Stock") {
  //   portfoliooptions.push({ label: "Divine (DSJ)", value: "Divine (DSJ)" });
  // } else {
  //   portfoliooptions.push(
  //     { label: "Divine (DSJ)", value: "Divine (DSJ)" },
  //     { label: "Non-Divine (NDSJ)", value: "Non-Divine (NDSJ)" }
  //   );
  // }

  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 on search param change
    setSelectedJewelleryItem([]); // Clear previous items
    FetchListdata("", "", "", "", "", "", 1, isSwitchOn); // Load first page of new search results
  }, [searchParams]);

  // useEffect(() => {
  //   handleSearch();
  // }, [isSwitchOn]);

  // Fetch data when the page number increments
  useEffect(() => {
    if (currentPage > 1) {
      //FetchListdata("", "", "", currentPage);
      FetchListdata(
        searchText,
        selectedcategory,
        selectedSubcategory,
        selectedcollection,
        selectedMetal,
        selectedPortfolio,
        currentPage,
        isSwitchOn
      );
    }
    FetchProductCategory();
  }, [currentPage]);

  useEffect(() => {
    if (selectedJewelleryItem.length > 0) {
      const objDiv = dataContainer.current;
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight; // Scroll to the bottom
      }
    }
  }, [selectedJewelleryItem]);

  const handleClearAll = () => {
    setCurrentPage(1);
    //setDate(""); // Clear the date filter
    setSelectedCategory([]); // Reset selected categories to an empty array
    setSelectedSubCategory([]);
    setSelectedCollection([]);
    setSelectedMetal([]);
    setSelectedPortfolio([]);
    setSearchText(""); // Clear the search text input
    FetchListdata("", "", "", "", "", "", 1, isSwitchOn); // Reload data with no filters
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setLoading(true); // Show spinner
    // console.log("Searching with filters:", {
    //   selectedcategory,
    //   searchText,
    // });

    FetchListdata(
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      1,
      isSwitchOn
    );

    // Simulate search delay
    setTimeout(() => {
      setLoading(false); // Hide spinner once search is done
    });
  };
  //customerOrder?.order_for === "Stock"
  const FetchListdata = async (
    item_number: string,
    product_category: string[] | string,
    product_sub_category: string[] | string,
    product_collection: string[] | string,
    metal_purity: string[] | string,
    portfolio_type: string[] | string,
    pageno: number,
    newlaunch: boolean
  ) => {
    try {
      setIsLoadingMore(true);
      const categoryParam = Array.isArray(product_category)
        ? product_category.join(",") // Convert to string for API
        : product_category;

      const subcategoryParam = Array.isArray(product_sub_category)
        ? product_sub_category.join(",") // Convert to string for API
        : product_sub_category;

      const collectionParam = Array.isArray(product_collection)
        ? product_collection.join(",") // Convert to string for API
        : product_collection;

      const metalpurityParam = Array.isArray(metal_purity)
        ? metal_purity.join(",") // Convert to string for API
        : metal_purity;

      const portfolioTypeParam = Array.isArray(portfolio_type)
        ? portfolio_type.join(",") // Convert to string for API
        : portfolio_type;
      const response = await getJewelleryDetailID(
        item_number,
        categoryParam,
        subcategoryParam,
        collectionParam,
        metalpurityParam,
        portfolioTypeParam,
        //shape,
        pageno,
        newlaunch
      );

      if (newlaunch === false) {
        setTotRecords(response.data.total_found);
        //setNewLaunch(0);
      } else if (newlaunch === true) {
        //setTotRecords(0);
        setNewLaunch(response.data.total_found);
      }

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

  const FetchProductCategory = async () => {
    try {
      setIsLoadingMore(true);
      const response = await ProductFilters();

      const CategotyOptions = response.data.category.map((item: string) => ({
        label: item,
        value: item,
      }));
      setProductCategory(CategotyOptions);
      const SubCategotyOptions = response.data.sub_category.map(
        (item: string) => ({
          label: item,
          value: item,
        })
      );
      setProductSubCategory(SubCategotyOptions);
      const CollectionOptions = response.data.collection.map(
        (item: string) => ({
          label: item,
          value: item,
        })
      );
      setProductCollection(CollectionOptions);
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
    } finally {
      setIsLoadingMore(false); // Ensure reset after fetching
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment page number

    const objDiv = dataContainer.current; //document.getElementById("data-div");
    if (objDiv) {
      //console.log("Height : ",objDiv.scrollHeight);
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  const handlePjDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleBulkImport = () => {
    //setIsBulkImportOpen(true);
    router.push("/jewellery/jewellery-bulk-import");
  };

  const handleImageClick = (design_no: string) => {
    if (
      customerOrder?.cust_name === "" ||
      customerOrder?.cust_name === undefined
    ) {
      setIsCheckoutModalVisible(true);
      return;
    }
    //router.push(`/jewellery/jewellery-detail?id=${design_no}`);
    const queryParams = new URLSearchParams({
      id: design_no,
      ftype: "new",
    }).toString();

    router.push(`/jewellery/jewellery-detail?${queryParams}`);
  };

  const handleStockClick = (design_no: string) => {
    //alert(customerOrder?.cust_name);customerOrder

    if (
      customerOrder?.cust_name === "" ||
      customerOrder?.cust_name === undefined
    ) {
      setIsCheckoutModalVisible(true);
      return;
    }
    router.push(`/jewellery/jewellery-stock?id=${design_no}`);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
    //console.log("Proceeding to checkout with selected items:");
  };

  const handleAll = () => {
    setIsSwitchOn(false); // MUI Switch sends `event` with `checked` value
    console.log("Switch State:", false);
    FetchListdata(
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      1,
      false
    );
  };

  const handleIsNew = () => {
    setIsSwitchOn(true); // MUI Switch sends `event` with `checked` value
    console.log("Switch State:", true);
    FetchListdata(
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      1,
      true
    );
  };

  return (
    <div className="flex max-h-[calc(100vh_-_85px)] overflow-y-auto gap-x-2 m-0.5">
      {/* Left Div with 20% width */}
      <div className="w-full sm:w-1/3 lg:w-1/5 flex flex-col bg-gray-100 text-black my-0.5 ml-0.5">
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
        <div className="flex-1 overflow-auto p-2 space-y-4 max-h-[70vh] sm:max-h-[80vh] lg:max-h-[90vh]">
          {/* Search Input with Spinner */}
          {/* Search Input with Spinner */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by product code"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full p-2 text-black border rounded-md pr-10"
            />
            {/* {loading && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <div className="loader"></div>
              </div>
            )} */}
          </div>

          {/* Category Filter */}
          <CheckboxGroup
            title="Category"
            options={productCategory}
            selectedValues={selectedcategory}
            onChange={setSelectedCategory}
          />

          {/* Category Filter */}
          <CheckboxGroup
            title="Sub Category"
            options={productSubCategory}
            selectedValues={selectedSubcategory}
            onChange={setSelectedSubCategory}
          />

          {/* Collection Filter */}
          <CheckboxGroup
            title="Collection"
            options={productCollection}
            selectedValues={selectedcollection}
            onChange={setSelectedCollection}
          />

          {/* Metal Filter */}
          <CheckboxGroup
            title="Metal"
            options={metaloptions}
            selectedValues={selectedMetal}
            onChange={setSelectedMetal}
          />

          {/* Portfolio Filter */}
          <CheckboxGroup
            title="Portfolio"
            options={portfoliooptions}
            selectedValues={selectedPortfolio}
            onChange={setSelectedPortfolio}
          />
        </div>

        {/* Fixed Footer */}
        {/* <div className="h-16 bg-blue-700 p-4">
          <h1 className="text-xl font-bold">Left Footer</h1>
        </div> */}
      </div>
      {/* Right Div with the remaining width (80%) */}
      <div className="w-4/5 flex flex-col bg-white text-white shadow-md border my-0.5">
        {/* Fixed Header */}
        <div className="flex items-center  bg-white justify-between p-1 sticky top-0">
          <div className="flex items-center space-x-2">
            <button
              className={`px-4 py-1 rounded-md border transition ${
                !isSwitchOn ? "bg-[#A9C5C6] text-black" : "bg-white text-black"
              }`}
              onClick={handleAll}
            >
              All {!isSwitchOn && `(${totRecords})`}
            </button>
            <button
              className={`px-4 py-1 rounded-md border transition ${
                isSwitchOn ? "bg-[#A9C5C6] text-black" : "bg-white text-black"
              }`}
              onClick={handleIsNew}
            >
              New Launch {isSwitchOn && `(${newLaunch})`}
            </button>
          </div>

          <div className="justify-end space-x-2 ">
            <button
              className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
              onClick={handleBulkImport}
            >
              Bulk Order Upload
            </button>
            <button
              className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
              onClick={() => handlePjDetailClick()}
            >
              Pj-Detail
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        {/* <div className="flex-1 overflow-auto p-4 h-[80vh]"></div> */}
        <div
          ref={dataContainer}
          className="flex-1 overflow-y-auto "
          style={{ maxHeight: "calc(100vh - 33px)" }}
        >
          {loading ? (
            // Show spinner while loading
            <div className="flex justify-center items-center h-full">
              <div>
                <Loader />{" "}
              </div>
            </div>
          ) : (
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
                  isnew={item.isnew}
                  onImgClick={() => handleImageClick(item.item_number)}
                  onStkClick={() => handleStockClick(item.item_number)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {/* <div className="h-16 bg-green-700 p-4"></div> */}
        {loading ? (
          <div className="flex justify-center my-1"></div>
        ) : (
          <div className="flex justify-center my-1">
            <button
              onClick={handleLoadMore}
              className={`w-22 px-4 py-1 text-sm tracking-wide rounded-lg text-white bg-black focus:outline-none ${
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
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <PJDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {/* Checkout Confirmation Modal */}
      {isCheckoutModalVisible && (
        <MessageModal
          title="Proceed"
          //onClose={() => setIsCheckoutModalVisible(false)}
          onConfirm={closeCheckoutModal}
        >
          <p>Please select customer for further process.....</p>
        </MessageModal>
      )}
      {/* Bulk Import Modal */}
      {/* <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      /> */}
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
