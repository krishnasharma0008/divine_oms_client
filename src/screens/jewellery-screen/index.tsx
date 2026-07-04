"use client";

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JewelleryHomeDiv from "@/components/common/jewellery-home";
import {
  ActiveFilterChips,
  ActiveFilterChip,
  FilterSearchInput,
  JewelleryFilterPanel,
} from "@/components/common/jewellery-filter-panel";
import { useSearchParams, useRouter } from "next/navigation";
import PJDetailModal from "@/components/common/pj-detail-modal";
import { Jewellery } from "@/interface";
import { getJewelleryDetailID } from "@/api/jewellery-detail";
import NotificationContext from "@/context/notification-context";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import MessageModal from "@/components/common/message-modal";
import { ProductFilters } from "@/api/jewellery-filters";
import Loader from "@/components/common/loader";
import { useUserFromToken } from "@/hook/useUserFromToken";
import { getToken } from "@/local-storage";

interface OptionType {
  value: string;
  label: string;
}

function getPriceRange(value: string) {
  if (value === "100,000") {
    return { fromPrice: 0, toPrice: 100000 };
  }

  if (value === "500,000") {
    return { fromPrice: 500000, toPrice: null };
  }

  const match = value.match(/([\d,]+)\s*-\s*([\d,]+)/);
  if (match) {
    const fromPrice = parseInt(match[1].replace(/,/g, ""));
    const toPrice = parseInt(match[2].replace(/,/g, ""));
    return { fromPrice, toPrice };
  }

  return { fromPrice: null, toPrice: null };
}

