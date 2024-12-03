"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { useRouter } from "next/navigation";

interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

const JewelleryBulkImportScreen: React.FC = () => {
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const router = useRouter();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      readExcelFile(selectedFile);
    }
  };

  // Parse the Excel file
  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(jsonData as ExcelRow[]);
      } catch (error) {
        alert(
          "Error reading the Excel file. Please ensure it is a valid file."
        );
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle validation
  const handleValidate = () => {
    console.log("Validating data...");
    setIsValidated(true);
  };

  // Handle reset
  const handleReset = () => {
    setExcelData([]);
    setIsValidated(false);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Handle save
  const handleSave = () => {
    if (isValidated) {
      console.log("Saving data...");
      alert("Data saved successfully.");
    } else {
      alert("Please validate the data before saving.");
    }
  };

  // Handle close
  const handleClose = () => {
    router.push(`/jewellery`);
  };

  // Define columns dynamically based on keys in the Excel data
  const columns: TableColumn<ExcelRow>[] = excelData.length
    ? [
        {
          name: "SR No",
          selector: (_, index) => (index !== undefined ? index + 1 : 0), // Adds serial number to the column
          sortable: false,
        },
        ...Object.keys(excelData[0]).map((key) => ({
          name: key,
          selector: (row: ExcelRow) => row[key] ?? "", // Replace null with an empty string
          sortable: true,
          cell: (row: ExcelRow) => (
            <div onClick={() => onRowClicked(key, row[key] ?? "")}>
              {row[key]}
            </div>
          ),
        })),
      ]
    : [];

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
        borderRightStyle: "solid",
        borderRightWidth: "1px",
        //alignItems: "center",
        justifyItems: "center",
      },
    },
  };

  // Handle cell click to show error
  const onRowClicked = (
    columnName: string,
    cellValue: string | number | boolean | null
  ) => {
    alert(`Column Name : ${columnName}.`);
    alert(`Column Value : ${cellValue}.`);
    // if (cellValue === null || cellValue === "") {
    //   alert(`Invalid data in column: ${columnName}. Please review the data.`);
    // } else {
    //   alert("Valid data.");
    // }
  };

  return (
    <div className="px-2">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-2 mt-2">
        {/* Header */}
        <div className="flex justify-between items-center my-2 rounded-lg">
          <h1 className="text-2xl font-bold">Bulk Import Page</h1>
          <div className="flex space-x-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => {
                const fileInput = document.querySelector(
                  'input[type="file"]'
                ) as HTMLInputElement | null;
                fileInput?.click();
              }}
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L12 14M12 14L15 11M12 14L9 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C7.58172 20 4 16.4183 4 12M20 12C20 14.5264 18.8289 16.7792 17 18.2454"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Import</span>
            </button>

            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <g strokeLinecap="round" strokeWidth="2">
                  <path d="M8.5 14.5h7.657" />
                  <path d="M8.5 10.5h7.657" />
                  <path d="M8.5 6.5h7.657" />
                  <path d="M5.5 14.5h0" />
                  <path d="M5.5 10.5h0" />
                  <path d="M5.5 6.5h0" />
                </g>
                <path
                  d="M9.128 20.197H3.444a2.22 2.22 0 01-2.229-2.153V3.152A2.153 2.153 0 013.367.997h15.48A2.153 2.153 0 0121 3.152v8.738"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <path
                  fill="currentColor"
                  d="M16.5 23.499a1.464 1.464 0 01-1.094-.484l-2.963-2.969A1.479 1.479 0 0112 18.985a1.5 1.5 0 01.462-1.078 1.56 1.56 0 012.113.037l1.925 1.931 4.943-4.959a1.543 1.543 0 012.132.02 1.461 1.461 0 01.425 1.04 1.5 1.5 0 01-.45 1.068l-5.993 6.012a1.44 1.44 0 01-1.057.443z"
                />
              </svg>
              <span>Validate</span>
            </button>
            <button
              onClick={handleSave}
              disabled={!isValidated}
              className={`px-4 py-2 bg-black text-white rounded-md border border-black flex items-center space-x-2 ${
                !isValidated
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
              } transition-colors`}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                  fill="currentColor"
                />
              </svg>
              <span> Save</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 21 21"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="matrix(0 1 1 0 2.5 2.5)"
                >
                  <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8" />
                  <path d="m4 1v4h-4" transform="matrix(0 1 1 0 0 0)" />
                </g>
              </svg>
              <span>Reset</span>
            </button>

            <button
              onClick={handleClose}
              className="px-4 py-2 bg-black text-white rounded-md border border-black hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto border">
          <DataTable
            columns={columns}
            data={excelData}
            customStyles={CustomStyles}
            onRowClicked={(row) => {
              Object.keys(row).forEach((key) => {
                onRowClicked(key, row[key] ?? "");
              });
            }}
            fixedHeader
            fixedHeaderScrollHeight="70vh"
            highlightOnHover
            noHeader
          />
        </div>
      </div>
    </div>
  );
};

export default JewelleryBulkImportScreen;
