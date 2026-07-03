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
import { groupCartByPartner } from "@/util/cart-partner";
import AddRemarkModal from "@/components/common/add-remark-modal";
import CartLineItem from "@/components/common/cart-line-item";
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

  const handleSelectPartnerGroup = (items: CartDetail[]) => {
    const selectableIds = items
      .filter(
        (item) =>
          (item.product_amt_min || 0) + (item.product_amt_max || 0) > 0,
      )
      .map((item) => item.id)
      .filter((id): id is number => id !== undefined);

    if (selectableIds.length === 0) return;

    const allSelected = selectableIds.every((id) =>
      selectedItems.includes(id),
    );

    setSelectedItems((prev) =>
      allSelected
        ? prev.filter((id) => !selectableIds.includes(id))
        : [...new Set([...prev, ...selectableIds])],
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
  const partnerGroups = groupCartByPartner(cartData ?? []);
  const partnerCount = partnerGroups.length;

  const renderCartLineItem = (item: CartDetail, index: number) => (
    <CartLineItem
      key={item.id ?? `${item.product_code}-${index}`}
      item={item}
      selected={selectedItems.includes(item.id ?? 0)}
      onSelect={() => {
        const isValidSelection =
          (item.product_amt_min || 0) + (item.product_amt_max || 0) > 0;
        if (isValidSelection) {
          handleSelectItem(item.id ?? 0);
        } else {
          alert(
            "Solitaire not selected for some products, please customize products",
          );
        }
      }}
      onDelete={() => handleDeleteItem(item?.id)}
      onQuantityChange={(increment) =>
        handleQuantityChange(item?.id, increment)
      }
      onRemarkClick={() => handleRemarkClick(item, "cart")}
      onCopy={
        item.product_type === "jewellery"
          ? () => handleCopyItem(item)
          : undefined
      }
      onEdit={
        item.product_type === "jewellery"
          ? () => handleEdit(item?.id)
          : undefined
      }
    />
  );

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
    <div className="min-h-[calc(100vh-85px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Shopping bag
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {(cartData ?? []).length} item
              {(cartData ?? []).length === 1 ? "" : "s"}
              {partnerCount > 1 && (
                <>
                  {" "}
                  · {partnerCount} partners
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
              onClick={() => router.push("/jewellery")}
            >
              Continue shopping
            </button>
            {(cartData ?? []).length > 0 && (
              <>
                <button
                  type="button"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  onClick={DownloadClick}
                >
                  Export Excel
                </button>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  {selectedItems.length === (cartData ?? []).length
                    ? "Deselect all"
                    : "Select all"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
          {/* Cart items grouped by partner */}
          <div className="space-y-5 pb-32 lg:pb-0">
            {(cartData ?? []).length > 0 ? (
              partnerGroups.map(({ partner, items }) => {
                const groupIds = items
                  .map((item) => item.id)
                  .filter((id): id is number => id !== undefined);
                const selectedInGroup = groupIds.filter((id) =>
                  selectedItems.includes(id),
                ).length;
                const allGroupSelected =
                  groupIds.length > 0 &&
                  selectedInGroup === groupIds.length;

                return (
                  <section
                    key={partner}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-3 sm:px-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                          {partner}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {items.length} item{items.length === 1 ? "" : "s"}
                          {selectedInGroup > 0 &&
                            ` · ${selectedInGroup} selected`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPartnerGroup(items)}
                        className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 sm:text-sm"
                      >
                        {allGroupSelected ? "Deselect" : "Select all"}
                      </button>
                    </div>
                    <div className="space-y-2 p-2 sm:p-3">
                      {items.map((item, index) =>
                        renderCartLineItem(item, index),
                      )}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <p className="text-lg font-medium text-gray-900">
                  Your bag is empty
                </p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Browse jewellery and add items to your cart to place an order.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/jewellery")}
                  className="mt-6 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Browse jewellery
                </button>
              </div>
            )}
          </div>

          {/* Order summary — desktop sidebar */}
          {(cartData ?? []).length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order summary
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedItems.length} of {(cartData ?? []).length} selected
                </p>

                <dl className="mt-6 space-y-4 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Total quantity</dt>
                    <dd className="font-semibold text-gray-900">{totalQty}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Total amount</dt>
                    <dd className="text-right font-semibold text-gray-900">
                      {formatByCurrencyINR(totalAmtMin)} –{" "}
                      {formatByCurrencyINR(totalAmtMax)}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-gray-900 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                  onClick={handleProceedToCheckout}
                  disabled={selectedItems.length === 0}
                >
                  Proceed to checkout
                </button>

                <button
                  type="button"
                  className="mt-4 w-full text-left text-sm font-medium text-gray-700 underline-offset-2 hover:underline"
                  onClick={() =>
                    handleRemarkClick(cartData[0], "order_summary")
                  }
                >
                  {orderSummaryRemark ? "Edit order remark" : "Add order remark"}
                </button>
                {orderSummaryRemark && (
                  <p className="mt-2 text-xs text-gray-500">{orderSummaryRemark}</p>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      {(cartData ?? []).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">{totalQty} items selected</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatByCurrencyINR(totalAmtMin)} –{" "}
                {formatByCurrencyINR(totalAmtMax)}
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              onClick={handleProceedToCheckout}
              disabled={selectedItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {isConfirmationModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Place this order?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You cannot cancel the order once it is placed and the order will
              be executed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleGoBackToCart}
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutModalVisible && (
        <MessageModal title="Proceed to Checkout" onConfirm={closeCheckoutModal}>
          <p>{isMsg}</p>
        </MessageModal>
      )}

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
