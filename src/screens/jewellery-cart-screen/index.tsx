"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCart, DeleteCart, getCartDetailList } from "@/api/cart";
import { getUser } from "@/local-storage";
import LoaderContext from "@/context/loader-context";
import { CartDetail } from "@/interface";
//import Image from "next/image";
import { formatByCurrencyINR } from "@/util/format-inr";
import AddRemarkModal from "@/components/common/add-remark-modal";
import { useCartDetailStore } from "@/store/cartDetailStore";
import LoginContext from "@/context/login-context";
//import { useCart } from "@/context/cart-context";

function JewelleryCartScreen() {
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { isCartCount, updateCartCount } = useContext(LoginContext);
  //const { setcartData } = useCart();
  const [cartData, setCartData] = useState<CartDetail[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductCode, setCurrentProductCode] = useState<string>(""); // Store product code
  const [currentRemark, setCurrentRemark] = useState<string>(""); // Store remark
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Store selected items

  const { setCartDetail, resetCartDetail } = useCartDetailStore();

  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      showLoader();
      try {
        const res = await getCartDetailList(getUser() ?? "");
        setCartData(res.data.data); // Initialize directly from API
        //updateCartCount(isCartCount + 1);
        //setcartData(cartData);
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

  const handleRemarkClick = (item: CartDetail) => {
    setCurrentProductCode(item.product_code || ""); // Store the product_code
    setCurrentRemark(item.cart_remarks || "");
    setIsModalVisible(true);
  };

  const handleSaveRemark = (newRemark: string) => {
    // Update the cart data to reflect the new remark
    const updatedCartData = cartData.map((item) =>
      item.product_code === currentProductCode
        ? { ...item, cart_remarks: newRemark } // Update the remark for the item
        : item
    );

    setCartData(updatedCartData); // Set the new cart data with updated remarks
    //setcartData(updatedCartData);
    // Optionally, send the updated remark to the server
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
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]); // Deselect all
    } else {
      setSelectedItems(cartData.map((item) => item.product_code)); // Select all
    }
  };

  const handleSelectItem = (productCode: string) => {
    if (selectedItems.includes(productCode)) {
      setSelectedItems(selectedItems.filter((item) => item !== productCode));
    } else {
      setSelectedItems([...selectedItems, productCode]);
    }
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

  return (
    <div className="flex max-h-[calc(100vh_-_90px)] overflow-y-auto gap-x-2 m-2">
      <div className="w-4/5 flex flex-col  text-gray-800 my-0.5 ">
        {/* Fixed Header */}
        <div className="flex p-2 sticky top-0">
          {/* Shopping Bag Section */}
          <div className="w-1/2 flex items-center text-black p-2 rounded-lg">
            <div className="text-2xl font-medium">
              Shopping Bag {"("} {cartData.length}
              {" items )"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-1/2 flex justify-end space-x-2">
            <button className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black">
              Export to Excel
            </button>
            <button
              onClick={handleSelectAll}
              className="px-4 py-1 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black"
            >
              Select All
            </button>
          </div>
        </div>
        {/* Cart Items Section */}
        <div className="flex-1 overflow-y-auto h-[90vh] px-4 py-2">
          {cartData.length > 0 ? (
            cartData.map((item, index) => (
              <div
                key={index}
                className="relative flex p-4 mb-4 gap-x-4 bg-white border rounded-md hover:shadow-lg transition-transform duration-300"
              >
                {/* Checkbox for Selecting Item */}
                <div className="w-1/12 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.product_code)}
                    onChange={() => handleSelectItem(item.product_code)}
                    className="w-5 h-5"
                  />
                </div>
                {/* Image Section */}
                <div className="w-1/3 overflow-hidden rounded-lg">
                  {/* <Image
                    src={item.image_url ?? ""}
                    alt="Jewellery"
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover transition-all duration-300 transform hover:scale-105"
                  /> */}
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    Partner Jewellers :{item.customer_name || "-"}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Store: {item.customer_branch || "-"}
                  </p>
                  <p className="text-xl font-semibold text-gray-600">
                    {item.product_code}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Diamond:{" "}
                      {`${item.solitaire_slab || "-"}ct ${
                        item.solitaire_shape || "-"
                      } ${item.solitaire_color || "-"} ${
                        item.solitaire_quality || "-"
                      }`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 bg-black text-white rounded hover:bg-gray-700"
                        onClick={() => handleQuantityChange(item?.id, false)}
                      >
                        -
                      </button>
                      <span className="px-2">{item.product_qty || 1}</span>
                      <button
                        className="px-2 py-1 bg-black text-white rounded hover:bg-gray-700"
                        onClick={() => handleQuantityChange(item?.id, true)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Metal Color:{" "}
                    {`${item.metal_color || "-"} ${item.metal_purity || "-"}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    Side Diamonds:{" "}
                    {item.side_stone_cts
                      ? `${item.side_stone_cts.toFixed(2)}cts`
                      : "-"}{" "}
                    {item.side_stone_color ? `${item.side_stone_color}` : "-"}{" "}
                    {item.side_stone_quality
                      ? `${item.side_stone_quality}`
                      : "-"}
                  </p>
                  <p className="flex text-sm text-gray-600">
                    Gross Weight:{" "}
                    <p className="font-semibold text-black">
                      {item.metal_weight || "-"}
                    </p>
                  </p>
                  <p className="flex text-sm text-gray-600">
                    Amount: Min:{" "}
                    <p className="font-semibold text-black">
                      {formatByCurrencyINR(
                        parseFloat(item.product_amt_min.toString())
                      )}
                    </p>{" "}
                    &nbsp;Max:{" "}
                    <p className="font-semibold text-black">
                      {formatByCurrencyINR(
                        parseFloat(item.product_amt_max.toString())
                      )}
                    </p>{" "}
                  </p>
                  {/* Clickable Remark */}
                  <p
                    className="flex text-sm font-bold text-black cursor-pointer underline"
                    onClick={() => handleRemarkClick(item)}
                  >
                    Add Remark:
                    <p className="text-sm no-underline">
                      {item.cart_remarks || "-"}
                    </p>
                  </p>
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
            className="w-auto flex items-center px-6 py-2 bg-black text-white rounded-lg transition duration-300 transform hover:bg-gray-800"
            onClick={navigateToShopping}
          >
            <span className="text-lg font-semibold">Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="p-2 w-full border rounded-lg shadow-md bg-white sm:w-1/2 relative mt-4 sm:mt-0">
        {/* <Card
          className="w-auto p-5"
          style={{ borderTop: "1px solid rgb(0 0 0 / 0.1)" }}
        > */}
        {cartData.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Order Summary
            </h2>

            {/* Total Quantity Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">Total Quantity</span>
              <div className="text-lg font-semibold text-black">
                {cartData.length}
              </div>
            </div>

            {/* Total Amount Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">Total Amount</span>
              <div className="text-lg font-semibold text-black">
                {formatByCurrencyINR(
                  cartData.reduce(
                    (acc, item) => acc + (item.product_amt_min || 0),
                    0
                  )
                )}
                {" - "}
                {formatByCurrencyINR(
                  cartData.reduce(
                    (acc, item) => acc + (item.product_amt_max || 0),
                    0
                  )
                )}
              </div>
            </div>

            {/* Delivery Dates */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">
                Required Delivery Date
              </span>
              <div className="text-lg font-semibold text-black">TBD</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">
                Expected Delivery Date
              </span>
              <div className="text-lg font-semibold text-black">TBD</div>
            </div>

            {/* Remark Section */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xl text-gray-600">Remark</span>
              <p
                className="text-sm text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsModalVisible(true)}
              >
                {cartData[0]?.cart_remarks || " - "}
              </p>
            </div>

            {/* Proceed to Checkout Button */}
            <div className="mt-6 w-full flex items-center justify-center ">
              <button
                className="w-auto flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black transition duration-300"
                onClick={() => router.push("/checkout")}
              >
                <span className="text-lg font-semibold">
                  Proceed to Checkout
                </span>
              </button>
            </div>
          </div>
        )}
        {/* </Card> */}
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
