"use client";

import React, { useEffect } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { useRouter } from "next/navigation";
import { OrderList } from "@/interface/order-list";

function OrderListScreen() {
  const router = useRouter();

  const [excelData, setExcelData] = React.useState<OrderList[]>([]);

  useEffect(() => {
    setExcelData([
      {
        id: 1,
        order_date: "2023-12-01",
        pj_name: "Jeweller A",
        store_name: "Store X",
        item_type: "Necklace",
        order_type: "Custom",
        order_for: "Customer Y",
        req_date: "2023-12-10",
        exp_date: "2023-12-15",
        view_order: "7781",
      },
      // More mock rows
    ]);
  }, []);

  const columns: TableColumn<OrderList>[] = [
    {
      name: "Sr. No.",
      cell: (row: OrderList, index: number) => index + 1,
      reorder: true,
      width: "80px",
    },
    {
      name: "Order Date",
      selector: (row: OrderList) => row.order_date || "",
      sortable: true,
      reorder: true,
    },
    {
      name: "Pj Name",
      //   cell: (row) => (
      //     <div
      //       className={`w-full font-bold py-2 px-4 rounded text-center`}

      //       //onClick={() => onRowClicked(row.id)}
      //     >
      //       {row.pj_name}
      //     </div>
      //   ),
      selector: (row: OrderList) => row.pj_name,
      sortable: true,
      reorder: true,
      width: "140px",
    },
    {
      name: "Stores Name",
      selector: (row: OrderList) => row.store_name || "",
      sortable: true,
      reorder: true,
    },
    {
      name: "Item Type",
      //selector: (row) => (row.createdat !== null ? dayjs(row.createdat).format('DD MMM,YYYY') : ''),
      selector: (row: OrderList) => row.item_type || "",
      sortable: true,
      reorder: true,
    },
    {
      name: "Order Type",
      //selector: (row) => (row.polend !== null ? dayjs(row.polend).format('DD MMM,YYYY') : ''),
      selector: (row: OrderList) => row.order_type || "",
      sortable: true,
      reorder: true,
    },
    {
      name: "order for",
      selector: (row: OrderList) => row.order_for,
      sortable: true,
      reorder: true,
    },
    {
      name: "Required Date",
      selector: (row: OrderList) => row.req_date,
      sortable: true,
      reorder: true,
    },
    {
      name: "Expected  Date",
      selector: (row: OrderList) => row.exp_date,
      sortable: true,
      reorder: true,
    },
    {
      name: "View Order",
      cell: (row: OrderList) => (
        <p
          className="underline cursor-pointer"
          onClick={() => router.push(`/orders/${row.id}`)}
        >
          {row.view_order}
        </p>
      ),
      width: "100px",
    },
  ].map((col) => ({ ...col, name: col.name?.toUpperCase() }));

  // Define table custom styles
  const CustomStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "#000000",
        color: "white",
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
        //alignItems: "center",
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
            // onRowClicked={(row) => {
            //   Object.keys(row).forEach((key) => {
            //     onRowClicked(key, row[key] ?? "");
            //   });
            // }}
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
