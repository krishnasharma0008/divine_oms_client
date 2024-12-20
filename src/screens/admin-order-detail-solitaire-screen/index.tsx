"use client";

import React, { useContext, useEffect, useState } from "react";
import { getOrderDetail, updateOrderStatus } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetail } from "@/interface/order-detail";
import { formatByCurrencyINR } from "@/util/format-inr";
import { getAdminToken } from "@/local-storage";

function AdminOrderDetailSolitaireScreen() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderDetail[]>([]);
  const [orderRemarks, setOrderRemarks] = useState<string | null>(null);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [orderStatus, setOrderStatus] = useState<string>("");

  const status = ["WIP", "Delivered to SD", "Cancelled", "Open"];

  useEffect(() => {
    if (id) {
      fetchOrderDetails(Number(id));
    }
  }, [id]);

  const fetchOrderDetails = async (orderno: number) => {
    try {
      showLoader();
      const response = await getOrderDetail(orderno, getAdminToken() ?? "");
      const { data, order_remarks } = response.data;
      setOrderData(data ?? []);
      setOrderRemarks(order_remarks);
      console.log(data[0]?.order_status);
      setOrderStatus(data[0]?.order_status);
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
    router.push("/admin/order");
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    //console.log("Status cannot be empty ", newStatus);
    setOrderStatus(newStatus);

    showLoader();
    try {
      await updateOrderStatus(Number(id), newStatus, getAdminToken() ?? "");

      if (id) {
        fetchOrderDetails(Number(id));
      }
      //setcartData(cartData);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="space-y-4 m-4">
      {/* Main Content Section */}
      <div className="w-full bg-white p-4 rounded-lg shadow-lg border border-gray-300">
        {/* <h1 className="text-3xl font-bold text-gray-700 mb-4">Order Details</h1> */}

        <div className="w-full flex flex-wrap justify-between mb-4">
          {/* <div className="mb-4">
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
          </div> */}
          <div className="w-1/2 flex flex-row">
            <label className="text-sm font-medium text-gray-700 mt-2">
              Status :&nbsp;
            </label>
            <select
              value={orderStatus}
              onChange={handleStatusChange}
              className="bg-white border border-gray-300 rounded-md p-2"
            >
              {status.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* <div className="flex justify-end mb-4"> */}
          <button
            onClick={handleBackButtonClick}
            className="bg-black text-white py-2 px-4 rounded-md shadow-md hover:text-black hover:bg-white focus:outline-none"
          >
            Back
          </button>
          {/* </div> */}
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
                      5.50
                    </td>
                    <td className="text-sm text-gray-700 py-0.5 px-0.5 text-center border border-gray-200">
                      10%
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
                      -
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 border-t border-gray-200">
                  <td className="text-lg font-semibold text-gray-600 py-0.5 px-0.5 text-right">
                    Order Remark :-
                  </td>
                  <td
                    colSpan={7}
                    className="text-lg font-semibold text-gray-600 py-0.5 px-0.5 text-right"
                  >
                    {orderRemarks}
                  </td>
                  <td className="text-lg font-semibold text-gray-600 py-0.5 px-0.5 text-right">
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
      <div className="max-w-lg bg-white p-6 rounded-lg shadow-md mx-auto">
        {/* <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
          Order Summary
        </h2> */}
        <div className="table w-full">
          {[
            ["Status", orderData[0]?.order_status || "--"],
            ["Partner Jeweller", orderData[0]?.customer_name || "--"],
            ["Store", orderData[0]?.customer_branch || "--"],
            ["Dispatch Details", "--"],
          ].map(([label, value], idx) => (
            <div
              key={idx}
              className={`table-row ${
                idx % 2 === 0 ? "bg-[rgb(243,244,246)]" : "bg-white"
              }`}
            >
              <div className="table-cell p-2 border text-sm text-gray-600">
                {label}
              </div>
              <div className="table-cell p-2 border text-gray-700">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailSolitaireScreen;
