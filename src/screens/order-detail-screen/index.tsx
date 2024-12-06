"use client";

import React, { useContext, useEffect, useState } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { getOrderDetail } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import { useParams, useRouter } from "next/navigation";
import { OrderDetail } from "@/interface/order-detail";
import { formatByCurrencyINR } from "@/util/format-inr";

function OrderDetailScreen() {
  const { id } = useParams<{ id: string }>();
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
      const response = await getOrderDetail(orderno);
      const { data, order_remarks } = response.data;
      setOrderData(data ?? []);
      setOrderRemarks(order_remarks);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      hideLoader();
    }
  };

  const handleBackButtonClick = () => {
    router.push("/order-list");
  };

  // Define columns for DataTable
  const columns: TableColumn<OrderDetail>[] = [
    {
      name: "#",
      cell: (row: OrderDetail, index: number) => index + 1,
      width: "50px",
      center: true,
    },
    {
      name: "Product",
      selector: (row: OrderDetail) => row.product_code,
      center: true,
    },
    {
      name: "Shape",
      selector: (row: OrderDetail) => row.solitaire_shape,
      center: true,
    },
    {
      name: "Size",
      selector: (row: OrderDetail) => row.solitaire_slab,
      center: true,
    },
    {
      name: "Color",
      selector: (row: OrderDetail) => row.solitaire_color,
    },
    {
      name: "Clarity",
      selector: (row: OrderDetail) => row.solitaire_quality,
      width: "150px",
      center: true,
    },
    {
      name: "Metal Wt",
      selector: (row: OrderDetail) => row.metal_weight.toFixed(2),
      center: true,
    },
    {
      name: "Metal Color",
      selector: (row: OrderDetail) => row.metal_color,
      center: true,
    },
    {
      name: "Metal Type",
      selector: (row: OrderDetail) => `${row.metal_purity} ${row.metal_type}`,
      width: "250px",
      center: true,
    },
    {
      name: "Category",
      selector: (row: OrderDetail) => row.product_category,
      width: "150px",
      center: true,
    },
    {
      name: "Ring Size",
      selector: (row: OrderDetail) => `${row.size_from} - ${row.size_to}`,
      center: true,
    },
    {
      name: "Side Diamond",
      selector: (row: OrderDetail) =>
        `${row.side_stone_color} - ${row.side_stone_quality}`,
      width: "110px",
      center: true,
    },
    {
      name: "Side Carat",
      selector: (row: OrderDetail) =>
        `${row.side_stone_pcs} / ${row.side_stone_cts}`,
      center: true,
    },
    {
      name: "Metal Price",
      selector: (row: OrderDetail) => formatByCurrencyINR(row.metal_price ?? 0),
      center: true,
    },
    {
      name: "Qty",
      selector: (row: OrderDetail) => row.product_qty,
      width: "70px",
      center: true,
    },
    {
      name: "Amount",
      selector: (row: OrderDetail) =>
        `${formatByCurrencyINR(
          row.product_amt_min ?? 0
        )} - ${formatByCurrencyINR(row.product_amt_max ?? 0)}`,
      width: "200px",
      center: true,
    },
    {
      name: "Remarks",
      selector: (row: OrderDetail) => row.order_remarks || " ",
      center: true,
    },
  ];

  // Calculate totals
  const totalQty = orderData.reduce(
    (total, order) => total + order.product_qty,
    0
  );
  const totalAmountMin = orderData.reduce(
    (total, order) => total + order.product_amt_min,
    0
  );
  const totalAmountMax = orderData.reduce(
    (total, order) => total + order.product_amt_max,
    0
  );

  // Define table custom styles
  const CustomStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "rgb(243 244 246)",
        color: "rgb(55 65 81)",
        minHeight: "30px", // Reduce the header height
        paddingTop: "2px", // Adjust padding
        paddingBottom: "2px",
        border: "1px",
      },
    },
    rows: {
      style: {
        minHeight: "30px", // override the row height
        whiteSpace: "nowrap", // Prevent text wrapping, content stays on a single line
        overflow: "hidden", // Hide overflow text if it's too long
        textOverflow: "ellipsis", // Add ellipsis for overflow text
      },
    },
    cells: {
      style: {
        //padding: "0px",
        fontSize: "0.875rem",
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        paddingTop: "2px", // Adjust padding
        paddingBottom: "2px",
        justifyItems: "center",
      },
    },
  };
  return (
    <div
      className={`flex ${
        orderData.length > 0 && orderData[0]?.product_type === "jewelley"
          ? "flex-col"
          : "md:flex-row"
      } gap-x-4 m-4`}
    >
      {/* Main Content Section */}
      <div
        className={`  ${
          orderData.length > 0 && orderData[0]?.product_type === "jewelley"
            ? "w-full"
            : "md:w-3/4"
        }
         bg-white p-4 rounded-lg shadow-lg`}
      >
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Order Details</h1>

        <div className="w-full flex justify-between">
          <div className="w-full">
            <p className="flex text-lg text-gray-600 font-semibold italic">
              Order ID:
              <p className="text-lg text-black italic font-bold mb-4"> {id}</p>
            </p>
          </div>
          <div className="w-full">
            <p className="flex text-lg text-gray-600 font-semibold italic">
              Order Item:
              <p className="text-lg text-black italic font-bold mb-4">
                {" "}
                {totalQty}
              </p>
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
          <DataTable
            columns={columns}
            data={orderData}
            responsive
            customStyles={CustomStyles}
            fixedHeader
            fixedHeaderScrollHeight="50vh"
            highlightOnHover
            striped
          />

          {/* Custom Footer Row */}
          <div
            style={{
              marginTop: "10px",
              paddingTop: "10px",
              borderTop: "2px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                fontWeight: "bold",
              }}
            >
              <div style={{ marginRight: "20px" }}>
                <span>Total :</span>
              </div>
              <div style={{ width: "150px", textAlign: "center" }}>
                <span>{totalQty}</span>
              </div>
              <div style={{ width: "300px", textAlign: "center" }}>
                <span>{`${formatByCurrencyINR(
                  totalAmountMin
                )} - ${formatByCurrencyINR(totalAmountMax)}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div
        className={`w-full  bg-white p-4 rounded-lg shadow-md ${
          orderData.length > 0 && orderData[0]?.product_type === "jewelley"
            ? "md:w-2/5 mt-4"
            : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Quantity</span>
            <div className="text-lg font-semibold text-gray-800">
              {totalQty}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <div className="text-lg font-semibold text-gray-800">
              {formatByCurrencyINR(totalAmountMin)} -{" "}
              {formatByCurrencyINR(totalAmountMax)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Required Delivery Date
            </span>
            <div className="text-lg font-semibold text-gray-800">{" -- "}</div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Expected Delivery Date
            </span>
            <div className="text-lg font-semibold text-gray-800">{" -- "}</div>
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

export default OrderDetailScreen;
