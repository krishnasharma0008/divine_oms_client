"use client";

import React, { useContext, useEffect, useState } from "react";
import { getOrderDetail } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetail } from "@/interface/order-detail";
import { formatByCurrencyINR } from "@/util/format-inr";
import { getToken } from "@/local-storage";
import dayjs from "dayjs";

function OrderDetailSolitaireScreen() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderDetail[]>([]);
  const [orderRemarks, setOrderRemarks] = useState<string | null>(null);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(Number(id));
    }
  }, [id]);

  const fetchOrderDetails = async (orderno: number) => {
    try {
      showLoader();
      const response = await getOrderDetail(orderno, getToken() ?? "");
      const { data, order_remarks } = response.data;
      setOrderData(data ?? []);
      setOrderRemarks(order_remarks);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      hideLoader();
    }
  };

  // Calculate totals
  const totalPcs = orderData.reduce((sum, row) => sum + row.product_qty, 0);
  const totalRangeMin = orderData.reduce(
    (sum, row) => sum + row.product_amt_min,
    0
  );
  const totalRangeMax = orderData.reduce(
    (sum, row) => sum + row.product_amt_max,
    0
  );

  const handleBackButtonClick = () => {
    router.push("/order");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 m-4">
      {/* Main Content Section */}
      <div className="w-full md:w-2/3 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Order Details</h1>

        <div className="w-full flex flex-wrap justify-between">
          <div className="mb-4">
            <p className="text-lg text-gray-600 font-semibold italic">
              Order ID:{" "}
              <span className="text-black font-bold not-italic">{id}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg text-gray-600 font-semibold italic">
              Order Item:{" "}
              <span className="text-black font-bold not-italic">
                {totalPcs}
              </span>
            </p>
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleBackButtonClick}
              className="bg-black text-white py-2 px-4 rounded-md shadow-md hover:text-black hover:bg-white focus:outline-none"
            >
              Back
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <div className="overflow-y-auto max-h-[400px] border border-gray-300">
            <table className="min-w-full bg-white border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10 border-b border-gray-200">
                <tr>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    #
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Shape
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Size
                  </th>
                  <th
                    colSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Color
                  </th>
                  <th
                    colSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Clarity
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Premium Size
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Premium %
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Pcs
                  </th>
                  <th
                    colSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Price Range
                  </th>
                  <th
                    rowSpan={2}
                    className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200"
                  >
                    Remarks
                  </th>
                </tr>
                <tr>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    From
                  </th>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    To
                  </th>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    From
                  </th>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    To
                  </th>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    Min
                  </th>
                  <th className="text-sm font-semibold text-gray-600 py-0.5 px-0.5 text-center border border-gray-200">
                    Max
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 border-b border-gray-200"
                  >
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {rowIndex + 1}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_shape}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_slab}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_color.split("-")[0]}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_color.split("-")[1]}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_quality.split("-")[0]}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_quality.split("-")[1]}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_prem_size}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.solitaire_prem_pct}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.product_qty}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {formatByCurrencyINR(row.product_amt_min)}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {formatByCurrencyINR(row.product_amt_max)}
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      {row.cart_remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 border-t border-gray-200">
                  <td
                    colSpan={9}
                    className="text-lg font-semibold text-gray-600 py-0.5 px-0.5 text-right"
                  >
                    Total:
                  </td>
                  <td className="text-lg font-semibold text-gray-800 py-0.5 px-0.5 text-center border border-gray-200">
                    {totalPcs}
                  </td>
                  <td className="text-lg font-semibold text-gray-800 py-0.5 px-0.5 text-center border border-gray-200">
                    ₹{totalRangeMin.toLocaleString()}
                  </td>
                  <td className="text-lg font-semibold text-gray-800 py-0.5 px-0.5 text-center border border-gray-200">
                    ₹{totalRangeMax.toLocaleString()}
                  </td>
                  <td className="border border-gray-200"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          {/* Date of Order orderData?.order_date */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Date of Order</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.order_createdat
                ? dayjs(orderData[0]?.order_createdat).format("DD MMM, YYYY")
                : ""}
            </span>
          </div>

          {/* Customer Name */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Customer Name</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.customer_name || "--"}
            </span>
          </div>

          {/* Store Name */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Store Name</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.customer_branch || "--"}
            </span>
          </div>

          {/* Order Type */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Type</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.order_type || "--"}
            </span>
          </div>

          {/* Order For */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order For</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.order_for || "--"}
            </span>
          </div>

          {/* Delivery Date */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Delivery Date</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.exp_dlv_date
                ? dayjs(orderData[0]?.exp_dlv_date).format("DD MMM, YYYY")
                : ""}
            </span>
          </div>

          {/* Placed By */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Placed By</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderData[0]?.username || "--"}
            </span>
          </div>

          {/* RBH */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">RBH</span>
            <span className="text-lg font-semibold text-gray-800">--</span>
          </div>

          {/* ZBH */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ZBH</span>
            <span className="text-lg font-semibold text-gray-800">--</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Quantity</span>
            <div className="text-lg font-semibold text-gray-800">
              {totalPcs}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Total Amount
            </span>
            <div className="text-lg font-semibold text-gray-800 whitespace-nowrap">
              ₹{totalRangeMin.toLocaleString()} - ₹
              {totalRangeMax.toLocaleString()}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Expected Delivery Date
            </span>
            <div className="text-lg font-semibold text-gray-800">{"--"}</div>
          </div>
          <div className="flex justify-between items-center py-2 border-t mt-4">
            <span className="text-xl text-gray-600">Remarks</span>
            <div className="text-lg font-semibold text-gray-800">
              {orderRemarks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailSolitaireScreen;
