"use client";

import React, { useContext, useState } from "react";
import * as XLSX from "xlsx";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { useRouter } from "next/navigation";
import { CartDetail, JewelleryDetail } from "@/interface";
import {
  getJewelleryProductList,
  //getJewelleryProductPrice,
} from "@/api/jewellery-detail";
//import { usePremiumSizeAndPercentage } from "@/hook";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import dayjs from "dayjs";
import { createCart } from "@/api/cart";
import LoaderContext from "@/context/loader-context";
import NotificationContext from "@/context/notification-context";
import LoginContext from "@/context/login-context";
import {
  otherRoundColors,
  otherRoundColorsCarat,
  colors,
  clarities,
  claritiesRound,
  claritiesRoundCarat,
  //Metal_Color,
  //slab,
} from "@/util/constants";
//import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// Define types
type ExcelRow = {
  [key: string]: string | number | boolean | string[] | null | undefined; // Allow undefined values
  errorMessages?: string[]; // Optional error messages
};

const JewelleryBulkImportScreen: React.FC = () => {
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentErrorMessages, setCurrentErrorMessages] = useState<string>("");
  const { customerOrder } = useCustomerOrderStore();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notify, notifyErr } = useContext(NotificationContext); //
  const { isCartCount, updateCartCount } = useContext(LoginContext);

  const [cartData, setCartData] = useState<CartDetail[]>([]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Define expected columns (from your earlier definition)
  const expectedColumns: (keyof ExcelRow)[] = [
    "product_type",
    "product_code",
    "product_qty",
    "solitaire_shape",
    "solitaire_slab",
    "solitaire_colorFrom",
    "solitaire_colorTo",
    "solitaire_qualityFrom",
    "solitaire_qualityTo",
    "metal_color",
    "size",
    "cart_remarks",
  ];

  // Display names for the columns
  const columnDisplayNames: { [key in keyof ExcelRow]: string } = {
    product_type: "Product Type",
    product_code: "Product Code",
    product_qty: "Qty",
    solitaire_shape: "Shape",
    solitaire_slab: "Slab",
    solitaire_colorFrom: "Color From",
    solitaire_colorTo: "Color To",
    solitaire_qualityFrom: "Clarity From",
    solitaire_qualityTo: "Clarity To",
    metal_color: "Metal Color",
    size: "Size",
    cart_remarks: "Cart Remarks",
  };

  // Function to export the Excel template
  const exportTemplate = () => {
    // Create a blank sheet with headers
    const worksheetData = [expectedColumns];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Create a new workbook and append the sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "Template.xlsx");
  };

  const getColorOptions = (slab: string, isRound: boolean) => {
    const carat = parseFloat(slab.split("-")[1]);

    if (isRound) {
      if (carat < 0.18) {
        return otherRoundColors;
      } else {
        return colors;
      }
    } else {
      if (carat >= 0.1 && carat <= 0.17) {
        return otherRoundColorsCarat;
      } else {
        return colors.filter(
          (color) => color !== "I" && color !== "J" && color !== "K"
        );
      }
    }
  };

  const getClarityOptions = (slab: string, isRound: boolean) => {
    const carat = parseFloat(slab.split("-")[1]);

    if (isRound) {
      if (carat < 0.18) {
        return claritiesRound;
      } else {
        return clarities;
      }
    } else {
      if (carat >= 0.1 && carat <= 0.17) {
        return claritiesRoundCarat;
      } else {
        return clarities.slice(0, 5);
      }
    }
  };

  const checkColorAvailability = (
    slab: string,
    isRound: boolean,
    colorF: string
  ) => {
    const availableColors = getColorOptions(slab, isRound);
    return availableColors.includes(colorF);
  };

  const checkClarityAvailability = (
    slab: string,
    isRound: boolean,
    clarityF: string
  ) => {
    const availableClarities = getClarityOptions(slab, isRound);
    return availableClarities.includes(clarityF);
  };

  // const getColorTOptions = (slab: string, isRound: boolean, colorF: string) => {
  //   const availableColors = getColorOptions(slab, isRound);
  //   const colorFIndex = availableColors.indexOf(colorF);
  //   return availableColors.filter((_, index) => index >= colorFIndex);
  // };

  const getColorTOptions = (
    slab: string,
    isRound: boolean,
    colorFrom: string
  ) => {
    const available = getColorOptions(slab, isRound);
    const fromIndex = available.indexOf(colorFrom);
    return fromIndex !== -1 ? available.slice(fromIndex) : [];
  };

  const getClarityTOptions = (
    slab: string,
    isRound: boolean,
    clarityFrom: string
  ) => {
    const available = getClarityOptions(slab, isRound);
    const fromIndex = available.indexOf(clarityFrom);
    return fromIndex !== -1 ? available.slice(fromIndex) : [];
  };

  // const getClarityTOptions = (
  //   slab: string,
  //   isRound: boolean,
  //   clarityF: string
  // ) => {
  //   const availableClarities = getClarityOptions(slab, isRound);
  //   const clarityFIndex = availableClarities.indexOf(clarityF);
  //   return availableClarities.filter((_, index) => index >= clarityFIndex);
  // };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      readExcelFile(selectedFile);
    }
  };

  const readExcelFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, {
          defval: "", // Default value for empty cells
        }) as ExcelRow[];

        if (jsonData.length === 0) {
          setCurrentErrorMessages(
            "The Excel file is empty. Please upload a file with data."
          );
          return;
        }

        // Extract headers from the parsed data
        const headers = Object.keys(jsonData[0] || {});
        //console.log("Parsed headers:", headers);

        // Check if all expected columns are present in the headers
        const missingColumns = expectedColumns.filter(
          (col) => !headers.includes(col as string)
        );
        //console.log("Missing columns:", missingColumns);

        // Trim headers and check for case or space issues
        const trimmedHeaders = headers.map((header) => {
          if (typeof header === "string") {
            return header.trim().toLowerCase(); // Only apply toLowerCase if it's a string
          }
          return header; // Return as it is if not a string
        });
        const trimmedExpectedColumns = expectedColumns.map((col) =>
          col.toString().toLowerCase()
        );
        const missingTrimmedColumns = trimmedExpectedColumns.filter(
          (col) => !trimmedHeaders.includes(col)
        );
        console.log("Trimmed missing columns:", missingTrimmedColumns);

        if (missingColumns.length > 0) {
          let errorMessage = `The following expected columns are missing:\n`;
          errorMessage += `- Missing Columns: ${missingColumns.join(", ")}.\n`;
          setCurrentErrorMessages(errorMessage);
          return;
        }

        // Check for extra columns in the data
        const extraColumns = headers.filter(
          (header) => !expectedColumns.includes(header)
        );
        console.log("Extra columns:", extraColumns);

        if (extraColumns.length > 0) {
          let errorMessage = "The Excel file contains unexpected columns:\n";
          errorMessage += `- Unexpected Columns: ${extraColumns.join(", ")}.\n`;
          setCurrentErrorMessages(errorMessage);
          return;
        }

        // Map the data to match the expected column order
        const mappedData = jsonData.map((row: ExcelRow) => {
          const mappedRow: ExcelRow = {};
          expectedColumns.forEach((col) => {
            mappedRow[col] = row[col] ?? ""; // Default empty string if missing
          });
          return mappedRow;
        });

        setCurrentErrorMessages("Excel file uploaded successfully.");
        setExcelData(mappedData);
      } catch (error) {
        setCurrentErrorMessages(
          "Error reading the Excel file. Please ensure it is a valid file with correct formatting."
        );
        console.error("Error reading Excel file:", error);
      }
    };

    reader.onerror = (error) => {
      setCurrentErrorMessages(
        "Error reading the file. Please ensure the file is a valid Excel format."
      );
      console.error("File read error:", error);
    };

    setIsModalOpen(true);
    setIsUploaded(true);
    reader.readAsArrayBuffer(file);
  };

  // Fetch data for jewellery with product_code
  const FetchData = async (product_code: string) => {
    try {
      const response = await getJewelleryProductList(product_code);
      return response.data.data;
    } catch (error) {
      setCurrentErrorMessages("An error occurred while fetching data.");
    }
  };

  // Validate Excel data using sequential await
  const handleValidate = async () => {
    showLoader();
    setCartData([]); // Reset CartData
    setCurrentErrorMessages(""); // Clear any previous error messages

    const mappedDataWithErrors = [];

    for (const row of excelData) {
      const errors = [];
      const getTrimmedValue = (key: string) =>
        row[key]?.toString().trim() || "";
      //const isRound = row["solitaire_shape"]?.toString() === "Round";
      const isRound =
        row["solitaire_shape"]?.toString().trim().toUpperCase() === "ROUND";

      const shape = row["solitaire_shape"]?.toString() || "";
      const caratRange = row["solitaire_slab"]?.toString() || "";
      const productCode = row["product_code"]?.toString().trim() || "";
      const productType = row["product_type"]?.toString() || "";
      const colorF = row["solitaire_colorFrom"]?.toString() || "";
      const colorT = row["solitaire_colorTo"]?.toString() || "";
      const clarityF = row["solitaire_qualityFrom"]?.toString() || "";
      const clarityT = row["solitaire_qualityTo"]?.toString() || "";
      const Qty = row["product_qty"]?.toString() || "";

      let jewellerydetail: JewelleryDetail | undefined;

      // Validate "product_type"
      //console.log("productType :", productType);
      if (!productType) {
        errors.push("Product Type is missing.");
      } else if (
        productType.trim().toLowerCase() !== "jewellery" &&
        productType.trim().toLowerCase() !== "solitaire"
      ) {
        errors.push(
          `Invalid Product Type: ${productType}. Must be 'jewellery' or 'Solitaire'.`
        );
      }

      // Validate "product_code" and fetch details if applicable
      if (productType.trim().toLowerCase() === "jewellery") {
        if (!productCode) {
          errors.push("Product Code is missing.");
        } else {
          try {
            jewellerydetail = await FetchData(productCode.trim().toUpperCase());
            //console.log("Available slabs in jewellerydetail:", jewellerydetail);
            if (!jewellerydetail) {
              errors.push(`Product Code: ${productCode} is not available.`);
            } else if (jewellerydetail.Current_status === "Discarded") {
              errors.push(`Product Code: ${productCode} has been discarded.`);
            } else if (
              jewellerydetail.Current_status === "In-Active" &&
              customerOrder?.order_for === "Stock"
            ) {
              errors.push(
                `Product Code: ${productCode} is inactive and cannot be used for 'Stock' orders.`
              );
            }
          } catch (error) {
            errors.push("Failed to fetch product details for Product Code.");
          }
        }
      }
      //console.log(jewellerydetail);
      // Validate "solitaire_slab" format and range

      // Validate "solitaire_slab" format and range
      if (caratRange) {
        const slabParts = caratRange.split("-");
        if (
          slabParts.length !== 2 ||
          isNaN(parseFloat(slabParts[0])) ||
          isNaN(parseFloat(slabParts[1]))
        ) {
          errors.push(`Invalid solitaire_slab format: ${caratRange}`);
        } else {
          const minCarat = parseFloat(slabParts[0]);
          const maxCarat = parseFloat(slabParts[1]);
          if (minCarat <= 0 || maxCarat <= 0 || minCarat > maxCarat) {
            errors.push(`Invalid carat range in solitaire_slab: ${caratRange}`);
          } else if (!jewellerydetail?.Cts_size_slab.includes(caratRange)) {
            errors.push(
              `Invalid carat range in solitaire_slab for product: ${caratRange}`
            );
          }
        }
      } else {
        errors.push("Solitaire Slab is missing.");
      }

      // Validate starting and ending colors
      if (!colorF || !colorF.trim()) {
        errors.push("Color From is required.");
      } else if (!checkColorAvailability(caratRange, isRound, colorF)) {
        errors.push(`Invalid color From: ${colorF}`);
      }

      // Ensure "colorT" is not blank
      if (!colorT || !colorT.trim()) {
        errors.push("Color To is required.");
      } else {
        const validColorTOptions = getColorTOptions(
          caratRange,
          isRound,
          colorF
        );
        if (!validColorTOptions.includes(colorT)) {
          errors.push(`Invalid color To: ${colorT}`);
        }
      }

      // Validate starting and ending clarity
      // Ensure "clarityF" is not blank
      if (!clarityF || !clarityF.trim()) {
        errors.push("Clarity From is required.");
      } else if (!checkClarityAvailability(caratRange, isRound, clarityF)) {
        errors.push(`Invalid clarity From: ${clarityF}`);
      }

      // Ensure "clarityT" is not blank
      if (!clarityT || !clarityT.trim()) {
        errors.push("Clarity To is required.");
      } else {
        const validClarityTOptions = getClarityTOptions(
          caratRange,
          isRound,
          clarityF
        );
        if (!validClarityTOptions.includes(clarityT)) {
          errors.push(`Invalid clarity To: ${clarityT}`);
        }
      }

      // Validate "metal_color"
      const metalColor = getTrimmedValue("metal_color")?.toUpperCase();
      // Validate if the metal color is non-empty and exists in the list of valid colors
      if (metalColor) {
        const validColors = jewellerydetail?.Metal_color.split(",").map(
          (color) => color.trim().toUpperCase()
        ); // Trim and convert each color name to uppercase
        if (!validColors?.includes(metalColor)) {
          errors.push(`Invalid Metal Color: ${metalColor}`);
        }
      } else {
        errors.push("Metal Color is required.");
      }

      const hasError = errors.length > 0;

      if (!hasError) {
        const exp_dlv_date = customerOrder?.exp_dlv_date
          ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY").isValid()
            ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY")
                .add(dayjs().utcOffset(), "minute")
                .toISOString()
            : new Date().toISOString()
          : new Date().toISOString();

        const payload = {
          order_for: customerOrder?.order_for || "",
          customer_id: customerOrder?.customer_id || 0,
          customer_code: customerOrder?.cust_code || "", //new additation
          customer_name: customerOrder?.cust_name || "",
          customer_branch: customerOrder?.store || "",
          product_type: productType.trim().toLowerCase(), //productType.trim().toLowerCase() === "jewellery"
          order_type: customerOrder?.order_type || "",
          Product_category: jewellerydetail?.Product_category || "",
          product_sub_category: jewellerydetail?.Product_sub_category || "",
          collection: jewellerydetail?.Collection || "",
          exp_dlv_date: exp_dlv_date,
          old_varient: jewellerydetail?.Old_varient || "",
          product_code: jewellerydetail?.Item_number || "",
          solitaire_pcs: 0,
          product_qty: Number(Qty),
          product_amt_min:
            jewellerydetail?.Product_price == null ||
            Number(jewellerydetail?.Product_price) === 0
              ? 0
              : Number(jewellerydetail?.Product_price),
          product_amt_max:
            jewellerydetail?.Product_price == null ||
            Number(jewellerydetail?.Product_price) === 0
              ? 0
              : Number(jewellerydetail?.Product_price),
          solitaire_shape: shape,
          solitaire_slab: caratRange,
          solitaire_color: colorF + "-" + colorT,
          solitaire_quality: clarityF + "-" + clarityT,
          solitaire_prem_size: "",
          solitaire_prem_pct: 0,
          solitaire_amt_min: 0,
          solitaire_amt_max: 0,
          metal_type: "",
          metal_purity: "",
          metal_color: getTrimmedValue("metal_color"),
          metal_weight: 0,
          metal_price: 0,
          mount_amt_min: 0,
          mount_amt_max: 0,
          // size_from:
          //   Number(row["size"]?.toString().trim()) === 0
          //     ? "-"
          //     : row["size"]?.toString().trim() || "",
          size_from:
            row["size"] && !isNaN(Number(row["size"].toString().trim()))
              ? Number(row["size"].toString().trim()) === 0
                ? "-"
                : row["size"].toString().trim()
              : "",
          size_to: "-",
          side_stone_pcs: 0,
          side_stone_cts: 0,
          side_stone_color: "",
          side_stone_quality: "",
          cart_remarks: getTrimmedValue("cart_remarks"),
          order_remarks: "",
          style: jewellerydetail?.Style || "",
          wear_style: jewellerydetail?.Wear_style || "",
          look: jewellerydetail?.Look || "",
          portfolio_type: jewellerydetail?.Portfolio_type || "",
          gender: jewellerydetail?.Gender || "",
        };
        setCartData((prevCartData) => [...prevCartData, payload]);
      }

      mappedDataWithErrors.push({
        ...row,
        errorMessages: hasError ? errors : undefined,
      });
    }

    // Check if there are any errors
    const hasErrors = mappedDataWithErrors.some(
      (row) => row.errorMessages && row.errorMessages.length > 0
    );

    if (hasErrors) {
      setCurrentErrorMessages("Validation failed. Please correct the errors.");
      setIsValidated(false);
      hideLoader();
      setIsModalOpen(true);
    } else {
      setCurrentErrorMessages("Validation successful! All data is valid.");
      setIsValidated(true);
      hideLoader();
      setIsModalOpen(true);
    }

    setExcelData(mappedDataWithErrors); // Update excel data with validation results
  };

  // Handle reset
  const handleReset = () => {
    setExcelData([]);
    setCurrentErrorMessages("");
    setIsValidated(false);
    setIsUploaded(false);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // Handle save
  const handleSave = async () => {
    if (isValidated) {
      console.log("Saving data...", cartData);
      // setCurrentErrorMessages("Data saved successfully." + cartData);
      // setIsModalOpen(true);

      try {
        showLoader();
        await createCart(cartData);
        // notify(res.data.id.toString());
        updateCartCount(isCartCount + cartData.length); // Increment cart count by the number of rows
        notify("All rows submitted successfully!");

        router.push("/cart");
      } catch (err) {
        console.error("Error submitting data:", err);
        notifyErr("An error occurred while submitting the order.");
      } finally {
        hideLoader();
      }
    } else {
      alert("Please validate the data before saving.");
    }
  };

  // Handle close
  const handleClose = () => {
    router.push(`/jewellery`);
  };

  // Define columns explicitly
  const columns: TableColumn<ExcelRow>[] = excelData.length
    ? [
        {
          name: "#",
          selector: (_, index) => (index !== undefined ? index + 1 : 0),
          sortable: false,
          width: "90px",
        },
        ...expectedColumns.map((key) => ({
          //name: key,
          name: columnDisplayNames[key] || key, // Use the display name here
          selector: (row: ExcelRow) => {
            const value = row[key];
            // If the value is an array (e.g., errorMessages), join it into a string
            return Array.isArray(value) ? value.join(", ") : String(value);
          },
          sortable: true,
        })),
        {
          name: "Error Messages",
          selector: (row: ExcelRow) => {
            // Join the errorMessages array into a string or return an empty string if undefined
            return row.errorMessages ? row.errorMessages.join(", ") : "";
          },
          sortable: false,
        },
      ]
    : [];

  // Define conditional row styles
  const conditionalRowStyles = [
    {
      when: (row: ExcelRow) =>
        !!(row.errorMessages && row.errorMessages.length > 0), // Ensures a boolean is returned
      style: {
        //border: "2px solid red", // Red border for rows with errors
        backgroundColor: "#FFEAEA", // Light red background for visibility
      },
    },
  ];

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
        borderRightStyle: "solid",
        borderRightWidth: "1px",
      },
    },
  };

  // Handle cell click to show error
  const onRowClicked = (row: ExcelRow) => {
    //alert(`Row Data: ${JSON.stringify(row)}`);
    const errorMessages = row.errorMessages
      ? row.errorMessages.join(", ")
      : "No errors.";

    // Set the error messages and open the modal
    setCurrentErrorMessages(errorMessages);
    setIsModalOpen(true);
  };

  return (
    <div className="px-2">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-2 mt-2">
        {/* Header */}
        {/* {JSON.stringify(tstdata)} */}
        <div className="flex justify-between items-center my-2 rounded-lg">
          <h1 className="text-2xl font-bold">Bulk Import Page</h1>
          {/* <div className="my-4 text-green-500">{message}</div> */}
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
              <span>Upload</span>
            </button>

            <button
              onClick={handleValidate}
              disabled={!isUploaded}
              className={`px-4 py-2 bg-black text-white rounded-md border border-black flex items-center space-x-2 ${
                !isUploaded
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:text-black"
              } transition-colors`}
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

            <button
              onClick={exportTemplate}
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
              <span>Export Template</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto border">
          <DataTable
            columns={columns}
            data={excelData}
            customStyles={CustomStyles}
            onRowClicked={onRowClicked}
            conditionalRowStyles={conditionalRowStyles}
            //pagination
            responsive
          />
        </div>
      </div>
      {/* Modal for error messages */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-2">Messages</h2>
            <p>{currentErrorMessages}</p>
            <button
              onClick={handleModalClose}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JewelleryBulkImportScreen;
