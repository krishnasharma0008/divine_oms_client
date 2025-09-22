/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import dayjs from "dayjs"; // Ensure you have installed dayjs
import React, {
  useContext,
  useEffect,
  useState,
  memo,
  useCallback,
} from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { OrderList } from "@/interface/order-list";
import { getAdminToken, getUser } from "@/local-storage";
import { DownloadOrderListExcel, getOrderList } from "@/api/order";
import LoaderContext from "@/context/loader-context";
import Link from "next/link";
import Image from "next/image"; // Make sure to import Image from next/image
import { CustomPagination } from "@/components";
import { OrderFilters } from "@/interface/order-filter";
//import DatePickerInput from "@/components/common/DatePickerInput";
//import ITEM_TYPE from "@/enums/item-type";
//import ORDER_FOR from "@/enums/order-for";
import { useIsoDate } from "@/hook/useIsoDate";

// Memoize the DataTable to prevent unnecessary re-renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MemoizedDataTable = memo(({ columns, data, customStyles }: any) => (
  <DataTable
    columns={columns}
    data={data}
    customStyles={customStyles}
    fixedHeader
    fixedHeaderScrollHeight="70vh"
    highlightOnHover
    noHeader
    pagination={false}
  />
));

MemoizedDataTable.displayName = "MemoizedDataTable"; // Add display name for debugging

