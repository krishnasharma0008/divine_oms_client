"use client";

import { Button, DropdownCust } from "@/components/common";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
import { useContext, useState } from "react";
import { BinIcon } from "@/components/icons";
import TextArea from "@/components/common/input-text-area";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import NotificationContext from "@/context/notification-context";
import { getJewelleryProductPrice } from "@/api/jewellery-detail";
import LoaderContext from "@/context/loader-context";
import { CartDetail } from "@/interface";
import { createCart } from "@/api/cart";
import LoginContext from "@/context/login-context";
import { useRouter } from "next/navigation";
import { usePremiumSizeAndPercentage } from "@/hook";
import {
  All_Shapes,
  Solus_shape,
  otherRoundColors,
  otherRoundColorsCarat,
  colors,
  Solus_colors,
  clarities,
  claritiesRound,
  claritiesRoundCarat,
  slab,
} from "@/util/constants";
import dayjs from "dayjs";
import MessageModal from "@/components/common/message-modal";
import { formatByCurrencyINR } from "@/util/format-inr";

const shapeMap: Record<string, string> = {
  Round: "RND",
  Princess: "PRN",
  Oval: "OVL",
  Pear: "PER",
  Radiant: "RADQ",
  Cushion: "CUSQ",
  Heart: "HRT",
  Marquise: "MAQ",
};

