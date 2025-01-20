"use client";

import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
//import { useRouter } from "next/navigation";
import { OrderList } from "@/interface/order-list";
import { getToken, getUser } from "@/local-storage";
import { getOrderList } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import Link from "next/link";
//import NotificationContext from "@/context/notification-context";

function OrderListScreen() {
  //const router = useRouter();

  const [excelData, setExcelData] = React.useState<OrderList[]>([]);
  const { showLoader, hideLoader } = useContext(LoaderContext);
  //const { notify, notifyErr } = useContext(NotificationContext);

  useEffect(() => {
    getlistdata();
  }, []);

  const getlistdata = async () => {
    try {
      showLoader();
      const result = await getOrderList(getUser() ?? "", 1, getToken() ?? "");
      const data = result.data.data ?? [];
      if (Array.isArray(data)) {
        setExcelData(data);
      } else {
        console.log("Error: Data is not an array");
      }
      hideLoader();
    } catch (error) {
      hideLoader();
      console.log(error);
      // Optionally notify the user about the error here
      // notifyErr("Failed to fetch orders");
    }
  };

  const columns: TableColumn<OrderList>[] = [
    {
      name: " # ",
      cell: (row: OrderList, index: number) => index + 1,
      reorder: true,
      center: true,
      width: "50px",
    },
    {
      name: "Order No.",
      selector: (row: OrderList) => row.orderno || "",
      width: "130px",
    },
    {
      name: "Order Date",
      selector: (row: OrderList) =>
        row.order_createdat !== null
          ? dayjs(row.order_createdat).format("DD MMM,YYYY")
          : "",
      sortable: true,
      reorder: true,
      Alignment: "center",
      width: "130px",
    },
    {
      name: "Name",
      selector: (row: OrderList) => row.customer_name,
      sortable: true,
      reorder: true,
      Alignment: "center",
    },
    {
      name: "Stores Name",
      selector: (row: OrderList) => row.customer_branch || "",
      sortable: true,
      reorder: true,
      Alignment: "center",
      width: "200px",
    },
    {
      name: "Item Type",
      selector: (row: OrderList) => row.product_type || "",
      sortable: true,
      reorder: true,
      Alignment: "center",
      width: "120px",
    },
    {
      name: "Order For",
      selector: (row: OrderList) => row.order_for,
      sortable: true,
      reorder: true,
      Alignment: "center",
      width: "140px",
    },
    {
      name: "Expected Date",
      selector: (row: OrderList) =>
        row.exp_dlv_date !== null
          ? dayjs(row.exp_dlv_date).format("DD MMM,YYYY")
          : "",
      sortable: true,
      reorder: true,
      Alignment: "center",
      width: "140px",
    },
    {
      name: "",
      cell: (row: OrderList) => (
        <Link
          href={`/order/order-detail-${row.product_type}?id=${row.orderno}`}
          //target="_blank"
          rel="noopener noreferrer"
        >
          <button className="w-full bg-black text-white py-2 px-4 shadow-md hover:text-black hover:bg-white focus:outline-none">
            View
          </button>
        </Link>
        // <p
        //   className="underline cursor-pointer text-black"
        //   onClick={() => {
        //     // console.log("Product Type:", row.product_type);
        //     // console.log("Order Number:", row.orderno);
        //     // router.push(
        //     //   `/order/order-detail-${row.product_type}?id=${row.orderno}`
        //     // );
        //   }}
        // >
        //   {row.orderno}
        // </p>
      ),
      center: true,
      width: "150px",
    },
  ].map((col) => ({ ...col, name: col.name?.toUpperCase() }));

  // Define table custom styles
  const CustomStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "#000000",
        color: "white",
        minHeight: "30px", // Reduce the header height
        paddingTop: "2px", // Adjust padding
        paddingBottom: "2px",
      },
    },
    rows: {
      style: {
        minHeight: "30px", // override the row height
      },
    },
    cells: {
      style: {
        fontSize: "0.875rem",
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        paddingTop: "2px",
        paddingBottom: "2px",
        justifyItems: "center",
      },
    },
  };

  return (
    <div className="px-2">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-2 mt-2">
        {/* Header */}
        <div className="flex justify-between items-center my-2 rounded-lg">
          <h1 className="text-2xl font-bold">Order List</h1>
        </div>

        {/* Data Table */}
        <div className="overflow-auto border">
          <DataTable
            columns={columns}
            data={excelData}
            customStyles={CustomStyles}
            fixedHeader
            fixedHeaderScrollHeight="70.5vh"
            highlightOnHover
            noHeader
            progressPending={excelData.length === 0} // Add loading state if no data
            progressComponent={<span>Loading...</span>} // Display loading text
          />
        </div>
      </div>
    </div>
  );
}

export default OrderListScreen;
