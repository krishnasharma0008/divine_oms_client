"use client";

import React, { useContext, useEffect, useState } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { getOrderDetail } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetail } from "@/interface/order-detail";
import { formatByCurrencyINR } from "@/util/format-inr";
import { getToken } from "@/local-storage";
import dayjs from "dayjs";

function OrderDetailJewelleryScreen() {
  //const { id } = useParams<{ id: string }>();
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

  const handleBackButtonClick = () => {
    router.push("/order");
  };

  // Define columns for DataTable
  const columns: TableColumn<OrderDetail>[] = [
    {
      name: "#",
      cell: (row: OrderDetail, index: number) => index + 1,
      width: "50px",
      center: true,
    },
    // {
    //   name: "Order No",
    //   selector: (row: OrderDetail) => row.orderno,
    //   width: "130px",
    // },
    {
      name: "Product",
      selector: (row: OrderDetail) => row.product_code,
      center: true,
    },
    {
      name: "Old Product",
      selector: (row: OrderDetail) => row.old_varient,
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
      selector: (row: OrderDetail) => {
        const ringSize = Number(row.size_from); // Ensure it's a number
        return isNaN(ringSize) ? "--" : ringSize; // Check for NaN and display fallback
      },
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
    // {
    //   name: "Metal Price",
    //   selector: (row: OrderDetail) => formatByCurrencyINR(row.metal_price ?? 0),
    //   center: true,
    // },
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
      selector: (row: OrderDetail) => row.cart_remarks || " ",
      center: true,
      width: "300px",
      wrap: true,
      format: (row) => `${row.cart_remarks.slice(0, 200)}`,
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

  // const getOrderType = (OrderType: string) => {
  //   let otype = "";
  //   if (OrderType === "TCS") {
  //     otype = "Consignment TCS";
  //   } else if (OrderType === "RRO / Exhibition") {
  //     otype = "Consignment RRO / Exhibition";
  //   } else if (OrderType === "SOR") {
  //     otype = "Sales or Return";
  //   } else if (OrderType === "OP") {
  //     otype = "Outright Purchase";
  //   } else if (OrderType === "RCO") {
  //     otype = "Customer Order RCO";
  //   } else if (OrderType === "SCO") {
  //     otype = "Customer Order SCO";
  //   }
  //   return otype;
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
      {/* Main Content Section */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
        {/* <h1 className="text-3xl font-bold text-gray-700 mb-4">Order Details</h1> */}

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
      <div className="bg-white p-4 rounded-lg shadow-md">
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
            <span className="text-lg font-semibold text-gray-800">
              {totalQty}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-lg font-semibold text-gray-800">
              {formatByCurrencyINR(totalAmountMin)} -{" "}
              {formatByCurrencyINR(totalAmountMax)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remarks</span>
            <span className="text-lg font-semibold text-gray-800">
              {orderRemarks || "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailJewelleryScreen;
