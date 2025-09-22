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
import { CustomPagination, DropdownCust } from "@/components";
import DatePickerInput from "@/components/common/DatePickerInput";
import { OrderFilters } from "@/interface/order-filter";
import ITEM_TYPE from "@/enums/item-type";
import ORDER_FOR from "@/enums/order-for";
import { useIsoDate } from "@/hook/useIsoDate";
//import Select from "react-select";

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

  const { formatAsIsoDate } = useIsoDate();

  //for fliter
  //Column filters (these will be sent to the API)
  // const [filters, setFilters] = useState({
  //   orderno: "",
  //   order_createdat: "",
  //   customer_name: "",
  //   customer_branch: "",
  //   product_type: "",
  //   order_for: "",
  //   exp_dlv_date: "",
  // });

  const [filters, setFilters] = useState<OrderFilters>({
    orderno: "",
    order_createdat: null,
    customer_name: "",
    customer_branch: "",
    product_type: "",
    order_for: "",
    exp_dlv_date: null,
  });

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

  const fetchData = async (pageNo: number, filterParams = filters) => {
    setLoading(true);
    console.log(
      "Fetching data for page:",
      pageNo,
      "with filters:",
      filterParams
    );

    const formattedFilters = {
      ...filters,
      order_createdat: filters.order_createdat
        ? formatAsIsoDate(filters.order_createdat)
        : null,
      exp_dlv_date: filters.exp_dlv_date
        ? formatAsIsoDate(filters.exp_dlv_date)
        : null,
    };

    try {
      const result = await getOrderList(
        getUser() ?? "",
        pageNo,
        getToken() ?? "",
        formattedFilters // ✅ send single object
      );
      setExcelData(result.data.data ?? []);
      setTotalRows(result.data.total_row);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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

  // Handle filter change with debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(1, filters); // reset to page 1 when filters change
      setSelectedPage(1);
    }, 500); // 0.5 sec debounce

    return () => clearTimeout(delay);
  }, [filters]);

  const columns: TableColumn<OrderList>[] = [
    {
      //name: "Order No.",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Order No.</div>
          <div>
            <input
              type="text"
              className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500 p-1"
              placeholder="Search..."
              value={filters.orderno}
              onChange={(e) =>
                setFilters({ ...filters, orderno: e.target.value })
              }
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) => row.orderno || "",
      cell: (row: OrderList) => (
        <Link
          href={`/order/order-detail-${row.product_type}?id=${row.orderno}`}
          rel="noopener noreferrer"
          title={`View order details for Order No. ${row.orderno}`}
          className="underline"
        >
          {row.orderno || ""}
        </Link>
      ),
      width: "100px",
    },
    {
      //name: "Order Date",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Order Date.</div>
          <div>
            <DatePickerInput
              value={filters.order_createdat}
              onChange={(date) =>
                setFilters({ ...filters, order_createdat: date })
              }
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) =>
        row.order_createdat !== null
          ? dayjs(row.order_createdat).format("DD MMM,YYYY")
          : "",
      //sortable: true,
      //reorder: true,
      //Alignment: "center",
      width: "160px",
    },
    {
      //name: "Name",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Name</div>
          <div>
            <input
              type="text"
              className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
              placeholder="Search..."
              value={filters.customer_name}
              onChange={(e) =>
                setFilters({ ...filters, customer_name: e.target.value })
              }
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) => row.customer_name,
      //sortable: true,
      //reorder: true,
      //Alignment: "center",
    },
    {
      //name: "Stores Name",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Stores Name</div>
          <div>
            <input
              type="text"
              className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
              placeholder="Search..."
              value={filters.customer_branch}
              onChange={(e) =>
                setFilters({ ...filters, customer_branch: e.target.value })
              }
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) => row.customer_branch || "",
      //sortable: true,
      //reorder: true,
      //Alignment: "center",
      width: "200px",
    },
    {
      //name: "Item Type",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Item Type</div>
          <div>
            <DropdownCust
              label=""
              options={Object.values(ITEM_TYPE)}
              value={filters.product_type}
              onChange={(val) => setFilters({ ...filters, product_type: val })}
              classes="w-full text-black p-0 border-gray-300"
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) => row.product_type || "",
      // sortable: true,
      // reorder: true,
      //Alignment: "center",
      width: "120px",
    },
    {
      //name: "Order For",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Order For</div>
          <div>
            <DropdownCust
              label=""
              options={Object.values(ORDER_FOR)}
              value={filters.order_for}
              onChange={(val) => setFilters({ ...filters, order_for: val })}
              classes="w-full text-black p-0"
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) => row.order_for,
      // sortable: true,
      // reorder: true,
      //Alignment: "center",
      width: "140px",
    },
    {
      //name: "Expected Date",
      //name: "Exp Date",
      name: (
        <div className="flex flex-col w-full">
          <div className="flex justify-center">Expected Date</div>
          <div>
            <DatePickerInput
              value={filters.exp_dlv_date}
              onChange={(date) =>
                setFilters({ ...filters, exp_dlv_date: date })
              }
            />
          </div>
        </div>
      ),
      selector: (row: OrderList) =>
        row.exp_dlv_date !== null
          ? dayjs(row.exp_dlv_date).format("DD MMM,YYYY")
          : "",
      // sortable: true,
      // reorder: true,
      //Alignment: "center",
      width: "160px",
    },
    // {
    //   name: "",
    //   cell: (row: OrderList) => (
    //     <Link
    //       href={`/order/order-detail-${row.product_type}?id=${row.orderno}`}
    //       //target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <button className="w-full bg-black text-white py-2 px-4 shadow-md hover:text-black hover:bg-white focus:outline-none">
    //         View
    //       </button>
    //     </Link>
    //   ),
    //   center: true,
    //   width: "150px",
    // },
  ];

  // Define table custom styles
  const CustomStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "#000000",
        color: "white",
        minHeight: "30px", // Reduce the header height
        paddingTop: "4px", // Adjust padding
        paddingBottom: "2px",
        // paddingLeft: "2px",
        // paddingRight: "2px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "2px", // override the initial padding
        paddingRight: "2px",
        // Add other styles here like fontSize, color, etc.
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
            rowsPerPage={50} //{10}
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
