"use client";

import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
//import { useRouter } from "next/navigation";
import { OrderList } from "@/interface/order-list";
import { getUser } from "@/local-storage";
import { getOrderList } from "@/api/order";
import LoaderContext from "@/context/loader-context";
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
      const result = await getOrderList(getUser() ?? "");
      console.log(result.data.data ?? []);
      setExcelData(result.data.data ?? []);
      hideLoader();
    } catch (error) {
      hideLoader();
      console.log(error);
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
      name: "Order Date",
      selector: (row: OrderList) =>
        row.order_createdat !== null
          ? dayjs(row.order_createdat).format("DD MMM,YYYY")
          : "",
      //sortable: true,
      reorder: true,
      Alignment: "center",
      width: "130px",
    },
    {
      name: "Name",
      selector: (row: OrderList) => row.customer_name,
      //sortable: true,
      Alignment: "center",
      reorder: true,
    },
    {
      name: "Stores Name",
      selector: (row: OrderList) => row.customer_branch || "",
      //sortable: true,
      reorder: true,
      Alignment: "center",
      width: "200px",
    },
    {
      name: "Item Type",
      selector: (row: OrderList) => row.product_type || "",
      //sortable: true,
      reorder: true,
      Alignment: "center",
      width: "120px",
    },
    {
      name: "order for",
      selector: (row: OrderList) => row.order_for,
      //sortable: true,
      reorder: true,
      Alignment: "center",
      width: "140px",
    },
    {
      name: "Expected  Date",
      selector: (row: OrderList) =>
        row.exp_dlv_date !== null
          ? dayjs(row.exp_dlv_date).format("DD MMM,YYYY")
          : "",
      //sortable: true,
      reorder: true,
      Alignment: "center",
      width: "140px",
    },
    {
      name: "View",
      cell: (row: OrderList) => (
        <p
          className="underline cursor-pointer text-black"
          //onClick={() => router.push(`/order/order-detail?id=${row.orderno}`)}
        >
          {row.orderno}
        </p>
      ),
      center: true,
      width: "90px",
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
            fixedHeaderScrollHeight="70vh"
            highlightOnHover
            noHeader
          />
        </div>
      </div>
    </div>
  );
}

export default OrderListScreen;
