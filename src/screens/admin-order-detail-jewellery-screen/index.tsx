"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { getOrderDetail } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderDetail } from "@/interface/order-detail";
import { formatByCurrencyINR } from "@/util/format-inr";
import { getAdminToken } from "@/local-storage";

function AdminOrderDetailJewelleryScreen() {
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
      const response = await getOrderDetail(orderno, getAdminToken() ?? "");
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
    router.push("/admin/order");
  };

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

  const totalQty = useMemo(() => {
    return orderData.reduce((total, order) => total + order.product_qty, 0);
  }, [orderData]);

  const totalAmountMin = useMemo(() => {
    return orderData.reduce((total, order) => total + order.product_amt_min, 0);
  }, [orderData]);

  const totalAmountMax = useMemo(() => {
    return orderData.reduce((total, order) => total + order.product_amt_max, 0);
  }, [orderData]);

  const CustomStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "rgb(243 244 246)",
        color: "rgb(55 65 81)",
        minHeight: "30px",
      },
    },
    rows: {
      style: {
        minHeight: "30px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    cells: {
      style: {
        fontSize: "0.875rem",
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        paddingTop: "2px",
        paddingBottom: "2px",
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
      {/* Main Content Section */}
      <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
        {/* <h1 className="text-3xl font-bold text-gray-700 mb-4">
          Admin Order Details
        </h1> */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-gray-600">
            Order ID: <span className="text-black font-bold">{id}</span>
          </p>
          <button
            onClick={handleBackButtonClick}
            className="bg-black text-white py-2 px-4 rounded-md shadow-md hover:bg-white hover:text-black border"
          >
            Back
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-md">
          {orderData.length > 0 ? (
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
          ) : (
            <p className="text-gray-500 text-center py-4">
              No order details found.
            </p>
          )}
          <div className="mt-4 border-t pt-4 flex justify-end font-bold">
            <div className="mr-4">Total:</div>
            <div className="w-24 text-center">{totalQty}</div>
            <div className="w-48 text-center">
              {`${formatByCurrencyINR(totalAmountMin)} - ${formatByCurrencyINR(
                totalAmountMax
              )}`}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Quantity</span>
            <span className="text-lg font-semibold text-gray-800">
              {totalQty}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-lg font-semibold text-gray-800">
              {`${formatByCurrencyINR(totalAmountMin)} - ${formatByCurrencyINR(
                totalAmountMax
              )}`}
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

export default AdminOrderDetailJewelleryScreen;