function AdminOrderListScreen() {
  const [excelData, setExcelData] = useState<OrderList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const { formatAsIsoDate } = useIsoDate();

  const [filters, setFilters] = useState<OrderFilters>({
    order_status: "",
    orderno: "",
    order_createdat: null,
    customer_name: "",
    customer_branch: "",
    product_type: "",
    order_for: "",
    exp_dlv_date: null,
  });

  // Memoize the fetchData function to prevent unnecessary re-fetching
  const fetchData = useCallback(
    async (pageNo: number, filterParams = filters) => {
      setLoading(true);
      //showLoader();
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
          getAdminToken() ?? "",
          formattedFilters
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
    },
    [showLoader, hideLoader]
  );

  // Page change handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalRows / 10)) {
      setSelectedPage(newPage);
      fetchData(newPage); // Fetch data for the new page
    }
  };

  // Initial data fetch or page change
  useEffect(() => {
    fetchData(selectedPage);
  }, [selectedPage, fetchData]);

  const columns: TableColumn<OrderList>[] = [
    {
      name: "#",
      cell: (_row: OrderList, index: number) => index + 1,
      reorder: true,
      center: true,
      width: "50px",
    },
    {
      name: "Order Status",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Order Status</div>
      //     <div>
      //       <DropdownCust
      //         label=""
      //         options={Object.values(STATUS)}
      //         value={filters.order_status ?? ""}
      //         onChange={(val) => setFilters({ ...filters, order_status: val })}
      //         classes="w-full text-black p-0"
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.order_status,
      width: "130px",
    },
    {
      name: "Order No",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Order No.</div>
      //     <div>
      //       <input
      //         type="text"
      //         className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500 p-1"
      //         placeholder="Search..."
      //         value={filters.orderno}
      //         onChange={(e) =>
      //           setFilters({ ...filters, orderno: e.target.value })
      //         }
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.orderno,
      cell: (row: OrderList) => (
        <Link
          href={`/admin/order/order-detail-${row.product_type}?id=${row.orderno}`}
          rel="noopener noreferrer"
          title={`View order details for Order No. ${row.orderno}`}
          className="underline"
        >
          {row.orderno || ""}
        </Link>
      ),
      width: "130px",
    },
    {
      name: "ORDER DATE",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Order Date.</div>
      //     <div>
      //       <DatePickerInput
      //         value={filters.order_createdat}
      //         onChange={(date) =>
      //           setFilters({ ...filters, order_createdat: date })
      //         }
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) =>
        row.order_createdat
          ? dayjs(row.order_createdat).format("DD MMM, YYYY")
          : "",
      reorder: true,
      width: "130px",
    },
    {
      name: "NAME",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Name</div>
      //     <div>
      //       <input
      //         type="text"
      //         className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
      //         placeholder="Search..."
      //         value={filters.customer_name}
      //         onChange={(e) =>
      //           setFilters({ ...filters, customer_name: e.target.value })
      //         }
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.customer_name,
      reorder: true,
    },
    {
      name: "STORES NAME",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Stores Name</div>
      //     <div>
      //       <input
      //         type="text"
      //         className="w-full p-[7px] text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
      //         placeholder="Search..."
      //         value={filters.customer_branch}
      //         onChange={(e) =>
      //           setFilters({ ...filters, customer_branch: e.target.value })
      //         }
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.customer_branch || "",
      reorder: true,
      width: "200px",
    },
    {
      name: "ITEM TYPE",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Item Type</div>
      //     <div>
      //       <select
      //         value={filters.product_type}
      //         onChange={(e) =>
      //           setFilters({ ...filters, product_type: e.target.value })
      //         }
      //         className="bg-white border border-gray-300 rounded-md p-2 text-black w-full"
      //       >
      //         {
      //           //status.map((option, idx) => (
      //           Object.values(ITEM_TYPE).map((option, idx) => (
      //             <option key={idx} value={option}>
      //               {option}
      //             </option>
      //           ))
      //         }
      //       </select>
      //       {/* <DropdownCust
      //         label=""
      //         options={Object.values(ITEM_TYPE)}
      //         value={filters.product_type}
      //         onChange={(val) => setFilters({ ...filters, product_type: val })}
      //         classes="w-full text-black p-0"
      //       /> */}
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.product_type || "",
      reorder: true,
      width: "120px",
    },
    {
      name: "ORDER FOR",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Order For</div>
      //     <div>
      //       {/* <input
      //         type="text"
      //         className="w-full p-1 text-xs border border-gray-300 rounded bg-white text-black placeholder-gray-500"
      //         placeholder="Search..."
      //         value={filters.order_for}
      //         onChange={(e) =>
      //           setFilters({ ...filters, order_for: e.target.value })
      //         }
      //       /> */}
      //       <DropdownCust
      //         label=""
      //         options={Object.values(ORDER_FOR)}
      //         value={filters.order_for}
      //         onChange={(val) => setFilters({ ...filters, order_for: val })}
      //         classes="w-full text-black p-0"
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) => row.order_for,
      reorder: true,
      width: "140px",
    },
    {
      name: "EXPECTED DATE",
      // name: (
      //   <div className="flex flex-col w-full">
      //     <div className="flex justify-center">Expected Date</div>
      //     <div>
      //       <DatePickerInput
      //         value={filters.exp_dlv_date}
      //         onChange={(date) =>
      //           setFilters({ ...filters, exp_dlv_date: date })
      //         }
      //       />
      //     </div>
      //   </div>
      // ),
      selector: (row: OrderList) =>
        row.exp_dlv_date ? dayjs(row.exp_dlv_date).format("DD MMM, YYYY") : "",
      reorder: true,
      width: "140px",
    },
    // {
    //   name: "ACTION",
    //   cell: (row: OrderList) => (
    //     <Link
    //       href={`/admin/order/order-detail-${row.product_type}?id=${row.orderno}`}
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

  const customStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "#000000",
        color: "white",
        minHeight: "30px",
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
        minHeight: "30px",
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

  const ExcelDownload = async () => {
    try {
      showLoader();
      const result = await DownloadOrderListExcel();
      const href = window.URL.createObjectURL(new Blob([result.data]));
      const anchorElement = document.createElement("a");
      anchorElement.href = href;
      anchorElement.download = `Order_List_${new Date()}.xlsx`;
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
      hideLoader();
    } catch (error) {
      hideLoader();
      console.log(error);
    }
  };

  const DownloadClick = () => {
    ExcelDownload();
  };

  return (
    <div className="">
      <div className="w-full bg-white shadow-md rounded-lg p-2 mt-2">
        {/* Header */}
        <div className="flex justify-between items-center rounded-lg mb-2 px-4 mb-0.5">
          <h1 className="text-2xl font-bold">Order List</h1>
          <button
            onClick={DownloadClick}
            className="px-4 py-1 bg-black text-white rounded-md hover:bg-blue-600 transition"
          >
            Get Excel
          </button>
          {/* Custom Pagination Controls */}
          <CustomPagination
            totalRows={totalRows}
            rowsPerPage={10}
            selectedPage={selectedPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Table with Loader */}
        <div className="overflow-auto border relative">
          {isDataLoaded ? (
            <>
              {/* Only update the table */}
              <MemoizedDataTable
                columns={columns}
                data={excelData}
                customStyles={customStyles}
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

export default AdminOrderListScreen;
