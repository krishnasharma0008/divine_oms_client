"use client";

import { Button, DropdownCust } from "@/components/common";
import Dropdown from "@/components/common/dropdown";
import InputText from "@/components/common/input-text";
//import { useSearchParams } from "next/navigation";
//import { useEffect, useState } from "react";
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

const RegularConfirmOrderScreen = () => {
  // Access customer data from Zustand store
  const { customerOrder } = useCustomerOrderStore();

  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notify, notifyErr } = useContext(NotificationContext); //
  const { isCartCount, updateCartCount } = useContext(LoginContext);

  const router = useRouter();

  const shapeoptions = ["Round", "Princess", "Oval", "Pear"];
  const premiumSizeOptions = ["-"];
  const sizeOptions = [
    "0.10-0.13",
    "0.14-0.17",
    "0.18-0.22",
    "0.23-0.29",
    "0.30-0.38",
    "0.39-0.44",
    "0.45-0.49",
    "0.50-0.59",
    "0.60-0.69",
    "0.70-0.79",
    "0.80-0.89",
    "0.90-0.99",
    "1.00-1.23",
    "1.24-1.49",
    "1.50-1.69",
    "1.70-1.99",
    "2.00-2.49",
    "2.50-2.99",
  ];

  //const isRound = shape === "Round"; // Check if the shape is Round

  const otherRoundColors = ["EF", "GH", "IJ"];
  const otherRoundColorsCarat = ["EF", "GH"];
  const colors = ["D", "E", "F", "G", "H", "I", "J", "K"];

  const clarities = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
  const claritiesRound = ["VVS", "VS", "SI"];
  const claritiesRoundCarat = ["VVS", "VS"];

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
      premiumper: "",
      pcs: 1,
      min: 0,
      max: 0,
      remarks: "",
      isDynamic: false,
    },
  ]);

  const handleAdd = () => {
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
        premiumper: "",
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

    if (shape === "Round") {
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

  const getClarityOptions = (shape: string, slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);

    if (shape === "Round") {
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
      const shapedata =
        shape === "Round"
          ? "RND"
          : shape === "Princess"
          ? "PRN"
          : shape === "Oval"
          ? "OVL"
          : shape === "Pear"
          ? "PER"
          : "";
      const response = await getJewelleryProductPrice(
        itemgroup,
        slab,
        shapedata,
        color,
        quality
      );
      hideLoader();
      return response.data.price; // Return the price
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
      return 0; // Default to 0 in case of error
    }
  };

  const handleChange = async (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    // Skip price fetching for remarks field
    if (field === "remarks") {
      updatedRows[index] = {
        ...row,
        [field]: value,
      };
      setRows(updatedRows);
      return; // Early return to skip price fetching logic for remarks
    }

    // Check if all required fields are filled before fetching prices
    const { shape, size, colorFrom, colorTo, clarityFrom, clarityTo } = row;

    if (shape && size && colorFrom && colorTo && clarityFrom && clarityTo) {
      const caratRange = size.split("-");
      const [minCarat, maxCarat] = caratRange;

      try {
        const [minPrice, maxPrice] = await Promise.all([
          FetchPrice("SOLITAIRE", minCarat, shape, colorFrom, clarityFrom),
          FetchPrice("SOLITAIRE", maxCarat, shape, colorTo, clarityTo),
        ]);

        row.min =
          parseFloat(minPrice.toFixed(2)) * parseFloat(minCarat.toString());
        row.max =
          parseFloat(maxPrice.toFixed(2)) * parseFloat(maxCarat.toString());
      } catch (error) {
        notifyErr("Failed to fetch prices. Please try again.");
      }
    }

    if (field === "pcs") {
      const caratRange = row.size.split("-");
      const [minCarat, maxCarat] = caratRange;
      const minPrice = await FetchPrice(
        "SOLITAIRE",
        minCarat,
        row.shape,
        row.colorFrom,
        row.clarityFrom
      );
      const maxPrice = await FetchPrice(
        "SOLITAIRE",
        maxCarat,
        row.shape,
        row.colorTo,
        row.clarityTo
      );
      row.min = parseFloat(
        (minPrice * parseFloat(minCarat) * parseInt(value)).toFixed(2)
      );
      row.max = parseFloat(
        (maxPrice * parseFloat(maxCarat) * parseInt(value)).toFixed(2)
      );
    }

    updatedRows[index] = {
      ...row,
      [field]: value,
    };

    setRows(updatedRows);
  };

  const SumitOrder = async () => {
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
        customer_name: customerOrder?.cust_name || "",
        customer_branch: customerOrder?.store || "",
        product_type: customerOrder?.product_type || "",
        order_type: customerOrder?.order_type || "",
        Product_category: "",
        exp_dlv_date: null,
        old_varient: "",
        product_code: "",
        product_qty: row.pcs,
        product_amt_min: row.min,
        product_amt_max: row.max,
        solitaire_shape: row.shape || "",
        solitaire_slab: row.size || "",
        solitaire_color: `${row.colorFrom} - ${row.colorTo}` || "",
        solitaire_quality: `${row.clarityFrom} - ${row.clarityTo}` || "",
        solitaire_prem_size: row.premiumsize,
        solitaire_prem_pct: parseFloat(row.premiumper ?? 0),
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

    try {
      showLoader();
      await createCart(allPayloads);
      //notify(res.data.id.toString());
      updateCartCount(isCartCount + rows.length); // Increment cart count by the number of rows
      notify("All rows submitted successfully!");

      router.push("/jewellery/jewellery-cart");
    } catch (err) {
      console.error("Error submitting data:", err);
      notifyErr("An error occurred while submitting the order.");
    } finally {
      hideLoader();
    }
  };

  return (
    <>
      <div className="font-body w-full min-h-screen flex flex-col gap-9 rounded overflow-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-5">
          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div>
              <h2 className="font-medium text-2xl pb-4">
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

          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div className="w-full flex flex-row gap-x-4">
              <div className="w-1/6 flex flex-col">
                <p className="text-[#888]">Order Type</p>
                <div className="py-2">{"selectedOrderValue"}</div>
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
          </div>

          <div className="w-full rounded-xl bg-white p-4 mx-6 shadow-md">
            <div>
              <h2 className="font-medium text-2xl pb-4">Select your order</h2>
            </div>
            <div className="flex flex-row gap-x-4 text-center">
              <div className="w-20">
                <p className="text-[#888]">Shape</p>
              </div>
              <div className="w-[136px]">
                <p className="text-[#888]">Size</p>
              </div>
              <div className="w-44">
                <p className="text-[#888]">Color</p>
              </div>

              <div className="w-44">
                <p className="text-[#888]">Clarity</p>
              </div>

              <div className="w-24">
                <p className="text-[#888]">Premium Size</p>
              </div>
              <div className="w-10">
                <p className="text-[#888]">Premium %</p>
              </div>
              <div className="w-20">
                <p className="text-[#888]">Pcs</p>
              </div>
              <div className="w-28">
                <p className="text-[#888]">Range</p>
              </div>
              <div className="w-24">
                <p className="text-[#888]">Remarks</p>
              </div>
            </div>

            {/* Render rows dynamically */}
            {rows.map((row, index) => (
              <div className="flex flex-row gap-x-4" key={index}>
                <div className="w-20">
                  <DropdownCust
                    label=""
                    options={shapeoptions}
                    value={row.shape}
                    onChange={(value: string) =>
                      handleChange(index, "shape", value)
                    }
                    //error={fieldErrors.shape}
                    classes="w-full"
                  />
                </div>
                <div className="w-[136px]">
                  <DropdownCust
                    label=""
                    options={sizeOptions}
                    value={row.size}
                    onChange={(value: string) =>
                      handleChange(index, "size", value)
                    }
                    //error={fieldErrors.carat}
                    classes="w-full"
                  />
                </div>
                <div className="w-20 -mt-5">
                  <DropdownCust
                    label="From"
                    options={getColorOptions(row.shape, row.size)}
                    //options={getColorTOptions(row.colorFrom, row.shape, row.size)}
                    value={row.colorFrom}
                    onChange={(value) =>
                      handleChange(index, "colorFrom", value)
                    }
                  />
                </div>
                <div className="w-20 -mt-5">
                  <DropdownCust
                    label="To"
                    options={getColorTOptions(
                      row.colorFrom,
                      row.shape,
                      row.size
                    )}
                    value={row.colorTo}
                    onChange={(value) => handleChange(index, "colorTo", value)}
                  />
                </div>
                <div className="w-20 -mt-5">
                  <DropdownCust
                    label="From"
                    options={getClarityOptions(row.shape, row.size)}
                    value={row.clarityFrom}
                    onChange={(value) =>
                      handleChange(index, "clarityFrom", value)
                    }
                  />
                </div>
                <div className="w-20 -mt-5">
                  <DropdownCust
                    label="To"
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
                </div>
                <div className="w-24">
                  <DropdownCust
                    label=""
                    options={premiumSizeOptions}
                    value={row.premiumsize}
                    onChange={(value) =>
                      handleChange(index, "premiumsize", value)
                    }
                    //error={fieldErrors.premiumSize}
                    classes="w-full"
                  />
                </div>
                {/* Repeat for clarity, pcs, min, max, remarks */}
                <div className="w-10 mt-2">
                  <InputText
                    type="text"
                    label=""
                    value={row.premiumper}
                    onChange={(e) =>
                      handleChange(index, "premiumper", e.target.value)
                    }
                    className="w-10"
                  />
                </div>
                <div className="w-20 mt-2">
                  <Dropdown
                    label=""
                    variant="outlined"
                    options={pcsOptions}
                    value={row.pcs.toString()}
                    onChange={(value) => handleChange(index, "pcs", value)}
                    disabled={false}
                    className="w-[77px]"
                  />
                </div>
                <div className="w-20 mt-2">
                  <InputText
                    type="text"
                    //label="Min"
                    value={row.min.toString()}
                    //onChange={(e) => handleChange(index, "min", e.target.value)}
                    placeholder="Min"
                    className="w-20"
                  />
                </div>
                <div className="w-20 mt-2">
                  <InputText
                    type="text"
                    placeholder="Max"
                    value={row.max.toString()}
                    //onChange={(e) => handleChange(index, "max", e.target.value)}
                    className="w-20"
                  />
                </div>
                <div className="w-32 mt-2">
                  <TextArea
                    value={row.remarks}
                    onChange={(e) =>
                      handleChange(index, "remarks", e.target.value)
                    }
                    rows={1}
                    className="w-full"
                    containerClass="w-full"
                  />
                </div>

                {row.isDynamic && (
                  <div
                    className="w-6 flex items-center justify-center"
                    onClick={() => handleRemove(index)}
                  >
                    <BinIcon className="cursor-pointer text-red-500" />
                  </div>
                )}
              </div>
            ))}
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
      </div>
    </>
  );
};

export default RegularConfirmOrderScreen;