const RegularConfirmOrderScreen = () => {
  // Access customer data from Zustand store
  const { customerOrder } = useCustomerOrderStore();

  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notify, notifyErr } = useContext(NotificationContext); //
  const { isCartCount, updateCartCount } = useContext(LoginContext);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); //message popup
  const [isMessage, setIsMessage] = useState<string>("");
  const router = useRouter();

  const { getPremiumPercentage, getPremiumSizeOptions } =
    usePremiumSizeAndPercentage();

  const pcsOptions = Array.from({ length: 50 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const [rows, setRows] = useState([
    {
      shape: "",
      size: "",
      colorFrom: "",
      colorTo: "",
      clarityFrom: "",
      clarityTo: "",
      premiumsize: "",
      premiumper: 0,
      pcs: 1,
      min: 0,
      max: 0,
      remarks: "",
      isDynamic: false,
    },
  ]);

  const handleAdd = () => {
    // Check for empty fields in existing rows
    const isAnyRowIncomplete = rows.some((row) =>
      Object.entries(row).some(([key, value]) => {
        if (
          [
            "shape",
            "size",
            "colorFrom",
            "colorTo",
            "clarityFrom",
            "clarityTo",
          ].includes(key) &&
          (!value || value.toString().trim() === "")
        ) {
          return true; // A required field is empty
        }
        return false;
      })
    );

    if (isAnyRowIncomplete) {
      setIsMessage("");
      setIsMessage(
        "Please fill in all required fields before adding a new row."
      );
      setIsCheckoutModalVisible(true);
      return; // Prevent adding a new row
    }

    // Add a new row if all existing rows are complete
    setRows([
      ...rows,
      {
        shape: "",
        size: "",
        colorFrom: "",
        colorTo: "",
        clarityFrom: "",
        clarityTo: "",
        premiumsize: "",
        premiumper: 0,
        pcs: 1,
        min: 0,
        max: 0,
        remarks: "",
        isDynamic: true,
      },
    ]);
  };

  // Function to get color options based on the slab
  const getColorOptions = (shape: string, slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);
    const isSolusShape = Solus_shape.includes(shape);

    const isRound = shape === "Round";
    if (isSolusShape) {
      // 🔹 For Radiant, Cushion, Heart — use Solus colors
      return Solus_colors;
    } else {
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
    }
  };

  const getClarityOptions = (shape: string, slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);
    const isSolusShape = Solus_shape.includes(shape);
    const isRound = shape === "Round";

    if (isSolusShape) {
      // 🔹 For Radiant, Cushion, Heart — use Solus clarities
      return claritiesRoundCarat;
    } else {
      // 🔹 Default logic for other shapes
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
    }
  };

  const getColorTOptions = (colorF: string, shape: string, carat: string) => {
    const colorFIndex = getColorOptions(shape, carat).indexOf(colorF);
    return getColorOptions(shape, carat).filter(
      (_, index) => index >= colorFIndex
    );
  };

  const getClarityTOptions = (
    clarityF: string,
    shape: string,
    carat: string
  ) => {
    const clarityFIndex = getClarityOptions(shape, carat).indexOf(clarityF);
    return getClarityOptions(shape, carat).filter(
      (_, index) => index >= clarityFIndex
    );
  };

  // Remove a row by index
  const handleRemove = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const FetchPrice = async (
    itemgroup: string,
    slab: string,
    shape: string,
    color: string,
    quality: string
  ): Promise<number> => {
    showLoader();
    try {
      const colordata =
        color === "Yellow Vivid"
          ? "VDF"
          : color === "Yellow Intense"
          ? "INY"
          : color;
      // console.log("shape in fetch price : ", shape);
      // console.log("shape code in fetch price : ", shapeMap[shape] || "");
      const response = await getJewelleryProductPrice(
        itemgroup,
        slab,
        //shapedata,
        shapeMap[shape] || "",
        colordata, //color,
        quality
      );
      hideLoader();
      return response.data.price; // Return the price
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
      return 0; // Default to 0 in case of error
    }
  };

  const fetchAndApplyPrice = async (
    minCarat: string,
    maxCarat: string,
    shape: string,
    colorFrom: string,
    colorTo: string,
    clarityFrom: string,
    clarityTo: string,
    premiumper: string,
    pcs: number
  ) => {
    try {
      const colordataFrom =
        colorFrom === "Yellow Vivid"
          ? "VDF"
          : colorFrom === "Yellow Intense"
          ? "INY"
          : colorFrom;

      const colordataTo =
        colorTo === "Yellow Vivid"
          ? "VDF"
          : colorTo === "Yellow Intense"
          ? "INY"
          : colorTo;

      // Fetch prices based on carat range
      const [minPrice, maxPrice] = await Promise.all([
        FetchPrice("SOLITAIRE", minCarat, shape, colordataTo, clarityTo),
        FetchPrice("SOLITAIRE", maxCarat, shape, colordataFrom, clarityFrom),
      ]);

      // Apply premium percentage to the prices
      const premiumMinPrice = minPrice + minPrice * (Number(premiumper) / 100);
      const premiumMaxPrice = maxPrice + maxPrice * (Number(premiumper) / 100);
      console.log("premiumMinPrice : ", premiumMinPrice);
      console.log("premiumMaxPrice : ", premiumMaxPrice);
      console.log("pcs : ", pcs);
      // Adjust the price based on pcs field (number of pieces)
      const min = parseFloat(
        (premiumMinPrice * parseFloat(minCarat) * pcs).toFixed(2)
      );
      const max = parseFloat(
        (premiumMaxPrice * parseFloat(maxCarat) * pcs).toFixed(2)
      );

      return { min, max };
    } catch (error) {
      notifyErr("Failed to fetch prices. Please try again.");
      return { min: 0, max: 0 }; // Return default values in case of an error
    }
  };

  const handleChange = async (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    if (field === "remarks") {
      row.remarks = value;
      setRows(updatedRows);
      return;
    }

    if (field === "size") {
      const filteredPremiumSizeOptions = getPremiumSizeOptions(value);
      console.log(filteredPremiumSizeOptions);
      row.premiumsize = ""; //filteredPremiumSizeOptions[0] || ""; // Set the first premium size option
      row.premiumper = 0; // Reset premium percentage to 0 when size changes
    }

    // Handle premium size change
    if (field === "premiumsize") {
      row.premiumsize = value; // Update the premium size
      const premiumPercentage = getPremiumPercentage(value); // Get premium percentage based on the selected premium size
      row.premiumper = parseFloat(premiumPercentage); // Update premium percentage as a number

      // Ensure the premiumper is a valid number
      if (isNaN(row.premiumper)) {
        row.premiumper = 0; // Set to 0 if premiumPercentage is invalid
      }

      const { shape, size, colorFrom, colorTo, clarityFrom, clarityTo, pcs } =
        row;
      console.log("Row pcs :", pcs);
      if (shape && size && colorFrom && colorTo && clarityFrom && clarityTo) {
        const caratRange = size.split("-");
        const [minCarat, maxCarat] = caratRange;

        const { min, max } = await fetchAndApplyPrice(
          minCarat,
          maxCarat,
          shape,
          colorFrom,
          colorTo,
          clarityFrom,
          clarityTo,
          row.premiumper.toString(),
          pcs
        );

        row.min = min;
        row.max = max;
      }
    }

    // Handle other field changes (shape, size, etc.)
    if (
      field === "shape" ||
      field === "size" ||
      field === "colorFrom" ||
      field === "colorTo" ||
      field === "clarityFrom" ||
      field === "clarityTo"
    ) {
      row[field] = value; // Update the field with the new value

      const { shape, size, colorFrom, colorTo, clarityFrom, clarityTo, pcs } =
        row;

      if (shape && size && colorFrom && colorTo && clarityFrom && clarityTo) {
        const caratRange = size.split("-");
        const [minCarat, maxCarat] = caratRange;

        const { min, max } = await fetchAndApplyPrice(
          minCarat,
          maxCarat,
          shape,
          colorFrom,
          colorTo,
          clarityFrom,
          clarityTo,
          row.premiumper.toString(),
          pcs
        );

        row.min = min;
        row.max = max;
      }
    }

    // Handle pcs field change: Adjust prices based on the number of pieces
    if (field === "pcs") {
      row[field] = parseInt(value, 10);
      const { shape, size, colorFrom, colorTo, clarityFrom, clarityTo, pcs } =
        row;
      //const pcs = parseInt(value, 10); // Ensure pcs is a valid number

      if (
        shape &&
        size &&
        colorFrom &&
        colorTo &&
        clarityFrom &&
        clarityTo &&
        !isNaN(pcs)
      ) {
        const caratRange = size.split("-");
        const [minCarat, maxCarat] = caratRange;

        const { min, max } = await fetchAndApplyPrice(
          minCarat,
          maxCarat,
          shape,
          colorFrom,
          colorTo,
          clarityFrom,
          clarityTo,
          row.premiumper.toString(),
          pcs
        );

        row.min = min;
        row.max = max;
      }
    }

    // Update the state with the modified row
    setRows(updatedRows); // This ensures the row is updated correctly in the state
  };

  const SumitOrder = async () => {
    console.log("Expected date : ", customerOrder?.exp_dlv_date);
    const exp_dlv_date = customerOrder?.exp_dlv_date
      ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY").isValid()
        ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY")
            .add(dayjs().utcOffset(), "minute")
            .toISOString() // Adjust with local timezone offset
        : new Date().toISOString() // fallback to the current date
      : new Date().toISOString();

    console.log("exp_dlv_date:", exp_dlv_date);

    const allPayloads: CartDetail[] = rows
      .filter(
        (row) =>
          row.shape &&
          row.size &&
          row.colorFrom &&
          row.colorTo &&
          row.clarityFrom &&
          row.clarityTo
      )
      .map((row) => ({
        // Populate the payload similar to the current logic
        order_for: customerOrder?.order_for || "",
        customer_id: customerOrder?.customer_id || 0,
        customer_code: customerOrder?.cust_code || "", //new additation
        customer_name: customerOrder?.cust_name || "",
        customer_branch: customerOrder?.store || "",
        product_type: customerOrder?.product_type || "",
        order_type: customerOrder?.order_type || "",
        collection: "", //for diamond
        Product_category: "",
        product_sub_category: "", //new
        style: "", //new
        wear_style: "", //new
        look: "", //new
        portfolio_type: "", //new
        gender: "", //new
        exp_dlv_date: exp_dlv_date,
        old_varient: "",
        product_code: "",
        solitaire_pcs: row.pcs, //new addation
        product_qty: row.pcs,
        product_amt_min: row.min,
        product_amt_max: row.max,
        solitaire_shape: row.shape || "",
        solitaire_slab: row.size || "",
        solitaire_color: `${row.colorFrom} - ${row.colorTo}` || "",
        solitaire_quality: `${row.clarityFrom} - ${row.clarityTo}` || "",
        solitaire_prem_size: row.premiumsize,
        solitaire_prem_pct: row.premiumper,
        solitaire_amt_min: row.min,
        solitaire_amt_max: row.max,
        metal_type: "",
        metal_purity: "",
        metal_color: "",
        metal_weight: 0,
        metal_price: 0,
        mount_amt_min: 0,
        mount_amt_max: 0,
        size_from: "-",
        size_to: "-",
        side_stone_pcs: 0,
        side_stone_cts: 0,
        side_stone_color: "",
        side_stone_quality: "",
        cart_remarks: row.remarks,
        order_remarks: "",
      }));

    console.log(allPayloads);
    try {
      showLoader();
      await createCart(allPayloads);
      //notify(res.data.id.toString());
      updateCartCount(isCartCount + rows.length); // Increment cart count by the number of rows
      notify("All rows submitted successfully!");

      router.push("/cart");
    } catch (err) {
      console.error("Error submitting data:", err);
      notifyErr("An error occurred while submitting the order.");
    } finally {
      hideLoader();
    }
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
  };

  return (
    <>
      <div className="font-body w-full min-h-[calc(100vh_-_96px)] flex flex-col gap-9 rounded overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="w-full rounded-xl bg-white p-4 mx-2 mt-2 shadow-md">
            <div>
              <h2 className="font-medium text-xl pb-4">
                {customerOrder?.store}
              </h2>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/3 flex flex-col">
                <p className="text-[#888]">Contact Detail</p>
                <div className="py-4">
                  <svg
                    className="svg-inline--fa fa-phone-alt fa-w-16"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="phone-alt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    width="12" // Set width
                    height="12" // Set height
                    fill="rgba(0, 0, 0, 0.5)" // Change fill to inherit color from parent
                  >
                    <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
                  </svg>
                  {customerOrder?.contactno}
                </div>
              </div>
              <div className="w-2/3 flex flex-col">
                <p className="text-[#888]">Address</p>
                <div className="py-4">{customerOrder?.address}</div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-2 shadow-md">
            <div className="w-full flex flex-row gap-x-1">
              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Visible Order Type</p>
                <div className="py-2 capitalize">
                  {customerOrder?.product_type}
                </div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Incentive/Deduction</p>
                <div className="py-2">1%</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Delivery</p>
                <div className="py-2">Within 7 working days</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Price List</p>
                <div className="py-2">
                  Price at the time of booking or delivery whichever is lower
                </div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Courier charges</p>
                <div className="py-2">Not charged</div>
              </div>

              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Comments</p>
                <div className="py-2">Invoice will go with 1% credit note</div>
              </div>
            </div>
            {/* <div className="w-1/6 flex flex-col">
              <p className="text-[#888]">Expected Delivery Date</p>
              <div className="py-2">
                {dayjs(customerOrder?.exp_dlv_date).format("DD-MM-YYYY")}
              </div>
            </div> */}
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-2 shadow-md">
            {/* <div>
              <h2 className="font-medium text-2xl pb-4">Select your order</h2>
            </div> */}
            <div className="w-full">
              <table className="w-full table-auto border-collapse border border-gray-200">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-100 text-center">
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Shape
                    </th>
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Size
                    </th>
                    <th className="border border-gray-200 px-1 py1" colSpan={2}>
                      Color
                    </th>
                    <th className="border border-gray-200 px-1 py1" colSpan={2}>
                      Clarity
                    </th>
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Premium Size
                    </th>
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Premium %
                    </th>
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Pcs
                    </th>
                    <th className="border border-gray-200 px-1 py1" colSpan={2}>
                      Range
                    </th>
                    <th className="border border-gray-200 px-1 py1" rowSpan={2}>
                      Remarks
                    </th>
                    <th
                      className="border border-gray-200 px-1 py1"
                      rowSpan={2}
                    ></th>
                  </tr>
                  <tr className="bg-gray-100 text-center">
                    <th className="border border-gray-200 px-1 py1">From</th>
                    <th className="border border-gray-200 px-1 py1">To</th>
                    <th className="border border-gray-200 px-1 py1">From</th>
                    <th className="border border-gray-200 px-1 py1">To</th>
                    <th className="border border-gray-200 px-1 py1">Min</th>
                    <th className="border border-gray-200 px-1 py1">Max</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      {/* Shape */}
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={All_Shapes}
                          value={row.shape}
                          onChange={(value: string) =>
                            handleChange(index, "shape", value)
                          }
                          //error={fieldErrors.shape}
                          classes="w-full"
                        />
                      </td>

                      {/* Size */}
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={slab}
                          value={row.size}
                          onChange={(value: string) =>
                            handleChange(index, "size", value)
                          }
                          //error={fieldErrors.carat}
                          classes="w-full"
                        />
                      </td>

                      {/* Color */}
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={getColorOptions(row.shape, row.size)}
                          //options={getColorTOptions(row.colorFrom, row.shape, row.size)}
                          value={row.colorFrom}
                          onChange={(value) =>
                            handleChange(index, "colorFrom", value)
                          }
                        />
                      </td>
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={getColorTOptions(
                            row.colorFrom,
                            row.shape,
                            row.size
                          )}
                          value={row.colorTo}
                          onChange={(value) =>
                            handleChange(index, "colorTo", value)
                          }
                        />
                      </td>

                      {/* Clarity */}
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={getClarityOptions(row.shape, row.size)}
                          value={row.clarityFrom}
                          onChange={(value) =>
                            handleChange(index, "clarityFrom", value)
                          }
                        />
                      </td>
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          //options={getClarityOptions(row.shape, row.size)}
                          options={getClarityTOptions(
                            row.clarityFrom,
                            row.shape,
                            row.size
                          )}
                          value={row.clarityTo}
                          onChange={(value) =>
                            handleChange(index, "clarityTo", value)
                          }
                        />
                      </td>

                      {/* Premium Size */}
                      <td className="border border-gray-200 ">
                        <DropdownCust
                          label=""
                          options={getPremiumSizeOptions(row.size)} // Filtered based on size
                          value={row.premiumsize} // The current value of premiumsize
                          onChange={(value) => {
                            // Update the premiumsize value in the row
                            handleChange(index, "premiumsize", value);
                          }} // Handle change in premiumsize
                        />
                      </td>

                      {/* Premium % */}
                      <td className="w-10 border border-gray-200">
                        <InputText
                          type="text"
                          value={String(row.premiumper)} // Convert number to string
                          disabled={true}
                          className=" mt-2"
                        />
                      </td>

                      {/* Pcs */}
                      <td className="w-[72px] border border-gray-200 pt-[15px]">
                        <Dropdown
                          label=""
                          variant="outlined"
                          options={pcsOptions}
                          value={row.pcs.toString()}
                          onChange={(value) =>
                            handleChange(index, "pcs", value)
                          }
                          disabled={false}
                          className="w-full"
                        />
                      </td>

                      {/* Min Price */}
                      <td className="w-24 border border-gray-200">
                        <InputText
                          type="text"
                          //label="Min"
                          value={formatByCurrencyINR(row.min)}
                          //onChange={(e) => handleChange(index, "min", e.target.value)}
                          placeholder="Min"
                          className=" mt-2 text-black"
                          disabled={true}
                        />
                      </td>

                      {/* Max Price */}
                      <td className="w-24 border border-gray-200 ">
                        <InputText
                          type="text"
                          placeholder="Max"
                          value={formatByCurrencyINR(row.max)}
                          className=" mt-2 text-black"
                          disabled={true}
                          //onChange={(e) => handleChange(index, "max", e.target.value)}
                        />
                      </td>

                      {/* Remarks */}
                      <td className="border border-gray-200 pt-3">
                        <TextArea
                          value={row.remarks}
                          onChange={(e) =>
                            handleChange(index, "remarks", e.target.value)
                          }
                          rows={1}
                          className="mt-2"
                        />
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-200 ">
                        {/* <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleRemove(index)}
                        >
                          <BinIcon className="cursor-pointer text-red-500" />
                        </button> */}
                        {row.isDynamic && (
                          <div
                            className={`w-6 flex items-center justify-center ${
                              index === 0 ? "cursor-not-allowed opacity-50" : ""
                            }`}
                            onClick={() => {
                              if (index > 0) handleRemove(index); // Allow delete only for rows > 0
                            }}
                          >
                            <BinIcon
                              className={`text-red-500 ${
                                index === 0
                                  ? "pointer-events-none"
                                  : "cursor-pointer"
                              }`}
                            />
                            {index === 0 && (
                              <span className="text-xs text-gray-500 absolute mt-8">
                                Cannot delete the first row
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full bg-slate-200 h-[0.5px]"></div>
            <div className="w-full flex justify-between">
              <Button
                themeType="dark"
                classes="w-40 h-12 text-base"
                onClick={SumitOrder}
              >
                Submit Order
              </Button>
              <Button
                themeType="dark"
                classes="w-40 h-12 text-base"
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
        {/* alert message */}
        {isCheckoutModalVisible && (
          <MessageModal
            title="Error Meaasge"
            //onClose={() => setIsCheckoutModalVisible(false)}
            onConfirm={closeCheckoutModal}
          >
            <p>{isMessage}</p>
          </MessageModal>
        )}
      </div>
    </>
  );
};

export default RegularConfirmOrderScreen;
