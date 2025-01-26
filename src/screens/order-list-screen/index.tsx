"use client";

import dayjs from "dayjs";
import React, { useEffect, useState, memo } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
//import { useRouter } from "next/navigation";
import { OrderList } from "@/interface/order-list";
import { getToken, getUser } from "@/local-storage";
import { getOrderList } from "@/api/order";
//import LoaderContext from "@/context/loader-context";
import Link from "next/link";
import Image from "next/image";
import { CustomPagination } from "@/components";
//import NotificationContext from "@/context/notification-context";

// Memoize the DataTable to prevent unnecessary re-renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MemoizedDataTable = memo(({ columns, data, customStyles }: any) => (
  <DataTable
    //title="Order List"
    columns={columns}
    data={data}
    customStyles={customStyles}
    fixedHeader
    //fixedHeaderScrollHeight="70vh"
    highlightOnHover
    noHeader
    pagination={false}
  />
));

MemoizedDataTable.displayName = "MemoizedDataTable"; // Add display name for debugging

function OrderListScreen() {
  const [excelData, setExcelData] = React.useState<OrderList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  //const { showLoader, hideLoader } = useContext(LoaderContext);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  // useEffect(() => {
  //   getlistdata();
  // }, []);

  // const getlistdata = async () => {
  //   try {
  //     showLoader();
  //     const result = await getOrderList(getUser() ?? "", 1, getToken() ?? "");
  //     setTotalRows(result.data.total_row);
  //     const data = result.data.data ?? [];
  //     if (Array.isArray(data)) {
  //       setExcelData(data);

  //     } else {
  //       console.log("Error: Data is not an array");
  //     }
  //     hideLoader();
  //   } catch (error) {
  //     hideLoader();
  //     console.log(error);
  //   }
  // };

  const fetchData = async (pageNo: number) => {
    setLoading(true);
    //showLoader();
    try {
      const result = await getOrderList(
        getUser() ?? "",
        pageNo,
        getToken() ?? ""
      );
      setExcelData(result.data.data ?? []);
      setTotalRows(result.data.total_row); // Set total rows dynamically from API response
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      //hideLoader();
    }
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    console.log("newPage :", newPage);
    if (newPage >= 1 && newPage <= Math.ceil(totalRows / 10)) {
      setSelectedPage(newPage);
      fetchData(newPage); // Fetch data for the new page
    }
  };

  // Initial data fetch or page change
  useEffect(() => {
    fetchData(selectedPage);
  }, []);

  const columns: TableColumn<OrderList>[] = [
    // {
    //   name: " # ",
    //   cell: (row: OrderList, index: number) => index + 1,
    //   reorder: true,
    //   center: true,
    //   width: "50px",
    // },
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
        <div className="flex justify-between items-center rounded-lg px-4 mb-0.5">
          <h1 className="text-2xl font-bold">Order List</h1>
          {/* Custom Pagination Controls */}
          <CustomPagination
            totalRows={totalRows}
            rowsPerPage={10}
            selectedPage={selectedPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Data Table */}
        {/* <div className="overflow-auto border">
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
          <CustomPagination
            totalRows={totalRows}
            rowsPerPage={10}
            selectedPage={selectedPage}
            onPageChange={handlePageChange}
          />
        </div> */}
        <div className="overflow-auto border relative">
          {isDataLoaded ? (
            <>
              {/* Only update the table */}
              <MemoizedDataTable
                columns={columns}
                data={excelData}
                //customStyles={customStyles}
                customStyles={CustomStyles}
              />
            </>
          ) : (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-600 text-xl">No data available.</span>
            </div>
          )}

          {/* Show Loader Image Inside Table */}
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white opacity-75 z-10">
              <Image
                src="/loader.gif"
                alt="loader"
                height={50} // Set the desired height for the loader
                width={50} // Set the desired width for the loader
                className="m-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderListScreen;
