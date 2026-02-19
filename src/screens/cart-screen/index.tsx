"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCart,
  CreateOrder,
  DeleteCart,
  DownloadExcel,
  EditCart,
  getCartDetailList,
  UpdateCartOrderRemark,
} from "@/api/cart";
import { getUser } from "@/local-storage";
import LoaderContext from "@/context/loader-context";
import { CartDetail } from "@/interface";
import { formatByCurrencyINR } from "@/util/format-inr";
import AddRemarkModal from "@/components/common/add-remark-modal";
import { useCartDetailStore } from "@/store/cartDetailStore";
import LoginContext from "@/context/login-context";
import MessageModal from "@/components/common/message-modal";
import dayjs from "dayjs";

interface cart_to_order_info {
  ids: string;
  product_type: string;
  orderno: number;
}

function CartScreen() {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { isCartCount, setIsCartCount, updateCartCount } =
    useContext(LoginContext);
  const [cartData, setCartData] = useState<CartDetail[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductCode, setCurrentProductCode] = useState<string>(""); // Store product code
  const [currentId, setCurrentId] = useState<number>(0); // Store product code
  const [currentRemark, setCurrentRemark] = useState<string>(""); // Store remark
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Store selected items

  const { setCartDetail, resetCartDetail } = useCartDetailStore();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); //message popup
  const [isCheckoutModalMessageVisible, setIsCheckoutModalMessageVisible] =
    useState(false); //message popup
  const [orderSummaryRemark, setOrderSummaryRemark] = useState<string>(""); //order remark
  const [rtype, setRtype] = useState<string>(""); //remarktype

  const [cartMsg, setCartMsg] = useState<cart_to_order_info[]>([]);

  const [isMsg, setIsMsg] = useState<string>(""); //error message

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProceedingToCheckout, setIsProceedingToCheckout] = useState(false); // To track the order confirmation flow

  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      showLoader();
      try {
        const res = await getCartDetailList(getUser() ?? "");
        //console.log(res.data.data);
        setCartData(res.data.data); // Initialize directly from API
        //setCartCount(res.data.data.length);
        setOrderSummaryRemark(res.data.order_remarks);
        const cartCount = res.data.data.length;
        setIsCartCount(cartCount);
      } catch (error) {
        console.error("Error fetching cart details:", error);
      } finally {
        hideLoader();
      }
    };

    fetchCartData();
  }, [showLoader, hideLoader]);

  // const navigateToShopping = () => {
  //   router.push("/jewellery");
  // };

  const handleRemarkClick = (item: CartDetail, rtype: string) => {
    if (rtype === "cart") {
      setCurrentProductCode(item.product_code); // Store the
      setCurrentId(Number(item.id ?? 0));
      setCurrentRemark(item.cart_remarks || "");
    }
    setRtype(rtype);
    setIsModalVisible(true);
  };

  const handleSaveRemark = async (newRemark: string) => {
    console.log(rtype, "checking");
    console.log(currentProductCode, "currentProductCode");
    console.log(currentId, "currentId");
    if (rtype === "cart") {
      // Update the cart data to reflect the new remark
      const updatedCartData = cartData.map((item) => {
        return item.id === currentId
          ? { ...item, cart_remarks: newRemark }
          : item;
      });

      setCartData(updatedCartData);

      // Find the updated item correctly
      const updatedItem = updatedCartData.find((item) => item.id === currentId);

      if (updatedItem) {
        const payload: CartDetail = { ...updatedItem, cart_remarks: newRemark };
        // Call API to save the remark, assuming createCart is used for this
        showLoader();
        try {
          EditCart(payload); // This would send the updated remark to the server
          setCurrentRemark("");
          setCurrentProductCode("");
          setCurrentId(0);
        } catch (err) {
          console.error("Error saving remark:", err);
        } finally {
          hideLoader();
        }
      }
    } else if (rtype === "order_summary") {
      setOrderSummaryRemark(newRemark);
      try {
        const res = await UpdateCartOrderRemark(getUser() ?? "", newRemark);
        console.log(res.data.message);
        //if(res.data.message === "")
      } catch (error) {
        console.error("Error fetching cart details:", error);
      } finally {
        hideLoader();
      }
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]); // Deselect all
    } else {
      //setSelectedItems(cartData.map((item) => item.id)); // Select all
      setSelectedItems(
        cartData
          .map((item) => item.id)
          .filter((id): id is number => id !== undefined),
      );
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id) // Use a different variable name
        : [...prevSelectedItems, id],
    );
  };

  const handleDeleteItem = async (cartId: number | undefined) => {
    if (cartId === undefined) return; // Early exit for undefined
    showLoader();
    try {
      await DeleteCart(cartId);
      updateCartCount(isCartCount - 1);
      setCartData((prevData) => prevData.filter((item) => item.id !== cartId));
      //setcartData(cartData);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      hideLoader();
    }
  };

  const handleQuantityChange = async (
    cartId: number | undefined,
    increment: boolean,
  ) => {
    if (!cartId) return;

    // Compute the updated item first
    let updatedItem: CartDetail | null = null;

    const updatedCartData = cartData.map((item) => {
      if (item.id === cartId) {
        const newProductQty = Math.max(
          1,
          (item.product_qty || 1) + (increment ? 1 : -1),
        );

        // Calculate unit amounts
        const unitAmtMin = item.product_amt_min / (item.product_qty || 1);
        const unitAmtMax = item.product_amt_max / (item.product_qty || 1);

        // Construct updated item
        updatedItem = {
          ...item,
          product_qty: newProductQty,
          product_amt_min: unitAmtMin * newProductQty,
          product_amt_max: unitAmtMax * newProductQty,
        };

        return updatedItem; // Update this item in the array
      }
      return item;
    });

    // Update the state with the modified cart data
    setCartData(updatedCartData);

    // Log and proceed with the updated item
    if (updatedItem) {
      console.log("Updated item:", updatedItem);

      try {
        showLoader();

        // Send the updated item to the server
        await EditCart(updatedItem);
        console.log("Cart updated successfully");
      } catch (err) {
        console.error("Error updating cart:", err);
      } finally {
        hideLoader();
      }
    } else {
      console.error("Error: Updated item not found");
    }
  };

  //const handleCopyItem = async (item: CartDetail) => {
  const handleCopyItem = async (item: CartDetail) => {
    const exp_dlv_date = item.exp_dlv_date
      ? dayjs(item.exp_dlv_date, "DD-MM-YYYY").isValid()
        ? dayjs(item.exp_dlv_date, "DD-MM-YYYY")
            .add(dayjs().utcOffset(), "minute")
            .toISOString()
        : new Date().toISOString() // fallback to the current date
      : new Date().toISOString();

    console.log("exp_dlv_date:", exp_dlv_date);

    const payload: CartDetail = {
      order_for: item.order_for || "",
      customer_id: item.customer_id || 0,
      customer_code: item?.customer_code || "", //new additation
      customer_name: item.customer_name || "",
      customer_branch: item.customer_branch || "",
      product_type: item.product_type || "",
      order_type: item.order_type || "",
      Product_category: item.Product_category || "",
      product_sub_category: item.product_sub_category || "", //new
      collection: item.collection || "",
      //exp_dlv_date: new Date(item.exp_dlv_date || Date.now()).toISOString(),
      exp_dlv_date: exp_dlv_date,
      old_varient: item.old_varient || "",
      product_code: item.product_code || "",
      solitaire_pcs: item.solitaire_pcs, //new additation
      product_qty: item.product_qty || 1,
      product_amt_min: item.product_amt_min || 0,
      product_amt_max: item.product_amt_max || 0,
      solitaire_shape: item.solitaire_shape || "",
      solitaire_slab: item.solitaire_slab || "",
      solitaire_color: item.solitaire_color || "",
      solitaire_quality: item.solitaire_quality || "",
      solitaire_prem_size: item.solitaire_prem_size || "",
      solitaire_prem_pct: item.solitaire_prem_pct || 0,
      solitaire_amt_min: item.solitaire_amt_min || 0,
      solitaire_amt_max: item.solitaire_amt_max || 0,
      metal_purity: item.metal_purity || "",
      metal_color: item.metal_color || "",
      metal_weight: item.metal_weight || 0,
      //size_from: item.size_from || "",
      size_from: item.size_from != null ? item.size_from : "",
      size_to: item.size_to || "",
      side_stone_pcs: item.side_stone_pcs || 0,
      side_stone_cts: item.side_stone_cts || 0,
      side_stone_color: item.side_stone_pcs > 0 ? item.side_stone_color : "-",
      side_stone_quality: item.side_stone_pcs > 0 ? item.side_stone_quality : "-",
      cart_remarks: item.cart_remarks || "",
      order_remarks: item.order_remarks || "",
      metal_type: item.metal_type || "",
      metal_price: item.metal_price || 0,
      mount_amt_min: item.mount_amt_min || 0,
      mount_amt_max: item.mount_amt_max || 0,
      image_url: item.image_url ?? "",
      style: item.style || "", //new
      wear_style: item.wear_style || "", //new
      look: item.look || "", //new
      portfolio_type: item.portfolio_type || "", //new
      gender: item.gender || "",
      designno: item.designno || "", //new
    };

    try {
      showLoader();
      const res = await createCart([payload]); // Create the cart item
      console.log("Cart created successfully:", res.data.id);
      updateCartCount(isCartCount + 1);
      // if (res.data.id) {
      //   const newCartItem: CartDetail = {
      //     ...payload,
      //     id: res.data.id, // Use the new ID from the response
      //   };
      const newCartItem: CartDetail = { ...payload };
      // Add the new cart item to the state
      setCartData((prevCartData) => [...prevCartData, newCartItem]);
      // } else {
      //   console.error("API did not return a valid ID.");
      // }
      window.location.reload();
    } catch (err) {
      console.error("Error creating cart:", err);
      // Notify the user of the error
    } finally {
      hideLoader();
    }
  };

  const handleEdit = (cartId: number | undefined) => {
    resetCartDetail();
    console.log("cartId : ", cartId);
    if (!cartId) return;

    const updatedItem = cartData.find((item) => item.id === cartId);
    const productCode = updatedItem ? updatedItem.product_code : null;
    if (updatedItem) {
      //setCartDetail(updatedItem); // Ensure updatedItem is valid
      //console.log("Updated item for edit:", updatedItem);
      //console.log("Before setting cart:", useCartDetailStore.getState().cart);
      setCartDetail(updatedItem);
      //console.log("After setting cart:", useCartDetailStore.getState().cart);
    } else {
      console.error("Item not found for the given cartId:", cartId);
    }
    //return;
    const queryParams = new URLSearchParams({
      id: productCode ?? "",
      ftype: "Edit",
    }).toString();

    router.push(`/jewellery/jewellery-detail?${queryParams}`);
  };

  // const handleProceedToCheckout = async () => {
  //   if (selectedItems.length === 0) {
  //     setIsMsg("");
  //     setIsMsg("Please select at least one item to proceed to checkout.");
  //     setIsCheckoutModalVisible(true);
  //     return;
  //   }

  //   // Ensure only 1 partner jeweller (customer_name) is selected
  //   const selectedCartItems = cartData.filter((item) =>
  //     selectedItems.includes(item.id ?? 0)
  //   );

  //   const uniquePartners = new Set(
  //     selectedCartItems.map((item) => item.customer_name)
  //   );

  //   if (uniquePartners.size !== 1) {
  //     setIsMsg("");
  //     setIsMsg(
  //       "You can only select one partner jeweller to proceed with checkout."
  //     );
  //     setIsCheckoutModalVisible(true);
  //     return;
  //   }

  //   try {
  //     showLoader();
  //     const response = await CreateOrder(selectedItems);
  //     console.log("Order successfully created:", response.data);

  //     // Set cartMsg with the cart_to_order_info array from the response
  //     if (response.data && response.data.cart_to_order_info) {
  //       setCartMsg(response.data.cart_to_order_info);
  //     }

  //     if (response.data.msg === "Sucess") {
  //       const decrementCount = selectedItems.length;
  //       updateCartCount(isCartCount - decrementCount);
  //       setIsCheckoutModalMessageVisible(true);
  //     } else {
  //       console.error("Unexpected response:", response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //   } finally {
  //     hideLoader();
  //   }
  // };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      setIsMsg("Please select at least one item to proceed to checkout.");
      setIsCheckoutModalVisible(true);
      return;
    }

    if (!cartData || cartData.length === 0) {
      setIsMsg("Your cart is empty. Please add items to proceed.");
      setIsCheckoutModalVisible(true);
      return;
    }

    const selectedCartItems = cartData.filter((item) =>
      selectedItems.includes(item.id ?? 0),
    );

    const uniquePartners = new Set(
      selectedCartItems.map((item) => item.customer_name),
    );

    if (uniquePartners.size !== 1) {
      setIsMsg(
        "You can only select one partner jeweller to proceed with checkout.",
      );
      setIsCheckoutModalVisible(true);
      return;
    }

    setIsConfirmationModalVisible(true); // Show confirmation modal
  };

  const handlePlaceOrder = async () => {
    setIsProceedingToCheckout(true); // Mark as proceeding with checkout

    try {
      showLoader();
      const response = await CreateOrder(selectedItems);

      if (response.data?.cart_to_order_info) {
        setCartMsg(response.data.cart_to_order_info);
      }

      if (response.data?.success === true) {
        updateCartCount(isCartCount - selectedItems.length);
        setIsCheckoutModalMessageVisible(true);
      } else {
        //setIsMsg("Failed to create order. Please try again.");
        setIsMsg(response.data?.msg);
        setIsCheckoutModalVisible(true);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setIsMsg(
        "An error occurred while processing your request. Please try again.",
      );
      setIsCheckoutModalVisible(true);
    } finally {
      hideLoader();
      setIsConfirmationModalVisible(false); // Close the confirmation modal
      setIsProceedingToCheckout(false); // Reset the state
    }
  };

  const handleGoBackToCart = () => {
    setIsConfirmationModalVisible(false); // Close the confirmation modal
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
    //console.log("Proceeding to checkout with selected items:", selectedItems);
    // Add further checkout logic here
    setIsCheckoutModalMessageVisible(false);
  };

  const closeCheckoutMessageModal = () => {
    setIsCheckoutModalMessageVisible(false);
    router.push(`/`);
  };

  // Calculate totals for selected items
  const calculateSelectedTotals = () => {
    // const selectedCartItems = cartData.filter((item) =>
    //   selectedItems.includes(item.id ?? 0)
    // );

    const selectedCartItems = (cartData ?? []).filter((item) =>
      selectedItems.includes(item.id ?? 0),
    );

    const totalQty = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_qty || 0),
      0,
    );

    const totalAmtMin = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_amt_min || 0),
      0,
    );

    const totalAmtMax = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_amt_max || 0),
      0,
    );

    return { totalQty, totalAmtMin, totalAmtMax };
  };

  // Extract totals for rendering
  const { totalQty, totalAmtMin, totalAmtMax } = calculateSelectedTotals();

  const ExcelDownload = async () => {
    //console.log("Download Excel");
    try {
      showLoader();
      const result = await DownloadExcel();
      const href = window.URL.createObjectURL(new Blob([result.data]));
      //console.log(result);

      //const filename = result.headers['content-disposition']
      //console.log(filename)
      // .split(';')
      // .find((n: string) => n.includes('filename='))
      // .replace('filename=', '')
      // .trim()

      const anchorElement = document.createElement("a");

      anchorElement.href = href;
      anchorElement.download = `Cart_${new Date()}.xlsx`;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);

      hideLoader();
    } catch (error) {
      hideLoader();
      console.log(error);
    }
  };

  const DownloadClick = () => {
    ExcelDownload();
  };

  return (
    // <div className="flex max-h-[calc(100vh_-_90px)] overflow-y-auto gap-x-2 m-2">
    <div className="flex flex-col lg:flex-row gap-3 p-2">
      {/* <div className="w-4/5 flex flex-col  text-gray-800 my-0.5 "> */}
      {/* Fixed Header */}

      <div className="w-full lg:w-4/5 overflow-y-auto max-h-[calc(100vh-140px)]">
        <div className="sticky top-0 z-30 bg-white shadow-md p-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          {/* Buttons: mobile white background only */}
          <div className="order-1 sm:order-2 flex flex-wrap justify-end gap-2 w-full sm:w-auto">
            <button
              className="h-10 px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black w-full sm:w-auto"
              onClick={() => router.push("/jewellery")}
            >
              Continue Shopping
            </button>

            {(cartData ?? []).length > 0 && (
              <>
                <button
                  className="h-10 px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black w-full sm:w-auto"
                  onClick={DownloadClick}
                >
                  Export to Excel
                </button>
                <button
                  onClick={handleSelectAll}
                  className="h-10 px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black w-full sm:w-auto"
                >
                  Select All
                </button>
              </>
            )}
          </div>

          {/* Shopping Bag Title */}
          <h1 className="order-2 sm:order-1 text-base sm:text-xl font-semibold w-full sm:w-auto text-left sm:text-left">
            Shopping Bag {"("} {(cartData ?? []).length} {" items )"}
          </h1>
        </div>
      </div>


        {/* Cart Items Section */}
        {/* <div className="flex-1 overflow-y-auto h-[90vh] px-2 sm:px-4 py-2"> */}
        <div className="flex-1  py-2">
          {(cartData ?? []).length > 0 ? (
            cartData.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row p-3 md:p-4 mb-4 gap-3 bg-white border rounded-md hover:shadow-lg transition-transform duration-300"
              >
                {/* Checkbox + mobile delete */}
                <div className="flex items-center justify-between md:justify-start md:w-auto mb-2 md:mb-0">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id ?? 0)}
                    onChange={() => {
                      const isValidSelection =
                        (item.product_amt_min || 0) +
                          (item.product_amt_max || 0) >
                        0;

                      if (isValidSelection) {
                        handleSelectItem(item.id ?? 0);
                      } else {
                        alert(
                          "Solitaire not selected for some products, please customize products",
                        );
                      }
                    }}
                    className="w-5 h-5"
                  />
                  {/* Mobile delete button */}
                  <button
                    onClick={() => handleDeleteItem(item?.id)}
                    className="md:hidden ml-3 text-red-600 hover:text-red-800 font-semibold"
                  >
                    X
                  </button>
                </div>

                {/* Image Section */}
                <div className="w-full md:w-1/3 overflow-hidden rounded-lg flex md:h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      item.product_type.toLowerCase() === "jewellery"
                        ? (item.image_url ?? "")
                        : item.product_type.toLowerCase() === "solitaire" &&
                            item.solitaire_shape === "Round"
                          ? "/solitaire/image7.png"
                          : item.product_type.toLowerCase() === "solitaire" &&
                              item.solitaire_shape === "Princess"
                            ? "/solitaire/image8.png"
                            : item.solitaire_shape === "Oval"
                              ? "/solitaire/image9.png"
                              : "/solitaire/image_9.png"
                    }
                    alt=""
                    width={200}
                    height={60}
                    onError={(event) => {
                      const imgElement = event.target as HTMLImageElement;
                      if (imgElement) {
                        imgElement.src = "/jewellery/NoImageBig.jpg";
                      }
                    }}
                    className=" object-contain w-full 
                            h-40 sm:h-48          /* mobile/tablet */
                            md:h-full             /* take full column height on md+ */
                            transition-transform duration-300 hover:scale-105
                          "
                  />
                </div>

                {/* Data Section */}
                <div className="w-full md:w-2/3 flex flex-col justify-between gap-1">
                  <div className="flex flex-wrap items-center gap-x-1">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                      Partner Jewellers:
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.order_for === "Retail Customer"
                        ? "Divine Solitaires"
                        : item.customer_name || "-"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Order For: {item.order_for || "-"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Type: {item.order_type || "-"}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600">
                    Store: {item.customer_branch || "-"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Customer:{" "}
                    {item.order_for === "Retail Customer"
                      ? item.customer_name
                      : "-"}
                  </p>

                  {item.product_type === "jewellery" && (
                    <>
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="text-sm font-semibold text-gray-600">
                          {item.product_code}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Old: {item.old_varient}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
                        <p>Collection: {item.collection}</p>
                        <p>Sub Category: {item.product_sub_category}</p>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Diamond:{" "}
                      {`${item.solitaire_slab || "-"} cts ${
                        item.solitaire_shape || "-"
                      } ${item.solitaire_color || "-"} ${
                        item.solitaire_quality || "-"
                      }`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 bg-black text-white text-sm rounded flex items-center justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => handleQuantityChange(item?.id, false)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="flex items-center justify-center text-sm">
                        {item.product_qty || 1}
                      </span>
                      <button
                        className="w-8 h-8 bg-black text-white text-sm rounded flex items-center justify-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={() => handleQuantityChange(item?.id, true)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {item.product_type === "jewellery" && (
                    <>
                      {item.size_from !== "-" && Number(item.size_from) > 3 && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          Size: {item.size_from || "-"}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-600">
                        Metal Color: {item.metal_color || "-"}{" "}
                        {item.metal_purity || "-"}
                      </p>
                      {item.side_stone_cts > 0 && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          Side Diamonds:{" "}
                          {item.side_stone_cts
                            ? `${item.side_stone_cts.toFixed(2)} cts`
                            : "-"}{" "}
                          {item.side_stone_color || "-"}{" "}
                          {item.side_stone_quality || "-"}
                        </p>
                      )}
                      <p className="flex text-xs sm:text-sm text-gray-600">
                        Metal Weight:&nbsp;
                        <span className="font-semibold text-black">
                          {item.metal_weight.toFixed(3) || "-"}
                        </span>
                      </p>
                    </>
                  )}

                  <p className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
                    Amount: Min:&nbsp;
                    <span className="font-semibold text-black">
                      {formatByCurrencyINR(item.product_amt_min)}
                    </span>
                    &nbsp;Max:&nbsp;
                    <span className="font-semibold text-black">
                      {formatByCurrencyINR(item.product_amt_max)}
                    </span>
                  </p>

                  <p className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600">
                    Expected Delivery Date:&nbsp;
                    <span className="font-semibold text-black">
                      {dayjs(item.exp_dlv_date).isValid()
                        ? dayjs(item.exp_dlv_date).format("DD-MM-YYYY")
                        : " "}
                    </span>
                  </p>

                  <div className="flex items-center flex-wrap gap-1">
                    <p
                      className="text-xs sm:text-sm font-bold text-black cursor-pointer underline"
                      onClick={() => handleRemarkClick(item, "cart")}
                    >
                      Add Remark
                    </p>
                    <p className="text-xs sm:text-sm">
                      : {item.cart_remarks || ""}
                    </p>
                  </div>

                  {item.product_type === "jewellery" && (
                    <div className="w-full flex justify-end gap-2 mt-2">
                      <button
                        className="px-3 py-1 sm:px-4 sm:py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black text-xs sm:text-sm"
                        onClick={() => handleCopyItem(item)}
                      >
                        Copy
                      </button>
                      <button
                        className="px-3 py-1 sm:px-4 sm:py-1 bg-black text-white rounded-md border border-black hover:bg:white hover:text:black text-xs sm:text-sm"
                        onClick={() => handleEdit(item?.id)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop delete button */}
                <button
                  onClick={() => handleDeleteItem(item?.id)}
                  className="hidden md:block absolute top-1 right-2 text-red-600 hover:text-red-800"
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg font-medium text-gray-600">
                Your cart is empty. Start adding items to see them here!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      {(cartData ?? []).length > 0 && (
        <div className="p-2 w-full md:w-1/3 lg:w-1/4 border rounded-lg shadow-md bg-white mt-4 md:mt-0">
          <div className="flex flex-col gap-4 px-4 sm:px-6 mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center md:text-left">
              Order Summary
            </h2>

            {/* Total Quantity Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-base sm:text-xl text-gray-600">
                Total Quantity
              </span>
              <div className="text-lg font-semibold text-black">{totalQty}</div>
            </div>

            {/* Total Amount Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-base sm:text-xl text-gray-600">
                Total Amount
              </span>
              <div className="text-lg font-semibold text-black text-right">
                {formatByCurrencyINR(totalAmtMin)} -{" "}
                {formatByCurrencyINR(totalAmtMax)}
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="mt-4 w-full flex items-center justify-center">
              <button
                className="w-full h-12 flex items-center justify-center px-6 py-3 border border-black bg-black text-white rounded-lg hover:bg-white hover:text-black transition duration-300"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Remark Section */}
            <div className="flex flex-col items-start py-2">
              <span
                className="text-lg sm:text-xl text-black underline cursor-pointer"
                onClick={() => handleRemarkClick(cartData[0], "order_summary")}
              >
                Add Remark
              </span>
              <div className="flex items-center mt-2">
                <span className="text-sm font-bold text-black">
                  Remark:&nbsp;
                </span>
                <p className="text-sm text-black cursor-pointer hover:underline">
                  {orderSummaryRemark || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {isConfirmationModalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to place the order?
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  You cannot cancel the order once it is placed and the order
                  will be executed.
                </p>
                <div className="mt-4 flex gap-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                    onClick={handleGoBackToCart}
                  >
                    Go back to Cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Checkout Error Modal */}
          {isCheckoutModalVisible && (
            <MessageModal
              title="Proceed to Checkout"
              onConfirm={closeCheckoutModal}
            >
              <p>{isMsg}</p>
            </MessageModal>
          )}

          {/* Checkout Success Modal */}
          {isCheckoutModalMessageVisible && (
            <MessageModal title="Success" onConfirm={closeCheckoutMessageModal}>
              <p>Your order has been created successfully.</p>
              {Array.isArray(cartMsg) &&
                cartMsg.length > 0 &&
                cartMsg.map((item, index) => (
                  <div key={index}>
                    <p>Product Type: {item.product_type}</p>
                    <p>Order Number: {item.orderno}</p>
                  </div>
                ))}
            </MessageModal>
          )}
        </div>
      )}

      <AddRemarkModal
        isVisible={isModalVisible}
        closeModal={closeModal}
        saveRemark={handleSaveRemark}
        remark={currentRemark}
      />
    </div>
  );
}

export default CartScreen;
