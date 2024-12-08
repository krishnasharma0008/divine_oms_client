"use client";

import ImageGallery from "@/components/common/image-gallery";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShoppingCartIcon from "@/components/icons/shopping-cart-icon";
import {
  getJewelleryProductList,
  getJewelleryProductPrice,
} from "@/api/jewellery-detail";
import NotificationContext from "@/context/notification-context";
import { CartDetail, JewelleryDetail } from "@/interface";
import SolitaireCustomisationPopup from "@/components/common/solitaire-customise";
import { formatByCurrencyINR } from "@/util/format-inr";
import LoaderContext from "@/context/loader-context";
import { useRouter } from "next/navigation";
import { useCustomerOrderStore } from "@/store/customerorderStore";
import { createCart } from "@/api/cart";
import { useCartDetailStore } from "@/store/cartDetailStore";
import LoginContext from "@/context/login-context";

interface CustomisationOptions {
  shape: string;
  color: string;
  carat: string;
  clarity: string;
}

function JewelleryDetailScreen() {
  //const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isCartCount, updateCartCount } = useContext(LoginContext); //
  const { customerOrder } = useCustomerOrderStore();
  const { cart, resetCartDetail } = useCartDetailStore();
  const [jewelleryDetails, setJewelleryDetails] = useState<JewelleryDetail>();
  const [metalPurity, setMetalPurity] = useState<string>("");
  const [metalColor, setMetalColor] = useState<string>("");
  const [ringSizeFrom, setRingSizeFrom] = useState<number>(0); // Default start parseInt(jewelleryDetails?.Product_size_from.toString() ?? "")
  const [ringSizeTo, setRingSizeTo] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [customisedData, setCustomisedData] = useState<CustomisationOptions>(); //parseInt(jewelleryDetails?.Product_size_to.toString() ?? "")
  const [soliPriceFrom, setSoliPriceFrom] = useState<number>(0); // Default start parseInt(jewelleryDetails?.Product_size_from.toString() ?? "")
  const [soliPriceTo, setSoliPriceTo] = useState<number>(0);
  const [metalPrice, setMetalPrice] = useState<number>();
  //const [metalPrice, setMetalPriceFrom] = useState<number>();
  const [metalAmtFrom, setMetalAmtFrom] = useState<number>();
  const [sDiaPrice, setSDiaPrice] = useState<number>();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notify, notifyErr } = useContext(NotificationContext);

  const [totalPcs, setTotalPcs] = useState<number>(0);
  const [Metalweight, setMetalweight] = useState<number>(0);
  const [sideDiaTotPcs, setSideDiaTotPcs] = useState<number>(0);
  const [sideDiaTotweight, setSideDiaTotweight] = useState<number>(0);

  const [soliAmtFrom, setSoliAmtFrom] = useState<number>(0);
  const [soliAmtTo, setSoliAmtTo] = useState<number>(0);

  const router = useRouter();

  const [selectedQty, setSelectedQty] = useState<number>(1);

  useEffect(() => {
    if (id && id.trim() !== "") {
      console.log("ID is not empty");
      resetCartDetail();
    }

    const fetchDataAndSetValues = async () => {
      if (cart?.product_code) {
        console.log("Edit Cart data");
        await FetchData(cart?.product_code);
        //console.log("Product Code : 1");
        if (!metalColor) {
          setMetalColor(cart.metal_color || ""); // Set from cart if available
        }
        setMetalPurity(cart.metal_purity || "");
        setRingSizeFrom(Number(cart.size_from)); // Set from cart
        setRingSizeTo(Number(cart.size_to)); // Set from cart
        setSelectedQty(cart.product_qty); // Set from cart

        setCustomisedData({
          shape: cart.solitaire_shape,
          color: cart.solitaire_color,
          carat: cart.solitaire_slab,
          clarity: cart.solitaire_quality,
        });
        // Automatically apply the values to the form (if needed)
        handleApply({
          shape: cart.solitaire_shape,
          color: `${cart.solitaire_color}`, // Assuming color is stored as a string
          carat: cart.solitaire_slab,
          clarity: `${cart.solitaire_quality}`, // Assuming clarity is stored as a string
        });

        setTotalPcs(cart.side_stone_pcs);
        setSideDiaTotPcs(cart.side_stone_pcs);
        setSideDiaTotweight(cart.side_stone_cts); //
        setMetalweight(cart.metal_weight);

        try {
          // Fetch diamond price
          const diamondPrice = await FetchPrice(
            "DIAMOND",
            "",
            "",
            cart.side_stone_color,
            cart.side_stone_quality
          );
          setSDiaPrice(
            parseFloat(
              (diamondPrice * sideDiaTotPcs * (sideDiaTotweight ?? 0)).toFixed(
                2
              )
            ) //
          );

          // Fetch metal price
          const metalPrice = await FetchPrice(
            "GOLD",
            "",
            "",
            cart.metal_color,
            cart.metal_purity
          );
          setMetalPrice(metalPrice);
          setMetalAmtFrom(
            parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2))
          );
          // setMetalPriceFrom(
          //   parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2))
          // );
        } catch (error) {
          notifyErr("Failed to fetch price details.");
        }
      } else {
        if (!id || id.trim() === "") {
          notifyErr("Invalid jewellery ID.");
          return;
        }
        console.log("Add Cart data");

        try {
          await FetchData(id);

          setRingSizeFrom(
            jewelleryDetails?.Product_size_from === "-"
              ? 0
              : Number(jewelleryDetails?.Product_size_from)
          ); // Set from cart
          setRingSizeTo(
            jewelleryDetails?.Product_size_from === "-"
              ? 0
              : Number(jewelleryDetails?.Product_size_to)
          ); // Set from cart

          const totalPcs = jewelleryDetails?.Bom?.filter(
            (item) =>
              item.Item_type === "STONE" && item.Item_group === "SOLITAIRE"
          ).reduce((sum, item) => sum + (item?.Pcs || 0), 0);
          //console.log("totalPcs : ", totalPcs);
          setTotalPcs(totalPcs ?? 0);
          //setSelectedQty(totalPcs ?? 0);

          const Metalweight = jewelleryDetails?.Bom?.filter(
            (item) => item.Item_type === "METAL"
          ).reduce((sum, item) => sum + (item?.Weight || 0), 0);
          console.log("Metalweight : ", Metalweight);
          setMetalweight(Metalweight ?? 0);

          const totalidepcs = jewelleryDetails?.Bom?.filter(
            (item) =>
              item.Item_type === "STONE" && item.Item_group === "DIAMOND"
          ).reduce((sum, item) => sum + (item?.Pcs || 0), 0);

          setSideDiaTotPcs(totalidepcs ?? 0);

          const totalsideweight = jewelleryDetails?.Bom?.filter(
            (item) =>
              item.Item_type === "STONE" && item.Item_group === "DIAMOND"
          ).reduce((sum, item) => sum + (item?.Weight || 0), 0);

          setSideDiaTotweight(totalsideweight ?? 0);

          const diamondPrice = await FetchPrice("DIAMOND", "", "", "IJ", "SI");
          // console.log("sidediapcs : ", totalidepcs);
          // console.log("totalsideweight : ", totalsideweight);
          // console.log("diamondPrice : ", diamondPrice);
          setSDiaPrice(
            diamondPrice * (sideDiaTotPcs ?? 0) * (sideDiaTotweight ?? 0)
          );

          const metalPrice = await FetchPrice(
            "GOLD",
            "",
            "",
            jewelleryDetails?.Metal_color.split(",")[0] ?? "",
            jewelleryDetails?.Metal_purity.split(",")[0] ?? ""
          );
          //console.log("metalPrice :", metalPrice);
          //setMetalColor(jewelleryDetails?.Metal_color || "");
          setMetalPrice(metalPrice);
          setMetalAmtFrom(
            parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2))
          );
          // setMetalPriceFrom(
          //   parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2))
          // );
        } catch (error) {
          notifyErr("Failed to fetch initial data.");
        }
      }
    };

    fetchDataAndSetValues(); // Call the async function
  }, [id, metalColor, cart]);

  const FetchData = async (product_code: string) => {
    //showLoader();
    try {
      const response = await getJewelleryProductList(product_code);
      setJewelleryDetails(response.data.data);
      if (metalColor === "") {
        const defaultColor =
          response.data.data.Metal_color.split(",")[0].trim();
        setMetalColor(defaultColor);
      }
      //setRingSizeFrom(jewelleryDetails?.Product_size_from.toString())
      //console.log("Old_varient : ", jewelleryDetails?.Old_varient);
      hideLoader();
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
    } finally {
      hideLoader();
    }
  };

  const filterByColorAndFormat = (color: string) => {
    const filteredImages = jewelleryDetails?.Images?.filter(
      (image: { color: string; image_url: string[] }) =>
        image.color.toLowerCase() === color.toLowerCase()
    );

    return (
      filteredImages?.flatMap((image: { image_url: string[] }, index: number) =>
        image.image_url.map((url: string, i: number) => ({
          url,
          thumbnailUrl: url,
          title: `Image ${i + 1}`,
          uid: (index * 10 + i).toString(),
        }))
      ) || [] // Ensure we return an empty array if no images match
    );
  };

  const productData = [
    {
      label: "Solitaire",
      value:
        [
          customisedData?.shape ? `${customisedData?.shape} ` : "", // Add space after shape if present
          customisedData?.carat ? `${customisedData?.carat} cts ` : "", // Add space after carat if present
          customisedData?.color ? `${customisedData?.color} ` : "", // Add space after color if present
          customisedData?.clarity ? `${customisedData?.clarity} ` : "", // Add space after clarity if present
        ].join("") || "-", // Join without extra spaces, fallback to "-" if empty
    },
    { label: "Metal Weight", value: Metalweight ?? 0 }, // This already handles the fallback
    {
      label: "Metal",
      value: (metalPurity ?? 0) + " " + (metalColor ?? "-"),
    },
    {
      label: "Ring Size",
      value: `${ringSizeFrom} - ${ringSizeTo}`, // Template literals for clearer formatting
    },
    {
      label: "Side Diamond",
      value: `${sideDiaTotPcs ?? 0}/${sideDiaTotweight ?? 0} cts IJ-SI`, // Template literals for clarity
    },
  ];

  const ringSizes = Array.from({ length: 13 }, (_, i) => i + 4); // Generate sizes 4 to 16

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    setRingSizeFrom(selectedValue);
    if (selectedValue > ringSizeTo) {
      setRingSizeTo(selectedValue); // Ensure "From" doesn't exceed "To"
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    setRingSizeTo(selectedValue);
    if (selectedValue < ringSizeFrom) {
      setRingSizeFrom(selectedValue); // Ensure "To" isn't less than "From"
    }
  };

  const handleMetalPurity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    console.log("Metal Purity : ", selectedValue);
    setMetalPurity(selectedValue);

    const metalPrice = await FetchPrice(
      "GOLD",
      "",
      "",
      metalColor,
      selectedValue ?? ""
    );
    console.log("metalPrice Purity :", metalPrice);
    setMetalPrice(metalPrice);
    setMetalAmtFrom(parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2)));
  };

  const handleMetalColor = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    console.log("Metal Color : ", selectedValue);
    setMetalColor(selectedValue);

    const metalPrice = await FetchPrice(
      "GOLD",
      "",
      "",
      selectedValue,
      metalPurity ?? ""
    );
    console.log("metalPrice color :", metalPrice);
    setMetalPrice(metalPrice);
    setMetalAmtFrom(parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2)));
    //setMetalPriceFrom(parseFloat((metalPrice * (Metalweight ?? 0)).toFixed(2)));
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
      const response = await getJewelleryProductPrice(
        itemgroup,
        slab,
        shape,
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

  const handleApply = async (data: CustomisationOptions) => {
    setCustomisedData(data);
    setIsPopupOpen(false);

    const shape =
      data.shape === "Round"
        ? "RND"
        : data.shape === "Princess"
        ? "PRN"
        : data.shape === "Oval"
        ? "OVL"
        : data.shape === "Pear"
        ? "PER"
        : "";
    const carat = data.carat?.split("-") || ["0", "0"];
    const color = data.color?.split(" - ") || ["", ""];
    const clarity = data.clarity?.split(" - ") || ["", ""];

    try {
      const SolitaireFrom = await FetchPrice(
        "SOLITAIRE",
        carat[0],
        shape,
        color[0],
        clarity[0]
      );
      setSoliPriceFrom(SolitaireFrom);
      const SolitaireTo = await FetchPrice(
        "SOLITAIRE",
        carat[1],
        shape,
        color[1],
        clarity[1]
      );
      setSoliPriceTo(SolitaireTo);

      //console.log("SolitaireFrom", SolitaireFrom);
      setSoliAmtFrom(
        parseFloat(
          (SolitaireFrom * parseFloat(carat[0]) * selectedQty).toFixed(2)
        )
      );
      setSoliAmtTo(
        parseFloat(
          (SolitaireTo * parseFloat(carat[1]) * selectedQty).toFixed(2)
        )
      );
    } catch (error) {
      notifyErr("Failed to fetch price details.");
    }
  };

  const handleCart = async () => {
    const payload: CartDetail = {
      order_for: customerOrder?.order_for || "",
      customer_id: customerOrder?.customer_id || 0,
      customer_name: customerOrder?.cust_name || "",
      customer_branch: customerOrder?.store || "",
      product_type: customerOrder?.product_type || "", //solitaire or jewellery
      order_type: customerOrder?.order_type || "", //new
      Product_category: jewelleryDetails?.Product_category || "", // ring,bracelet,coin new field
      // consignment_type: customerOrder?.consignment_type || "",
      // sale_or_return: customerOrder?.sale_or_return || "",
      // outright_purchase: customerOrder?.outright_purchase !== "",
      // customer_order: customerOrder?.customer_order || "",
      exp_dlv_date: null, //new Date(state.dob || Date.now()).toISOString(),
      old_varient: jewelleryDetails?.Old_varient || "", //new
      product_code: jewelleryDetails?.Item_number || "",
      product_qty: selectedQty,
      product_amt_min: soliAmtFrom + (metalAmtFrom ?? 0) + (sDiaPrice ?? 0),
      product_amt_max: soliAmtTo + (metalAmtFrom ?? 0) + (sDiaPrice ?? 0),
      solitaire_shape: customisedData?.shape || "",
      solitaire_slab: customisedData?.carat || "",
      solitaire_color: customisedData?.color || "",
      solitaire_quality: customisedData?.clarity || "",
      solitaire_prem_size: "",
      solitaire_prem_pct: 0,
      solitaire_amt_min: soliAmtFrom,
      solitaire_amt_max: soliAmtTo,
      metal_type: "GOLD", //eg gold,silver
      metal_purity: metalPurity || "",
      metal_color: metalColor,
      metal_weight: Metalweight ?? 0,
      metal_price: metalPrice ?? 0,
      mount_amt_min: (metalAmtFrom ?? 0) + (sDiaPrice ?? 0), //new
      mount_amt_max: (metalAmtFrom ?? 0) + (sDiaPrice ?? 0), //new
      size_from: ringSizeFrom === 0 ? "-" : ringSizeFrom.toString(), //ringSizeFrom.toString() || "",
      size_to: ringSizeTo === 0 ? "-" : ringSizeTo.toString(),
      side_stone_pcs: Number(sideDiaTotPcs),
      side_stone_cts: Number(sideDiaTotweight),
      side_stone_color: "IJ",
      side_stone_quality: "SI",
      cart_remarks: cart?.product_code !== "" ? cart?.cart_remarks || "" : "",
      order_remarks: cart?.order_remarks || "",
    };
    console.log(payload);
    if (cart?.product_code) {
      payload.id = cart.id as number;
    }
    showLoader();
    try {
      const res = await createCart(payload); // Await the response
      if (id && id.trim() !== "") {
        notify("Cart created successfully");
        updateCartCount(isCartCount + 1);
      } else {
        notify("Cart updated successfully");
      }
      console.log("Cart created successfully", res.data.id);

      router.push("/jewellery/jewellery-cart");
    } catch (err) {
      console.log("Error creating cart", err);
      notifyErr(err as string);
    } finally {
      hideLoader(); // Ensure the loader is hidden in any case
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQty = Number(e.target.value);
    if (newQty <= 0) {
      notifyErr("Quantity must be at least 1.");
      return;
    }

    const carat = customisedData?.carat?.split("-") || ["0", "0"];

    setSelectedQty(newQty);
    console.log("soliPriceFrom", soliPriceFrom);
    console.log("soliPriceTo", soliPriceTo);
    setSoliAmtFrom(
      parseFloat(
        (soliPriceFrom * parseFloat(carat[0]) * newQty * totalPcs).toFixed(2)
      )
    );
    setSoliAmtTo(
      parseFloat(
        (soliPriceTo * parseFloat(carat[0]) * newQty * totalPcs).toFixed(2)
      )
    );
  };

  return (
    <div className="flex bg-white">
      {/* Image Gallery Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <ImageGallery images={filterByColorAndFormat(metalColor)} />
        <div className="mt-8 mb-2 border-gray border-y-2">
          <div className="flex-1 text-left mx-1 rounded-lg">
            <h3 className="text-lg font-semibold underline text-blue-600">
              Product Details
            </h3>
            {productData.map((item, index) => (
              <div
                key={index}
                className="p-2 mb-2 flex justify-between items-center"
              >
                <span className="w-1/2 text-left">{item.label}&nbsp;:</span>
                <span className="w-1/2 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white p-4 w-1/2 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">
            Product Code:{" "}
            <span className="font-semibold">
              {jewelleryDetails?.Item_number}
            </span>
          </h2>
          <div className="flex items-center space-x-2">
            <label className="block font-medium text-gray-700">QTY</label>
            <select
              className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
              value={selectedQty}
              onChange={handleQtyChange}
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full p-4 mb-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Divine Solitaire</h2>
            <div className="text-lg">
              <span className="font-semibold">
                {formatByCurrencyINR(soliAmtFrom ?? 0)} apx -{" "}
              </span>
              <span className="font-semibold">
                {formatByCurrencyINR(soliAmtTo ?? 0)} apx
              </span>
            </div>
          </div>

          <div className="w-full p-4 bg-[#F9F6ED] border border-gray-300 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg mb-2">
                  <span>Shape : </span>
                  <span className="font-semibold">{customisedData?.shape}</span>
                </div>
                <div className="text-lg mb-2">
                  <span>Color : </span>
                  <span className="font-semibold">{customisedData?.color}</span>
                </div>
              </div>
              <div>
                <div className="text-lg mb-2">
                  <span>Carat : </span>
                  <span className="font-semibold">{customisedData?.carat}</span>
                </div>
                <div className="text-lg mb-2">
                  <span>Clarity : </span>
                  <span className="font-semibold">
                    {customisedData?.clarity}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="my-4">
            *The jewellery available in{" "}
            {`${jewelleryDetails?.Product_range_from_min} to ${jewelleryDetails?.Product_range_to_max} carat range. Solitaire Pcs ${totalPcs}`}
          </p>
          <div className="flex justify-between items-center mb-2">
            <h2
              className="text-lg text-blue-600 cursor-pointer"
              onClick={() => setIsPopupOpen(true)}
            >
              Customise your Divine Solitaire
            </h2>
            <div className="text-lg underline text-blue-600"></div>
          </div>
        </div>

        <div className="w-full p-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Divine Mount</h2>
            <div className="text-lg">
              <span className="font-semibold">
                {formatByCurrencyINR((metalAmtFrom ?? 0) + (sDiaPrice ?? 0))}{" "}
                apx
              </span>{" "}
              -
              <span className="font-semibold">
                {" "}
                {formatByCurrencyINR(
                  (metalAmtFrom ?? 0) + (sDiaPrice ?? 0)
                )}{" "}
                apx
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <label className="block text-lg font-medium text-gray-700">
                Metal Color
              </label>

              {/* {jewelleryDetails?.Metal_purity} */}
              <select
                className="w-38 p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                value={metalPurity}
                onChange={handleMetalPurity}
              >
                {jewelleryDetails?.Metal_purity.split(",").map(
                  (item: string, index) => (
                    <option key={index} value={item}>
                      <span>{item.trim()}</span>
                    </option>
                  )
                )}
              </select>
              <select
                className="w-38 p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                value={metalColor}
                onChange={handleMetalColor}
              >
                {jewelleryDetails?.Metal_color.split(",").map(
                  (item: string, index) => (
                    <option key={index} value={item}>
                      <span>{item.trim()}</span>
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="text-lg">
              <span>Metal Weight : </span>
              <span className="font-semibold">{Metalweight} gms</span>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-4">
              {jewelleryDetails?.Product_size_from !== "-" &&
                jewelleryDetails?.Product_size_to !== "-" && (
                  <>
                    {/* Ring Size From */}
                    <div className="flex items-center space-x-2">
                      <label className="block text-lg font-medium text-gray-700">
                        From:
                      </label>
                      <select
                        className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                        value={ringSizeFrom}
                        onChange={handleFromChange}
                      >
                        <option value="-">-</option>
                        {ringSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ring Size To */}
                    <div className="flex items-center space-x-2">
                      <label className="block text-lg font-medium text-gray-700">
                        To:
                      </label>
                      <select
                        className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                        value={ringSizeTo}
                        onChange={handleToChange}
                      >
                        <option value="-">-</option>
                        {ringSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
            </div>
          </div>
          {jewelleryDetails?.Product_size_from !== "-" &&
            jewelleryDetails?.Product_size_to !== "-" && (
              <div className="flex items-center">
                <div className="inline-flex">
                  <label className="block text-lg font-medium text-gray-700"></label>
                  <p className="text-sm text-gray-600 mt-2">
                    Ring Size OP Range :{jewelleryDetails?.Product_size_from} to{" "}
                    {jewelleryDetails?.Product_size_to}.
                  </p>
                </div>
              </div>
            )}
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div className="text-lg">
                <span>Side Daimond :</span>
                <span className="font-semibold">
                  {sideDiaTotPcs}/ {sideDiaTotweight.toFixed(2)} &nbsp;cts IJ-SI
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full space-x-2 justify-end">
          <div className="w-full p-2 my-4">
            <div className="p-2 my-4 border border-black rounded-lg">
              <div className="flex justify-between items-center text-center">
                <h2 className="text-sm">Min</h2>
                <h2 className="text-sm">Max</h2>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-lg">
                  <span className="font-semibold">
                    {formatByCurrencyINR(
                      soliAmtFrom + (metalAmtFrom ?? 0) + (sDiaPrice ?? 0)
                    )}{" "}
                    apx
                  </span>
                </div>
                <div className="text-lg">
                  <span className="font-semibold">
                    {formatByCurrencyINR(
                      soliAmtTo + (metalAmtFrom ?? 0) + (sDiaPrice ?? 0)
                    )}{" "}
                    apx
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-4 my-4 flex items-center justify-center space-x-2">
            <button
              className="w-full flex items-center p-2 py-4 bg-black text-white rounded-lg space-x-2 justify-center"
              onClick={handleCart}
            >
              <ShoppingCartIcon />
              <span className="text-lg font-semibold">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popup */}
      <SolitaireCustomisationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onApply={handleApply}
        cts_slab={jewelleryDetails?.Cts_size_slab ?? []}
        customisedData={customisedData}
      />
    </div>
  );
}

export default JewelleryDetailScreen;
