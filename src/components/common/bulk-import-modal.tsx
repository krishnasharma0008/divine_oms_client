import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable, { TableColumn } from "react-data-table-component";

interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
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

  // Handle import
  const handleImport = () => {
    if (file) {
      setIsProcessing(true);
      setTimeout(() => {
        console.log("Data imported successfully:", excelData);
        setIsProcessing(false);
      }, 2000);
    } else {
      alert("Please select a file to import.");
    }
  };

  // Handle validation
  const handleValidate = () => {
    console.log("Validating data...");
    setIsValidated(true);
  };

  // Handle reset
  const handleReset = () => {
    setFile(null);
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

  // Define columns dynamically based on keys in the Excel data
  const columns: TableColumn<ExcelRow>[] = excelData.length
    ? Object.keys(excelData[0]).map((key) => ({
        name: key,
        selector: (row) => row[key] ?? "", // Replace null with an empty string
        sortable: true,
      }))
    : [];

  const CustomStyles = {
    headRow: {
      style: {
        backgroundColor: "#90a4ae",
        color: "white",
      },
    },
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="bg-white px-4 pb-2 border-l-1 rounded-lg shadow-lg w-9/12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center my-4">
              <h2 className="text-xl font-bold">Bulk Import</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const fileInput = document.querySelector(
                      'input[type="file"]'
                    ) as HTMLInputElement;
                    fileInput?.click();
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Choose File
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                >
                  Validate
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Reset
                </button>
                <button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className={`px-4 py-2 bg-green-500 text-white rounded-md ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? "Processing..." : "Import"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isValidated}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                    !isValidated ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>

            {/* DataTable */}
            {excelData.length > 0 && (
              <DataTable
                columns={columns}
                data={excelData}
                customStyles={CustomStyles}
                fixedHeader
                fixedHeaderScrollHeight="400px"
                pagination
                highlightOnHover
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BulkImportModal;
