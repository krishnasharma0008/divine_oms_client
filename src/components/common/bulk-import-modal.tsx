import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Typography, CardBody, CardHeader } from "@material-tailwind/react";

// Define a type for the imported data
interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

// Define props for the BulkImportModal component
interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null); // File state
  const [excelData, setExcelData] = useState<ExcelRow[]>([]); // Store data from Excel
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // Processing state for import
  const [isValidated, setIsValidated] = useState<boolean>(false); // Validation state

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile); // Automatically read the file when selected
    }
  };

  // Read Excel file and parse the data
  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer); // Cast result to ArrayBuffer
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setExcelData(jsonData as ExcelRow[]); // Set parsed Excel data into state
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle import action
  const handleImport = () => {
    if (file) {
      setIsProcessing(true); // Set processing state to true while importing
      console.log("Importing data...");

      // Simulate import delay (replace with actual import logic)
      setTimeout(() => {
        console.log("Data imported successfully:", excelData);
        setIsProcessing(false); // Reset processing state
      }, 2000);
    } else {
      alert("Please select a file to import.");
    }
  };

  // Handle validation
  const handleValidate = () => {
    console.log("Validating data...");
    setIsValidated(true); // Set validation state to true when validation is done
  };

  // Handle reset
  const handleReset = () => {
    setFile(null); // Reset file
    setExcelData([]); // Reset Excel data
    setIsValidated(false); // Reset validation state
  };

  // Handle save action
  const handleSave = () => {
    if (isValidated) {
      console.log("Saving data...");
      // Simulate saving logic (replace with actual saving logic)
      alert("Data saved successfully.");
    } else {
      alert("Please validate the data before saving.");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center"
          onClick={onClose} // Close modal when clicking outside
        >
          <div
            className="bg-white px-4 pb-2 border-l-1 rounded-lg shadow-lg w-9/12" // Set width to 90% with w-9/12
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* File Selection with button beside it */}

            {/* Table to show the imported data */}
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="mb-2 flex items-center justify-between gap-8">
                <div>
                  <Typography variant="h5" color="blue-gray">
                    Bulk Import
                  </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <div className="w-auto flex justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="p-2 border rounded-md w-3/4"
                        //ref={(input) => input && (input.style.display = "none")} // Hide the input element
                      />
                      <button
                        onClick={() => {
                          const fileInput = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement;
                          fileInput?.click(); // Click the hidden file input element
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        Choose File
                      </button>
                    </div>

                    {/* Buttons for Validate, Reset, Import, Save, and Close */}
                    <div className="flex space-x-2">
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
                </div>
              </div>
            </CardHeader>
            {excelData.length > 0 && (
              <CardBody className="overflow-auto px-0 max-h-80">
                <table className="w-full min-w-max table-auto text-left">
                  <thead className="sticky top-0 bg-white z-10 shadow-sm">
                    <tr>
                      {Object.keys(excelData[0]).map((key) => (
                        <th
                          key={key}
                          className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                        >
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {key}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, index) => {
                      const isLast = index === excelData.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          {Object.values(row).map((value, colIndex) => (
                            <td key={colIndex} className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {value}
                              </Typography>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BulkImportModal;
