"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCart,
  CreateOrderRemark,
  DeleteCart,
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

function JewelleryCartScreen() {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { isCartCount, updateCartCount } = useContext(LoginContext);
  const [cartData, setCartData] = useState<CartDetail[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductCode, setCurrentProductCode] = useState<string>(""); // Store product code
  const [currentRemark, setCurrentRemark] = useState<string>(""); // Store remark
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Store selected items

  const { setCartDetail, resetCartDetail } = useCartDetailStore();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); //message popup
  const [orderSummaryRemark, setOrderSummaryRemark] = useState<string>(""); //order remark
  const [rtype, setRtype] = useState<string>(""); //remarktype

  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      showLoader();
      try {
        const res = await getCartDetailList(getUser() ?? "");
        setCartData(res.data.data); // Initialize directly from API
        setOrderSummaryRemark(res.data.order_remarks);
      } catch (error) {
        console.error("Error fetching cart details:", error);
      } finally {
        hideLoader();
      }
    };

    fetchCartData();
  }, [showLoader, hideLoader]);

  const navigateToShopping = () => {
    router.push("/jewellery");
  };

  const handleRemarkClick = (item: CartDetail, rtype: string) => {
    if (rtype === "cart") {
      setCurrentProductCode(item.product_code || ""); // Store the product_code
      setCurrentRemark(item.cart_remarks || "");
    }
    setRtype(rtype);
    setIsModalVisible(true);
  };

  const handleSaveRemark = async (newRemark: string) => {
    console.log(rtype);
    if (rtype === "cart") {
      // Update the cart data to reflect the new remark
      const updatedCartData = cartData.map((item) =>
        item.product_code === currentProductCode
          ? { ...item, cart_remarks: newRemark } // Update the remark for the item
          : item
      );

      setCartData(updatedCartData); // Set the new cart data with updated remarks
      //setcartData(updatedCartData); // Optionally, send the updated remark to the server
      const updatedItem = updatedCartData.find(
        (item) => item.product_code === currentProductCode
      );

      if (updatedItem) {
        const payload: CartDetail = { ...updatedItem, cart_remarks: newRemark };
        // Call API to save the remark, assuming createCart is used for this
        showLoader();
        try {
          createCart(payload); // This would send the updated remark to the server
          setCurrentRemark("");
          setCurrentProductCode("");
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
          .filter((id): id is number => id !== undefined)
      );
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((id) => id !== id)
        : [...prevSelectedItems, id]
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

  // Ensure this function is marked 'async'
  const handleQuantityChange = async (
    cartId: number | undefined,
    increment: boolean
  ) => {
    // Function implementation
    if (!cartId) return;

    // Update the local state with the new quantity
    setCartData((prevCartData) => {
      const updatedData = prevCartData.map((item) =>
        item.id === cartId
          ? {
              ...item,
              product_qty: Math.max(
                1,
                (item.product_qty || 1) + (increment ? 1 : -1)
              ),
            }
          : item
      );
      //setcartData(updatedData);
      const updatedItem = updatedData.find((item) => item.id === cartId);

      if (updatedItem) {
        const payload: CartDetail = {
          ...updatedItem,
          product_qty: updatedItem.product_qty,
        };
        try {
          showLoader();
          createCart(payload); // 'await' works here because 'handleQuantityChange' is 'async'
          console.log("Cart Updated successfully");
        } catch (err) {
          console.log("Error updating cart", err);
        } finally {
          hideLoader();
        }
      }

      return updatedData;
    });
  };

  //const handleCopyItem = async (item: CartDetail) => {
  const handleCopyItem = async (item: CartDetail) => {
    const payload: CartDetail = {
      order_for: item.order_for || "", // Default to empty string if undefined
      customer_id: item.customer_id || 0, // Default to 0 if undefined
      customer_name: item.customer_name || "",
      customer_branch: item.customer_branch || "", // Default to empty string if undefined
      product_type: item.product_type || "", // Default to empty string if undefined
      Product_category: item.Product_category || "", // new
      consignment_type: item.consignment_type || "", // Default to empty string if undefined
      sale_or_return: item.sale_or_return || "", // Default to empty string if undefined
      outright_purchase: item.outright_purchase || false, // Default to false if undefined
      customer_order: item.customer_order || "", // Default to empty string if undefined
      exp_dlv_date: item.exp_dlv_date || null, // Default to null if undefined
      product_code: item.product_code || "", // Default to empty string if undefined
      product_qty: item.product_qty || 1, // Use the updated quantity
      product_amt_min: item.product_amt_min || 0, // Default to 0 if undefined
      product_amt_max: item.product_amt_max || 0, // Default to 0 if undefined
      solitaire_shape: item.solitaire_shape || "", // Default to empty string if undefined
      solitaire_slab: item.solitaire_slab || "", // Default to empty string if undefined
      solitaire_color: item.solitaire_color || "", // Default to empty string if undefined
      solitaire_quality: item.solitaire_quality || "", // Default to empty string if undefined
      solitaire_prem_size: item.solitaire_prem_size || "", // Default to empty string if undefined
      solitaire_prem_pct: item.solitaire_prem_pct || 0, // Default to 0 if undefined
      solitaire_amt_min: item.solitaire_amt_min || 0, // Default to 0 if undefined
      solitaire_amt_max: item.solitaire_amt_max || 0, // Default to 0 if undefined
      metal_purity: item.metal_purity || "", // Default to empty string if undefined
      metal_color: item.metal_color || "", // Default to empty string if undefined
      metal_weight: item.metal_weight || 0, // Default to 0 if undefined
      size_from: item.size_from || "", // Default to empty string if undefined
      size_to: item.size_to || "", // Default to empty string if undefined
      side_stone_pcs: item.side_stone_pcs || 0, // Default to 0 if undefined
      side_stone_cts: item.side_stone_cts || 0, // Default to 0 if undefined
      side_stone_color: item.side_stone_color || "IJ", // Default to "IJ" if undefined
      side_stone_quality: item.side_stone_quality || "SI", // Default to "SI" if undefined
      cart_remarks: item.cart_remarks || "", // Default to empty string if undefined
      order_remarks: item.order_remarks || "",
      metal_type: item.metal_purity || "",
      metal_price: item.metal_price || 0,
      mount_amt_min: item.mount_amt_max || 0,
      mount_amt_max: item.mount_amt_min || 0,
    };

    try {
      showLoader();
      const res = await createCart(payload); // Await the response
      console.log("Cart created successfully", res.data.id);
      const newCartItem = {
        ...payload,
        id: res.data.id,
      };

      // Add the new cart item to the existing cart data
      setCartData([...cartData, newCartItem]);
    } catch (err) {
      console.log("Error updating cart", err);
    } finally {
      hideLoader();
    }
  };

  const handleEdit = (cartId: number | undefined) => {
    resetCartDetail();
    console.log("cartId : ", cartId);
    if (!cartId) return;

    const updatedItem = cartData.find((item) => item.id === cartId);

    if (updatedItem) {
      setCartDetail(updatedItem); // Ensure updatedItem is valid
    } else {
      console.error("Item not found for the given cartId:", cartId);
    }
    router.push(`/jewellery-detail`);
  };

  const handleProceedToCheckout = async () => {
    if (selectedItems.length === 0) {
      setIsCheckoutModalVisible(true); // Show the modal if no items are selected
      //console.log(selectedItems.join(","));
      return;
    }
    //console.log(selectedItems);
    try {
      showLoader(); // Ensure the loader is displayed during the API call
      const response = await CreateOrderRemark(selectedItems);
      //console.log("Order successfully created:", response.data.msg);
      if (response.data.msg === "Sucess") {
        selectedItems.forEach(() => {
          updateCartCount(isCartCount - 1); // Decrement for each item
        });
        //window.location.reload(); // Refresh the page upon success
        router.push(`/`);
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error creating order remark:", error);
    } finally {
      hideLoader(); // Ensure the loader is hidden, even in case of errors
    }
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
    //console.log("Proceeding to checkout with selected items:", selectedItems);
    // Add further checkout logic here
  };

  // Calculate totals for selected items
  const calculateSelectedTotals = () => {
    // const selectedCartItems = cartData.filter((item) =>
    //   selectedItems.includes(item.id ?? 0)
    // );

    const selectedCartItems = (cartData ?? []).filter((item) =>
      selectedItems.includes(item.id ?? 0)
    );

    const totalQty = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_qty || 0),
      0
    );

    const totalAmtMin = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_amt_min || 0),
      0
    );

    const totalAmtMax = selectedCartItems.reduce(
      (acc, item) => acc + (item.product_amt_max || 0),
      0
    );

    return { totalQty, totalAmtMin, totalAmtMax };
  };

  // Extract totals for rendering
  const { totalQty, totalAmtMin, totalAmtMax } = calculateSelectedTotals();

  return (
    <div className="flex max-h-[calc(100vh_-_90px)] overflow-y-auto gap-x-2 m-2">
      <div className="w-4/5 flex flex-col  text-gray-800 my-0.5 ">
        {/* Fixed Header */}
        <div className="flex px-2 sticky top-0">
          {/* Shopping Bag Section */}
          <div className="w-1/2 flex items-center text-black p-2 rounded-lg">
            <div className="text-2xl font-medium">
              Shopping Bag {"("} {(cartData ?? []).length} {" items )"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-1/2 flex justify-end space-x-2">
            <button className="h-10 px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black">
              Export to Excel
            </button>
            <button
              onClick={handleSelectAll}
              className="h-10 px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
            >
              Select All
            </button>
          </div>
        </div>
        {/* Cart Items Section */}
        <div className="flex-1 overflow-y-auto h-[90vh] px-4 py-2">
          {(cartData ?? []).length > 0 ? (
            cartData.map((item, index) => (
              <div
                key={index}
                className="relative flex p-4 mb-4 gap-x-4 bg-white border rounded-md hover:shadow-lg transition-transform duration-300"
              >
                {/* Checkbox for Selecting Item */}
                <div className="w-1/12 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id ?? 0)}
                    onChange={() => handleSelectItem(item.id ?? 0)}
                    className="w-5 h-5"
                  />
                </div>
                {/* Image Section */}
                <div className="w-1/3 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url ?? ""}
                    alt=""
                    width={200}
                    height={60}
                    onError={(event) => {
                      const imgElement = event.target as HTMLImageElement;
                      if (imgElement) {
                        imgElement.src = "/jewellery/NoImageBig.jpg";
                      }
                    }}
                    className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-110"
                  />
                </div>
                {/* Data Section */}
                <div className="w-2/3 flex flex-col justify-between">
                  <div className="flex items-center justify-left">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Partner Jewellers :&nbsp;
                    </h2>
                    <p className="text-sm text-gray-600">
                      {item.customer_name || "-"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Store : {item.customer_branch || "-"}
                  </p>
                  <p className="text-xl font-semibold text-gray-600">
                    {item.product_code}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Diamond :{" "}
                      {`${item.solitaire_slab || "-"}ct ${
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
                  <p className="text-sm text-gray-600">
                    Metal Color :{" "}
                    {`${item.metal_color || "-"} ${item.metal_purity || "-"}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Side Diamonds :{" "}
                    {item.side_stone_cts
                      ? `${item.side_stone_cts.toFixed(2)}cts`
                      : "-"}{" "}
                    {item.side_stone_color ? `${item.side_stone_color}` : "-"}{" "}
                    {item.side_stone_quality
                      ? `${item.side_stone_quality}`
                      : "-"}
                  </p>
                  <p className="flex text-sm text-gray-600">
                    Gross Weight :&nbsp;
                    <p className="font-semibold text-black">
                      {item.metal_weight || "-"}
                    </p>
                  </p>
                  <p className="flex text-sm text-gray-600">
                    Amount : Min :&nbsp;
                    <p className="font-semibold text-black">
                      {formatByCurrencyINR(
                        parseFloat(item.product_amt_min.toString())
                      )}
                    </p>{" "}
                    &nbsp;Max :&nbsp;
                    <p className="font-semibold text-black">
                      {formatByCurrencyINR(
                        parseFloat(item.product_amt_max.toString())
                      )}
                    </p>{" "}
                  </p>
                  {/* Clickable Remark */}
                  <div className="flex items-center justify-left">
                    <p
                      className="flex text-sm font-bold text-black cursor-pointer underline cursor-pointer"
                      onClick={() => handleRemarkClick(item, "cart")}
                    >
                      Add Remark
                    </p>
                    <p className="text-sm no-underline">
                      &nbsp;:&nbsp;{item.cart_remarks || ""}
                    </p>
                  </div>
                  <div className="w-full justify-end ml-2 flex space-x-2">
                    {/* Copy Button */}
                    <button
                      className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
                      onClick={() => handleCopyItem(item)}
                    >
                      Copy
                    </button>

                    {/* Edit Button */}
                    <button
                      className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
                      onClick={() => handleEdit(item?.id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {/* Delete Item Button */}
                <button
                  //onClick={() => handleDeleteItem(item.product_code)}
                  onClick={() => handleDeleteItem(item?.id)}
                  className="absolute top-0 right-2 text-red-600 hover:text-red-800 z-10"
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

        <div className="flex justify-center mt-1">
          <button
            className="w-auto h-10 flex items-center px-6 py-2 bg-black text-white rounded-lg transition duration-300 transform hover:bg-gray-800"
            onClick={navigateToShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="p-2 w-full border rounded-lg shadow-md bg-white sm:w-1/2 relative mt-4 sm:mt-0">
        {(cartData ?? []).length > 0 && (
          <div className="flex flex-col gap-2 px-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Order Summary
            </h2>

            {/* Total Quantity Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">Total Quantity</span>
              <div className="text-lg font-semibold text-black">{totalQty}</div>
            </div>

            {/* Total Amount Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">Total Amount</span>
              <div className="text-lg font-semibold text-black">
                {formatByCurrencyINR(totalAmtMin)} -{" "}
                {formatByCurrencyINR(totalAmtMax)}
              </div>
            </div>

            {/* Delivery Dates */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">
                Required Delivery Date
              </span>
              <div className="text-lg font-semibold text-black">{""}</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">
                Expected Delivery Date
              </span>
              <div className="text-lg font-semibold text-black">{""}</div>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="mt-6 w-full flex items-center justify-center ">
              <button
                className="w-full h-10 flex items-center justify-center px-6 py-3 border border-black bg-black text-white rounded-lg hover:bg-white hover:text-black transition duration-300"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Remark Section */}
            <div className="flex justify-center items-center py-2">
              <span
                className="text-xl text-black underline cursor-pointer"
                onClick={() => handleRemarkClick(cartData[0], "order_summary")}
                //onClick={() => setIsModalVisible(true)}
              >
                Add Remark
              </span>
            </div>
            <div className="flex justify-left items-center py-2">
              <span className="text-sm font-bold text-black">
                Remark :-&nbsp;
              </span>
              <p className="text-sm text-black cursor-pointer hover:underline">
                {orderSummaryRemark || ""}
              </p>
            </div>

            {/* Checkout Confirmation Modal */}
            {isCheckoutModalVisible && (
              <MessageModal
                title="Proceed to Checkout"
                //onClose={() => setIsCheckoutModalVisible(false)}
                onConfirm={closeCheckoutModal}
              >
                <p>Please select at least one item to proceed to checkout.</p>
              </MessageModal>
            )}
          </div>
        )}
      </div>

      <AddRemarkModal
        isVisible={isModalVisible}
        closeModal={closeModal}
        saveRemark={handleSaveRemark}
        remark={currentRemark}
      />
    </div>
  );
}

export default JewelleryCartScreen;
