"use client";

import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { OrderList } from "@/interface/order-list";
import { getAdminToken, getUser } from "@/local-storage";
import { DownloadOrderListExcel, getOrderList } from "@/api/order";
import LoaderContext from "@/context/loader-context";
//import { InputText } from "@/components";
//import { useRouter } from "next/navigation";
import Link from "next/link";

function AdminOrderListScreen() {
  //const router = useRouter();

  const [excelData, setExcelData] = useState<OrderList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const { showLoader, hideLoader } = useContext(LoaderContext);

  // const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  // const onSelectedPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const inputPage = parseInt(event.target.value, 10);
  //   if (inputPage >= 1 && inputPage <= totalPages) {
  //     setSelectedPage(inputPage);
  //   } else {
  //     alert(`Please enter a page number between 1 and ${totalPages}`);
  //   }
  // };

  const onPageClick = (pageNumber: number) => {
    if (selectedPage >= 1) setSelectedPage(pageNumber);
    //fetchData(pageNumber);
  };

  // const goToSelectedPage = () => {
  //   if (selectedPage >= 1 && selectedPage <= totalPages) {
  //     fetchData(selectedPage);
  //   }
  // };

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (pageNo: number) => {
    //if (loading) return; // Prevent multiple concurrent calls
    setLoading(true);
    showLoader();
    try {
      const result = await getOrderList(
        getUser() ?? "",
        pageNo,
        getAdminToken() ?? ""
      );
      setExcelData(result.data.data ?? []);
      // setTotalPages(result.data.total_page);
      // setTotalRows(result.data.total_row);
      setTotalRows(10);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  // const handleProcessClick = () => {
  //   fetchData(1);
  // };

  const columns: TableColumn<OrderList>[] = [
    {
      name: "#",
      cell: (_row: OrderList, index: number) => index + 1,
      reorder: true,
      center: true,
      width: "50px",
    },
    {
      name: "ORDER DATE",
      selector: (row: OrderList) =>
        row.order_createdat
          ? dayjs(row.order_createdat).format("DD MMM, YYYY")
          : "",
      reorder: true,
      width: "130px",
    },
    {
      name: "NAME",
      selector: (row: OrderList) => row.customer_name,
      reorder: true,
    },
    {
      name: "STORES NAME",
      selector: (row: OrderList) => row.customer_branch || "",
      reorder: true,
      width: "200px",
    },
    {
      name: "ITEM TYPE",
      selector: (row: OrderList) => row.product_type || "",
      reorder: true,
      width: "120px",
    },
    {
      name: "ORDER FOR",
      selector: (row: OrderList) => row.order_for,
      reorder: true,
      width: "140px",
    },
    {
      name: "EXPECTED DATE",
      selector: (row: OrderList) =>
        row.exp_dlv_date ? dayjs(row.exp_dlv_date).format("DD MMM, YYYY") : "",
      reorder: true,
      width: "140px",
    },
    {
      name: "ACTION",
      cell: (row: OrderList) => (
        <Link
          href={`/admin/order/order-detail-${row.product_type}?id=${row.orderno}`}
          //target="_blank"
          rel="noopener noreferrer"
        >
          {/* {row.orderno} */}
          <button className="w-full bg-black text-white py-2 px-4 shadow-md hover:text-black hover:bg-white focus:outline-none">
            View
          </button>
        </Link>
      ),
      center: true,
      width: "150px",
    },
  ];

  const customStyles: TableStyles = {
    headRow: {
      style: {
        backgroundColor: "#000000",
        color: "white",
        minHeight: "30px",
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

  const CustomPagination = {
    noRowsPerPage: true,
    rowsPerPageText: "",
    selectAllRowsItem: false,
    //selectAllRowsItemText: "All",
  };

  const ExcelDownload = async () => {
    //console.log("Download Excel");
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
        <div className="flex justify-between items-center my-2 rounded-lg">
          <h1 className="text-2xl font-bold">Order List</h1>
          <button
            onClick={DownloadClick}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-blue-600 transition"
          >
            Get Excel
          </button>
        </div>

        {/* Loader and Data Table */}
        <div className="overflow-auto border">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-600 text-xl">Loading...</span>
            </div>
          ) : isDataLoaded && excelData.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-600 text-xl">No data available.</span>
            </div>
          ) : isDataLoaded ? (
            <DataTable
              columns={columns}
              data={excelData}
              customStyles={customStyles}
              fixedHeader
              //fixedHeaderScrollHeight="70.5vh"
              highlightOnHover
              noHeader
              pagination
              paginationServer
              paginationComponentOptions={CustomPagination}
              paginationTotalRows={totalRows}
              paginationDefaultPage={selectedPage}
              onChangePage={onPageClick}
            />
          ) : (
            <div className="flex justify-center items-center py-10">
              <span className="text-gray-600 text-xl">
                Click &quot;Process&quot; to load data.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrderListScreen;