function JewelleyScreen() {
  const dataContainer = useRef<HTMLDivElement>(null);
  const { customerOrder } = useCustomerOrderStore();
  const [selectedcategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubCategory] = useState<string[]>([]);
  const [selectedcollection, setSelectedCollection] = useState<string[]>([]);
  const [selectedMetal, setSelectedMetal] = useState<string[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedExclusive, setSelectedExclusive] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [selectedJewelleryItem, setSelectedJewelleryItem] = useState<
    Array<Jewellery>
  >([]);
  const [productCategory, setProductCategory] = useState<OptionType[]>([]);
  const [productSubCategory, setProductSubCategory] = useState<OptionType[]>(
    []
  );
  const [productCollection, setProductCollection] = useState<OptionType[]>([]);
  const { notifyErr } = useContext(NotificationContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [isDiscarded, setIsDiscarded] = React.useState(false);
  const [totRecords, setTotRecords] = useState<number>(1);
  const [newLaunch, setNewLaunch] = useState<number>(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = getToken();
  const { user } = useUserFromToken(token);

  const metaloptions = [
    { label: "18KT", value: "18KT" },
    { label: "950PT", value: "950PT" },
  ];

  const portfoliooptions = [
    { label: "Divine (DSJ)", value: "Divine (DSJ)" },
    { label: "Non-Divine (NDSJ)", value: "Non-Divine (NDSJ)" },
  ];

  const Genderoptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const Priceoptions = [
    { label: "Below 100,000", value: "0 - 100,000" },
    { label: "100,000 - 200,000", value: "100,000 - 200,000" },
    { label: "200,000 - 300,000", value: "200,000 - 300,000" },
    { label: "400,000 - 500,000", value: "400,000 - 500,000" },
    { label: "500,000 and above", value: "500,000 -10,00,00,000" },
  ];

  const ExclusiveOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedPrice) count++;
    if (selectedExclusive) count++;
    if (selectedcategory.length) count++;
    if (selectedSubcategory.length) count++;
    if (selectedGender.length) count++;
    if (selectedMetal.length) count++;
    if (selectedcollection.length) count++;
    if (selectedPortfolio.length) count++;
    if (isDiscarded) count++;
    if (searchText.trim()) count++;
    return count;
  }, [
    selectedPrice,
    selectedExclusive,
    selectedcategory,
    selectedSubcategory,
    selectedGender,
    selectedMetal,
    selectedcollection,
    selectedPortfolio,
    isDiscarded,
    searchText,
  ]);

  const FetchListdata = useCallback(
    async (
      item_number: string,
      product_category: string[] | string,
      product_sub_category: string[] | string,
      product_collection: string[] | string,
      metal_purity: string[] | string,
      portfolio_type: string[] | string,
      pageno: number,
      newlaunch: boolean,
      discarded: boolean,
      gender: string[] | string,
      price_from: string,
      price_to: string,
      exclusive: string
    ) => {
      try {
        setIsLoadingMore(true);
        const categoryParam = Array.isArray(product_category)
          ? product_category.join(",")
          : product_category;

        const subcategoryParam = Array.isArray(product_sub_category)
          ? product_sub_category.join(",")
          : product_sub_category;

        const collectionParam = Array.isArray(product_collection)
          ? product_collection.join(",")
          : product_collection;

        const metalpurityParam = Array.isArray(metal_purity)
          ? metal_purity.join(",")
          : metal_purity;

        const portfolioTypeParam = Array.isArray(portfolio_type)
          ? portfolio_type.join(",")
          : portfolio_type;

        const genderParam = Array.isArray(gender) ? gender.join(",") : gender;

        const Order_for = customerOrder?.order_for ?? "";

        const response = await getJewelleryDetailID(
          item_number,
          categoryParam,
          subcategoryParam,
          collectionParam,
          metalpurityParam,
          portfolioTypeParam,
          pageno,
          newlaunch,
          discarded,
          genderParam,
          price_from,
          price_to,
          Order_for,
          exclusive
        );

        if (newlaunch === false) {
          setTotRecords(response.data.total_found);
        } else if (newlaunch === true) {
          setNewLaunch(response.data.total_found);
        }

        const newItems = response.data.data ?? [];
        if (pageno === 1) {
          setSelectedJewelleryItem(newItems);
        } else {
          setSelectedJewelleryItem((prevItems) => [...prevItems, ...newItems]);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        notifyErr("An error occurred while fetching data.");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [customerOrder?.order_for, notifyErr]
  );

  const FetchProductCategory = useCallback(async () => {
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
      setIsLoadingMore(false);
    }
  }, [notifyErr]);

  const runSearch = useCallback(
    (page = 1, switchState = isSwitchOn, discardedState = isDiscarded) => {
      const { fromPrice, toPrice } = getPriceRange(selectedPrice);
      return FetchListdata(
        searchText,
        selectedcategory,
        selectedSubcategory,
        selectedcollection,
        selectedMetal,
        selectedPortfolio,
        page,
        switchState,
        discardedState,
        selectedGender,
        fromPrice?.toString() || "",
        toPrice?.toString() || "",
        selectedExclusive
      );
    },
    [
      FetchListdata,
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      selectedGender,
      selectedPrice,
      selectedExclusive,
      isSwitchOn,
      isDiscarded,
    ]
  );

  useEffect(() => {
    const initialLoad = async () => {
      setCurrentPage(1);
      setSelectedJewelleryItem([]);
      await FetchListdata(
        "",
        "",
        "",
        "",
        "",
        "",
        1,
        isSwitchOn,
        isDiscarded,
        "",
        "",
        "",
        ""
      );
      await FetchProductCategory();
    };

    initialLoad();
  }, [
    searchParams,
    FetchListdata,
    FetchProductCategory,
    isSwitchOn,
    isDiscarded,
  ]);

  useEffect(() => {
    if (currentPage > 1) {
      runSearch(currentPage);
    }
  }, [currentPage, runSearch]);

  useEffect(() => {
    if (selectedJewelleryItem.length > 0) {
      const objDiv = dataContainer.current;
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    }
  }, [selectedJewelleryItem]);

  const handleClearAll = () => {
    setCurrentPage(1);
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setSelectedCollection([]);
    setSelectedMetal([]);
    setSelectedPortfolio([]);
    setSearchText("");
    setIsDiscarded(false);
    setSelectedGender([]);
    setSelectedPrice("");
    setSelectedExclusive("");
    FetchListdata("", "", "", "", "", "", 1, isSwitchOn, false, "", "", "", "");
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setLoading(true);
    setIsFilterOpen(false);
    await runSearch(1);
    setLoading(false);
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    const objDiv = dataContainer.current;
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  const handlePjDetailClick = () => {
    setIsModalOpen(true);
  };

  const handleBulkImport = () => {
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
    const queryParams = new URLSearchParams({
      id: design_no,
      ftype: "new",
    }).toString();

    router.push(`/jewellery/jewellery-detail?${queryParams}`);
  };

  const handleStockClick = (design_no: string) => {
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
  };

  const handleAll = async () => {
    setIsSwitchOn(false);
    setCurrentPage(1);
    setLoading(true);
    const { fromPrice, toPrice } = getPriceRange(selectedPrice);
    await FetchListdata(
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      1,
      false,
      isDiscarded,
      selectedGender,
      fromPrice?.toString() || "",
      toPrice?.toString() || "",
      selectedExclusive
    );
    setLoading(false);
  };

  const handleIsNew = async () => {
    setIsSwitchOn(true);
    setCurrentPage(1);
    setLoading(true);
    const { fromPrice, toPrice } = getPriceRange(selectedPrice);
    await FetchListdata(
      searchText,
      selectedcategory,
      selectedSubcategory,
      selectedcollection,
      selectedMetal,
      selectedPortfolio,
      1,
      true,
      isDiscarded,
      selectedGender,
      fromPrice?.toString() || "",
      toPrice?.toString() || "",
      selectedExclusive
    );
    setLoading(false);
  };

  const resultCount = isSwitchOn ? newLaunch : totRecords;

  const filterPanelProps = {
    priceOptions: Priceoptions,
    exclusiveOptions: ExclusiveOptions,
    genderOptions: Genderoptions,
    metalOptions: metaloptions,
    portfolioOptions: portfoliooptions,
    productCategory,
    productSubCategory,
    productCollection,
    showDiscarded: user?.designation === "Admin",
    selectedPrice,
    selectedExclusive,
    selectedCategory: selectedcategory,
    selectedSubcategory: selectedSubcategory,
    selectedGender,
    selectedMetal,
    selectedCollection: selectedcollection,
    selectedPortfolio,
    isDiscarded,
    onPriceChange: setSelectedPrice,
    onExclusiveChange: setSelectedExclusive,
    onCategoryChange: setSelectedCategory,
    onSubcategoryChange: setSelectedSubCategory,
    onGenderChange: setSelectedGender,
    onMetalChange: setSelectedMetal,
    onCollectionChange: setSelectedCollection,
    onPortfolioChange: setSelectedPortfolio,
    onDiscardedChange: setIsDiscarded,
  };

  const activeFilterChips = useMemo((): ActiveFilterChip[] => {
    const chips: ActiveFilterChip[] = [];

    if (searchText.trim()) {
      chips.push({
        id: "search",
        label: `Code: ${searchText.trim()}`,
        onRemove: () => setSearchText(""),
      });
    }

    if (selectedPrice) {
      const priceLabel =
        Priceoptions.find((o) => o.value === selectedPrice)?.label ??
        selectedPrice;
      chips.push({
        id: "price",
        label: priceLabel,
        onRemove: () => setSelectedPrice(""),
      });
    }

    selectedcategory.forEach((value) => {
      chips.push({
        id: `category-${value}`,
        label: value,
        onRemove: () =>
          setSelectedCategory((prev) => prev.filter((v) => v !== value)),
      });
    });

    selectedSubcategory.forEach((value) => {
      chips.push({
        id: `subcategory-${value}`,
        label: value,
        onRemove: () =>
          setSelectedSubCategory((prev) => prev.filter((v) => v !== value)),
      });
    });

    selectedGender.forEach((value) => {
      chips.push({
        id: `gender-${value}`,
        label: value,
        onRemove: () =>
          setSelectedGender((prev) => prev.filter((v) => v !== value)),
      });
    });

    selectedMetal.forEach((value) => {
      chips.push({
        id: `metal-${value}`,
        label: value,
        onRemove: () =>
          setSelectedMetal((prev) => prev.filter((v) => v !== value)),
      });
    });

    selectedcollection.forEach((value) => {
      chips.push({
        id: `collection-${value}`,
        label: value,
        onRemove: () =>
          setSelectedCollection((prev) => prev.filter((v) => v !== value)),
      });
    });

    selectedPortfolio.forEach((value) => {
      chips.push({
        id: `portfolio-${value}`,
        label: value,
        onRemove: () =>
          setSelectedPortfolio((prev) => prev.filter((v) => v !== value)),
      });
    });

    if (selectedExclusive) {
      chips.push({
        id: "exclusive",
        label: `Exclusive: ${selectedExclusive}`,
        onRemove: () => setSelectedExclusive(""),
      });
    }

    if (isDiscarded) {
      chips.push({
        id: "discarded",
        label: "Discarded",
        onRemove: () => setIsDiscarded(false),
      });
    }

    return chips;
  }, [
    searchText,
    selectedPrice,
    selectedcategory,
    selectedSubcategory,
    selectedGender,
    selectedMetal,
    selectedcollection,
    selectedPortfolio,
    selectedExclusive,
    isDiscarded,
  ]);

  return (
    <div className="flex min-h-[calc(100vh-85px)] flex-col bg-gray-50 lg:flex-row">
      {/* Desktop filter sidebar */}
      <aside className="hidden shrink-0 flex-col border-r border-gray-200 bg-white lg:flex lg:w-[300px] xl:w-[320px]">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterSearchInput
            value={searchText}
            onChange={setSearchText}
            onSubmit={handleSearch}
            className="mt-3"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          <JewelleryFilterPanel {...filterPanelProps} />
        </div>

        <div className="border-t border-gray-100 bg-white p-4">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Show {resultCount} result{resultCount === 1 ? "" : "s"}
          </button>
        </div>
      </aside>

      {/* Mobile filter drawer — slide-in from right */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <p className="text-xs text-gray-500">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} selected`
                    : "Refine your search"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="border-b border-gray-100 px-4 py-3">
              <FilterSearchInput
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
                placeholder="Search product code"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
              <JewelleryFilterPanel {...filterPanelProps} />
            </div>

            <div className="flex gap-3 border-t border-gray-100 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 rounded-lg border border-gray-300 py-3.5 text-sm font-semibold text-gray-700"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="flex-[1.5] rounded-lg bg-gray-900 py-3.5 text-sm font-semibold text-white"
              >
                Show {resultCount} result{resultCount === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-3">
            {/* Mobile search + filter trigger */}
            <div className="flex gap-2 lg:hidden">
              <FilterSearchInput
                value={searchText}
                onChange={setSearchText}
                onSubmit={handleSearch}
                placeholder="Search product code"
                className="min-w-0 flex-1"
              />
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="relative flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-800 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-600"
                  aria-hidden
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-900 px-1 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {activeFilterChips.length > 0 && (
              <ActiveFilterChips
                chips={activeFilterChips}
                onClearAll={handleClearAll}
              />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                      !isSwitchOn
                        ? "bg-[#A9C5C6] text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={handleAll}
                  >
                    All {!isSwitchOn && `(${totRecords})`}
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                      isSwitchOn
                        ? "bg-[#A9C5C6] text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={handleIsNew}
                  >
                    New Launch {isSwitchOn && `(${newLaunch})`}
                  </button>
                </div>

                <p className="text-xs text-gray-500 sm:text-sm">
                  {resultCount} product{resultCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-900 bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800 sm:flex-none sm:px-4 sm:text-sm"
                  onClick={handleBulkImport}
                >
                  Bulk Upload
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-800 transition hover:bg-gray-50 sm:flex-none sm:px-4 sm:text-sm"
                  onClick={handlePjDetailClick}
                >
                  Pj-Detail
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div
          ref={dataContainer}
          className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 lg:px-6"
        >
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader />
            </div>
          ) : selectedJewelleryItem.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center">
              <p className="text-base font-medium text-gray-900">
                No jewellery found
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Try adjusting your filters or search for a different product
                code.
              </p>
              <button
                type="button"
                onClick={handleClearAll}
                className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {selectedJewelleryItem.map((item, index) => (
                <JewelleryHomeDiv
                  key={`${item.item_number}-${index}`}
                  olddesign_no={item.old_varient}
                  design_no={item.item_number}
                  g_wt={item.weight}
                  d_size={item.solitaire_slab}
                  imgurl={item.image_url}
                  isnew={item.isnew}
                  isExclusive={item.is_exclusive}
                  onImgClick={() => handleImageClick(item.item_number)}
                  onStkClick={() => handleStockClick(item.item_number)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load more */}
        {!loading && selectedJewelleryItem.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <button
              type="button"
              onClick={handleLoadMore}
              className="mx-auto flex min-h-[44px] min-w-[140px] items-center justify-center rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoadingMore}
              aria-busy={isLoadingMore}
            >
              {isLoadingMore ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Load more"
              )}
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <PJDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCheckoutModalVisible && (
        <MessageModal title="Proceed" onConfirm={closeCheckoutModal}>
          <p>Please select customer for further process.....</p>
        </MessageModal>
      )}
    </div>
  );
}

export default JewelleyScreen;
