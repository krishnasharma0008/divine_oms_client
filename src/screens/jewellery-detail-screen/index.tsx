"use client";

import ImageGallery from "@/components/common/image-gallery";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { useCustomerOrderStore } from "@/store/customerorderStore";
import { createCart, EditCart } from "@/api/cart";
import { useCartDetailStore } from "@/store/cartDetailStore";
import LoginContext from "@/context/login-context";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import MessageModal from "@/components/common/message-modal";
import AutoClosePopup from "@/components/common/auto-close-popup";

dayjs.extend(customParseFormat);

interface CustomisationOptions {
  shape: string;
  color: string;
  carat: string;
  clarity: string;
  premiumSize?: string;
  premiumPercentage?: string;
  variantId?: number;
}

function JewelleryDetailScreen() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const formType = searchParams.get("ftype");

  const { isCartCount, updateCartCount } = useContext(LoginContext); //
  const { customerOrder } = useCustomerOrderStore();
  const cart = useCartDetailStore((state) => state.cart);

  const resetCartDetail = useCartDetailStore((state) => state.resetCartDetail);

  const [jewelleryDetails, setJewelleryDetails] = useState<JewelleryDetail>();
  const [metalPurity, setMetalPurity] = useState<string>("");
  const [metalColor, setMetalColor] = useState<string>("");
  const [ringSizeFrom, setRingSizeFrom] = useState<number>(0); // Default start parseInt(jewelleryDetails?.Product_size_from.toString() ?? "")

  const [baseCarat, setBaseCarat] = useState<string>("");
  const [baseRingSize, setBaseRingSize] = useState<number>(0);
  const [baseGoldweight, setBaseGoldweight] = useState<number>(0);
  const [basePlatinumweight, setBasePlatinumweight] = useState<number>(0);
  const [baseMetalweight, setBaseMetalweight] = useState<number>(0);
  const [baseSideDiaTotPcs, setBaseSideDiaTotPcs] = useState<number>(0);
  const [baseSideDiaTotweight, setBaseSideDiaTotweight] = useState<number>(0);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [customisedData, setCustomisedData] = useState<CustomisationOptions>(); //parseInt(jewelleryDetails?.Product_size_to.toString() ?? "")
  const [soliPriceFrom, setSoliPriceFrom] = useState<number>(0); // Default start parseInt(jewelleryDetails?.Product_size_from.toString() ?? "")
  const [soliPriceTo, setSoliPriceTo] = useState<number>(0);
  const [metalPrice, setMetalPrice] = useState<number>();
  const [metalAmtFrom, setMetalAmtFrom] = useState<number>();
  const [sDiaPrice, setSDiaPrice] = useState<number>();
  const [sDiaAmt, setSDiaAmt] = useState<number>();
  const { showLoader, hideLoader } = useContext(LoaderContext);
  const { notify, notifyErr } = useContext(NotificationContext);
  const [totalPcs, setTotalPcs] = useState<number>(0);
  const [Goldweight, setGoldweight] = useState<number>(0);
  const [Platinumweight, setPlatinumweight] = useState<number>(0);
  const [Metalweight, setMetalweight] = useState<number>(0);
  const [sideDiaTotPcs, setSideDiaTotPcs] = useState<number>(0);
  const [sideDiaTotweight, setSideDiaTotweight] = useState<number>(0);

  const [soliAmtFrom, setSoliAmtFrom] = useState<number>(0);
  const [soliAmtTo, setSoliAmtTo] = useState<number>(0);

  const sideDiaColorClarityOption = ["IJ-SI", "GH-VS", "EF-VVS"];

  const [sideDiaColorClarity, setSideDiaColorClarity] = useState<string>(
    sideDiaColorClarityOption[0]
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); //auto close popup

  const router = useRouter();

  const [selectedQty, setSelectedQty] = useState<number>(1);

  //const ringSizes = Array.from({ length: 23 }, (_, i) => i + 4); // Generate sizes 4 to 26
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false); //message popup
  const [isMessageTitle, setIsMessageTitle] = useState<string>("");
  const [isMessage, setIsMessage] = useState<string>(""); //

  const generateRingSizes = (min: number, max: number) => {
    const step = 0.5;
    const count = Math.floor((max - min) / step) + 1;
    return Array.from(
      { length: count },
      (_, i) => +(min + i * step).toFixed(1)
    );
  };

  useEffect(() => {
    // if (GetMsg() !== "") {
    setIsModalOpen(true); // Open modal on page load
    //}
  }, []);

  const FetchData = async (product_code: string) => {
    showLoader();
    try {
      const response = await getJewelleryProductList(product_code);
      setJewelleryDetails(response.data.data);

      const defaultColor = response.data.data.Metal_color.split(",")[0].trim();
      setMetalColor(defaultColor);

      const defaultPurity =
        response.data.data.Metal_purity.split(",")[0].trim();
      setMetalPurity(defaultPurity);

      hideLoader();
    } catch (error) {
      console.error("Failed to fetch jewellery details:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching data for ID:", id);
    console.log("ID has changed:", id);
    FetchData(String(id));
  }, []); // Dependency on `id`

  const GetDefaultShape = (): string => {
    const DefaultShape: string[] =
      jewelleryDetails?.Variants.filter(
        (variant) => variant.Is_base_variant === 1
      ).reduce((acc: string[], variant) => {
        const matchingBom = jewelleryDetails?.Bom.filter(
          (bomItem) =>
            bomItem.Variant_id === variant.Variant_id &&
            bomItem.Item_group === "SOLITAIRE" &&
            bomItem.Item_type === "STONE"
        );

        const names = matchingBom.map((bomItem) => bomItem.Bom_variant_name);
        return acc.concat(names);
      }, []) || [];

    const distinctShapes: string[] = [
      ...new Set(
        DefaultShape.map((name) => name?.split("-")[1]).filter(Boolean)
      ),
    ];
    // Pick the first distinct shape if any
    const shapeCode = distinctShapes[0];

    const shapeMap: Record<string, string> = {
      RND: "Round",
      PRN: "Princess",
      OVL: "Oval",
      PER: "Pear",
      RADQ: "Radiant",
      CUSQ: "Cushion",
      HRT: "Heart",
      MAQ: "Marquise",
    };

    const shape = shapeMap[shapeCode] || "";

    return shape;
  };

  const GetMsg = () => {
    // Count the number of matching rows
    const RowCount = jewelleryDetails?.Variants.filter(
      (variant) => variant.Is_base_variant === 1
    ).reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_group === "SOLITAIRE" &&
          bomItem.Item_type === "STONE"
      );
      return acc + matchingBom.length; // Count rows
    }, 0);

    return RowCount;
  };
  const ChkMsg = () => {
    const RowCount = GetMsg();
    const totPcs = totalPcs; //GetPcs("SOLITAIRE", "STONE");
    //console.log("RowCount :", RowCount);
    if (Number(RowCount) > 1) {
      return "This is multi size - solitaire product";
    } else if (Number(totPcs) > 1) {
      return "This is multi - solitaire product";
    } else {
      return "";
    }
  };

  const GetWeight = (Item_group: string, Item_type: string) => {
    return jewelleryDetails?.Variants.filter(
      (variant) => variant.Is_base_variant === 1
    ).reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_group === Item_group &&
          bomItem.Item_type === Item_type
      );
      // Sum up Pcs from the matching Bom items (if Pcs is a number)
      const total = matchingBom.reduce(
        (sum, bomItem) => sum + (bomItem.Weight || 0),
        0
      );
      return acc + total;
    }, 0);
  };

  const GetPcs = (Item_group: string, Item_type: string) => {
    return jewelleryDetails?.Variants.filter(
      (variant) => variant.Is_base_variant === 1
    ).reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_group === Item_group &&
          bomItem.Item_type === Item_type
      );
      // Sum up Pcs from the matching Bom items (if Pcs is a number)
      const total = matchingBom.reduce(
        (sum, bomItem) => sum + (bomItem.Pcs || 0),
        0
      );
      return acc + total;
    }, 0);
  };

  const getbaseSizeCarat = () => {
    //console.log("working");
    if (jewelleryDetails?.Product_size_from !== "-") {
      const baseVariantSizes = jewelleryDetails?.Variants.filter(
        (item) => item.Is_base_variant === 1
      ).map((item) => Number(item.Size)); // Map the sizes (assuming 'size' is the property for size)

      const baseVariantCarat = jewelleryDetails?.Variants.filter(
        (item) => item.Is_base_variant === 1
      ).map((item) => item.Solitaire_slab);

      const defaultSize =
        baseVariantSizes && baseVariantSizes.length > 0
          ? baseVariantSizes[0]
          : 0;

      const defaultCarat =
        baseVariantCarat && baseVariantCarat.length > 0
          ? baseVariantCarat[0]
          : "";
      setRingSizeFrom(defaultSize);
      setBaseCarat(defaultCarat);
      setBaseRingSize(defaultSize); //variant size where Is_base_variant = 1
    }
  };

  // const handleEditCart = async () => {
  //   console.log("Edit cart data : ", cart?.product_code);
  //   console.log("Cart from store:", cart);
  //   if (cart?.product_code) {
  //     getbaseSizeCarat();

  //     const totalPcs = GetPcs("SOLITAIRE", "STONE");
  //     //console.log("Total pcs : ", totalPcs);
  //     setTotalPcs(totalPcs ?? 0);

  //     const goldWeight = GetWeight("GOLD", "METAL");
  //     setBaseGoldweight(goldWeight ?? 0);
  //     setGoldweight(goldWeight ?? 0);

  //     const platinumWeight = GetWeight("PLATINUM", "METAL");
  //     setBasePlatinumweight(platinumWeight ?? 0);
  //     setPlatinumweight(platinumWeight ?? 0);

  //     const Metalweight = (goldWeight ?? 0) + (platinumWeight ?? 0);
  //     setBaseMetalweight(Metalweight ?? 0);
  //     setMetalweight(Metalweight ?? 0);

  //     const totalsidepcs = GetPcs("DIAMOND", "STONE");
  //     setBaseSideDiaTotPcs(totalsidepcs ?? 0);
  //     //setSideDiaTotPcs(totalsidepcs ?? 0);

  //     const totalsideweight = GetWeight("DIAMOND", "STONE");
  //     setBaseSideDiaTotweight(totalsideweight ?? 0);
  //     //setSideDiaTotweight(totalsideweight ?? 0);

  //     //if (!metalColor) {
  //     console.log("Metal color from cart: ", cart.metal_color);
  //     if (cart.metal_color !== "" && cart.metal_color !== null) {
  //       setMetalColor(cart.metal_color || ""); // Set from cart if available
  //     }

  //     const defaultPurity =
  //       cart.metal_purity === ""
  //         ? jewelleryDetails?.Metal_purity.split(",")[0].trim()
  //         : cart.metal_purity;

  //     setMetalPurity(defaultPurity ?? "");

  //     setRingSizeFrom(Number(cart.size_from)); // Set from cart
  //     setSelectedQty(cart.product_qty); // Set from cart

  //     setTotalPcs(cart.solitaire_pcs);

  //     setSideDiaTotPcs(
  //       cart.side_stone_pcs === 0 ? Number(totalsidepcs) : cart.side_stone_pcs
  //     );
  //     setSideDiaTotweight(
  //       cart.side_stone_cts === 0
  //         ? Number(totalsideweight)
  //         : cart.side_stone_cts
  //     ); //

  //     const sideDiaColorClarity = `${cart.side_stone_color}-${cart.side_stone_quality}`;
  //     setSideDiaColorClarity(sideDiaColorClarity);
  //     setMetalweight(cart.metal_weight === 0 ? Metalweight : cart.metal_weight);

  //     setMetalPrice(cart.metal_price); //new
  //     setMetalAmtFrom(cart.mount_amt_max);

  //     setCustomisedData({
  //       shape: cart.solitaire_shape,
  //       color: cart.solitaire_color,
  //       carat: cart.solitaire_slab,
  //       clarity: cart.solitaire_quality,
  //       premiumSize: cart.solitaire_prem_size,
  //       premiumPercentage: cart.solitaire_prem_pct.toString(),
  //     });
  //     // Automatically apply the values to the form (if needed)
  //     handleApply({
  //       shape: cart.solitaire_shape,
  //       color: cart.solitaire_color, // Assuming color is stored as a string
  //       carat: cart.solitaire_slab,
  //       clarity: cart.solitaire_quality, // Assuming clarity is stored as a string
  //       premiumSize: cart.solitaire_prem_size,
  //       premiumPercentage: cart.solitaire_prem_pct.toString(),
  //     });
  //   }
  // };

  const handleEditCart = async () => {
    console.log("Edit cart data : ", cart?.product_code);
    console.log("Cart from store:", cart);
    if (!cart?.product_code) return;

    getbaseSizeCarat();

    const totalPcs = GetPcs("SOLITAIRE", "STONE");
    setTotalPcs(totalPcs ?? 0);

    const goldWeight = GetWeight("GOLD", "METAL");
    setBaseGoldweight(goldWeight ?? 0);
    setGoldweight(goldWeight ?? 0);

    const platinumWeight = GetWeight("PLATINUM", "METAL");
    setBasePlatinumweight(platinumWeight ?? 0);
    setPlatinumweight(platinumWeight ?? 0);

    const Metalweight = (goldWeight ?? 0) + (platinumWeight ?? 0);
    setBaseMetalweight(Metalweight ?? 0);
    setMetalweight(Metalweight ?? 0);

    const totalsidepcs = GetPcs("DIAMOND", "STONE");
    setBaseSideDiaTotPcs(totalsidepcs ?? 0);

    const totalsideweight = GetWeight("DIAMOND", "STONE");
    setBaseSideDiaTotweight(totalsideweight ?? 0);

    console.log("Metal color from cart: ", cart.metal_color);
    if (cart.metal_color) {
      setMetalColor(cart.metal_color);
    }

    const defaultPurity =
      cart.metal_purity === ""
        ? jewelleryDetails?.Metal_purity.split(",")[0].trim()
        : cart.metal_purity;

    setMetalPurity(defaultPurity ?? "");

    setRingSizeFrom(Number(cart.size_from));
    setSelectedQty(cart.product_qty);

    setTotalPcs(cart.solitaire_pcs);

    setSideDiaTotPcs(
      cart.side_stone_pcs === 0 ? Number(totalsidepcs) : cart.side_stone_pcs
    );
    setSideDiaTotweight(
      cart.side_stone_cts === 0 ? Number(totalsideweight) : cart.side_stone_cts
    );

    const sideDiaColorClarity = `${cart.side_stone_color}-${cart.side_stone_quality}`;
    setSideDiaColorClarity(sideDiaColorClarity);
    setMetalweight(cart.metal_weight === 0 ? Metalweight : cart.metal_weight);

    // Optional: temporarily show old values
    // setMetalPrice(cart.metal_price);
    // setMetalAmtFrom(cart.mount_amt_max);

    setCustomisedData({
      shape: cart.solitaire_shape,
      color: cart.solitaire_color,
      carat: cart.solitaire_slab,
      clarity: cart.solitaire_quality,
      premiumSize: cart.solitaire_prem_size,
      premiumPercentage: cart.solitaire_prem_pct.toString(),
    });

    handleApply({
      shape: cart.solitaire_shape,
      color: cart.solitaire_color,
      carat: cart.solitaire_slab,
      clarity: cart.solitaire_quality,
      premiumSize: cart.solitaire_prem_size,
      premiumPercentage: cart.solitaire_prem_pct.toString(),
    });

    // NEW: recompute metal + side diamond amounts for current state
    await CalculateMetalAmount(
      cart.metal_color || metalColor,
      defaultPurity || metalPurity,
      goldWeight ?? 0,
      platinumWeight ?? 0,
      cart.product_qty || 1,
      "Edit Cart"
    );

    await calculateSideDiamondPrice(
      cart.side_stone_cts === 0 ? Number(totalsideweight) : cart.side_stone_cts,
      sideDiaColorClarity,
      cart.product_qty || 1
    );
  };

  const handleAddCart = async () => {
    // Handle add cart logic here
    try {
      getbaseSizeCarat();

      const totalPcs = GetPcs("SOLITAIRE", "STONE");
      setTotalPcs(totalPcs ?? 0);

      const goldWeight = GetWeight("GOLD", "METAL");
      setBaseGoldweight(goldWeight ?? 0);
      setGoldweight(goldWeight ?? 0);

      const platinumWeight = GetWeight("PLATINUM", "METAL");
      setBasePlatinumweight(platinumWeight ?? 0);
      setPlatinumweight(platinumWeight ?? 0);

      const Metalweight = (goldWeight ?? 0) + (platinumWeight ?? 0);
      setBaseMetalweight(Metalweight ?? 0);
      setMetalweight(Metalweight ?? 0);

      const totalsidepcs = GetPcs("DIAMOND", "STONE");
      setBaseSideDiaTotPcs(totalsidepcs ?? 0);
      setSideDiaTotPcs(totalsidepcs ?? 0);

      const totalsideweight = GetWeight("DIAMOND", "STONE"); //GetMetalWeight("STONE", "DIAMOND");
      setBaseSideDiaTotweight(totalsideweight ?? 0);
      setSideDiaTotweight(totalsideweight ?? 0);

      calculateSideDiamondPrice(
        totalsideweight ?? 0,
        sideDiaColorClarity,
        selectedQty
      );

      CalculateMetalAmount(
        metalColor,
        metalPurity,
        goldWeight ?? 0,
        platinumWeight ?? 0,
        selectedQty,
        "Add Cart"
      );
    } catch (error) {
      notifyErr("Failed to fetch initial data.");
    }
  };

  useEffect(() => {
    console.log("Form Type :", formType);
    if (jewelleryDetails) {
      if (formType === "new") {
        //resetCartDetail();
        handleAddCart();
      } else if (formType === "Edit") {
        handleEditCart();
      } else {
        console.log("Unknown form type");
      }
    } else {
      console.log("Jewellery details not loaded yet");
    }
  }, [jewelleryDetails]);

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

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSizeSlab = e.target.value;
    setRingSizeFrom(Number(selectedSizeSlab));
    CalculateDivineMountDetails(
      String(customisedData?.carat),
      Number(selectedSizeSlab),
      selectedQty ?? 1
    );
  };

  // const CalculateDivineMountDetails = async (
  //   carat: string,
  //   size: number,
  //   qty: number
  // ) => {
  //   console.log("Carat : ", carat);
  //   console.log("Size : ", size);
  //   console.log("Qty : ", qty);
  //   console.log("Default Size : ", baseRingSize);
  //   const adjustPercent = 3 / 100; // Adjustment percentage as a decimal
  //   let sizeDifference = 0;

  //   // Filter variants by size
  //   const filteredSize = jewelleryDetails?.Variants?.filter((variant) => {
  //     //console.log("Variant Size:", variant.Size, "Expected Size:", size);
  //     return Number(variant.Size) === size; // Ensure numeric comparison
  //   });

  //   console.log("Filter Size:", filteredSize);

  //   // Handle case where size is not found
  //   if (!filteredSize?.length) {
  //     console.warn(
  //       "No matching size found. Falling back to default size:",
  //       baseRingSize
  //     );
  //     sizeDifference = size - baseRingSize; // Calculate size difference (positive or negative)
  //     carat = baseCarat;
  //     size = baseRingSize; // Use default size
  //   }

  //   // Filter variants by carat and size
  //   const filteredVariants = jewelleryDetails?.Variants.filter(
  //     (variant) =>
  //       variant.Solitaire_slab.trim() === carat.trim() && // Exact match for Solitaire_slab
  //       Number(variant.Size) === size // Numeric comparison for Size
  //   );

  //   console.log("Filter variants by carat and size ", filteredVariants);
  //   // Calculate Metal Weight
  //   const goldWeight = filteredVariants?.reduce((acc, variant) => {
  //     const matchingBom = jewelleryDetails?.Bom?.filter(
  //       (bomItem) =>
  //         bomItem.Variant_id === variant.Variant_id &&
  //         bomItem.Item_type === "METAL" &&
  //         bomItem.Item_group === "GOLD"
  //     );

  //     const total = matchingBom?.reduce(
  //       (sum, bomItem) => sum + (bomItem?.Weight || 0),
  //       0
  //     );

  //     return acc + (total || 0);
  //   }, 0);

  //   console.log("Gold Wt : ", goldWeight);

  //   const platinumWeight = filteredVariants?.reduce((acc, variant) => {
  //     const matchingBom = jewelleryDetails?.Bom?.filter(
  //       (bomItem) =>
  //         bomItem.Variant_id === variant.Variant_id &&
  //         bomItem.Item_type === "METAL" &&
  //         bomItem.Item_group === "PLATINUM"
  //     );

  //     const total = matchingBom?.reduce(
  //       (sum, bomItem) => sum + (bomItem?.Weight || 0),
  //       0
  //     );

  //     return acc + (total || 0);
  //   }, 0);

  //   // Adjust Metal Weight based on size difference
  //   let adjustedGoldWeight = goldWeight ?? 0;
  //   if (!filteredSize?.length && goldWeight) {
  //     const adjustment = goldWeight * adjustPercent * sizeDifference;
  //     adjustedGoldWeight += adjustment;
  //   }

  //   let adjustedPlatinumWeight = platinumWeight ?? 0;
  //   if (!filteredSize?.length && platinumWeight) {
  //     const adjustment = platinumWeight * adjustPercent * sizeDifference;
  //     adjustedPlatinumWeight += adjustment;
  //   }

  //   const adjustedMetalWeight =
  //     (adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight) +
  //     (adjustedPlatinumWeight === 0
  //       ? basePlatinumweight
  //       : adjustedPlatinumWeight);
  //   //console.log("Final Metal Weight:", adjustedMetalWeight);
  //   setGoldweight(
  //     adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight
  //   );
  //   setPlatinumweight(
  //     adjustedPlatinumWeight === 0 ? basePlatinumweight : adjustedPlatinumWeight
  //   );
  //   setMetalweight(
  //     adjustedMetalWeight === 0 ? baseMetalweight : adjustedMetalWeight
  //   );

  //   // Calculate Total Side Diamond Pcs
  //   const totalsidepcs = filteredVariants?.reduce((acc, variant) => {
  //     const matchingBom = jewelleryDetails?.Bom?.filter(
  //       (bomItem) =>
  //         bomItem.Variant_id === variant.Variant_id &&
  //         bomItem.Item_type === "STONE" &&
  //         bomItem.Item_group === "DIAMOND"
  //     );

  //     const total = matchingBom?.reduce(
  //       (sum, bomItem) => sum + (bomItem?.Pcs || 0),
  //       0
  //     );

  //     return acc + (total || 0);
  //   }, 0);

  //   //console.log("Total Side Diamond Pcs: ", totalsidepcs);
  //   setSideDiaTotPcs(
  //     totalsidepcs === 0 ? baseSideDiaTotPcs ?? 0 : totalsidepcs ?? 0
  //   );

  //   // Calculate Total Side Diamond Weight
  //   const totalsideweight = filteredVariants?.reduce((acc, variant) => {
  //     const matchingBom = jewelleryDetails?.Bom?.filter(
  //       (bomItem) =>
  //         bomItem.Variant_id === variant.Variant_id &&
  //         bomItem.Item_type === "STONE" &&
  //         bomItem.Item_group === "DIAMOND"
  //     );

  //     const total = matchingBom?.reduce(
  //       (sum, bomItem) => sum + (bomItem?.Weight || 0),
  //       0
  //     );

  //     return acc + (total || 0);
  //   }, 0);

  //   setSideDiaTotweight(
  //     totalsideweight === 0 ? baseSideDiaTotweight ?? 0 : totalsideweight ?? 0
  //   );

  //   calculateSideDiamondPrice(
  //     totalsideweight === 0 ? baseSideDiaTotweight ?? 0 : totalsideweight ?? 0,
  //     sideDiaColorClarity,
  //     qty
  //   );

  //   CalculateMetalAmount(
  //     metalColor,
  //     metalPurity,
  //     adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight,
  //     adjustedPlatinumWeight === 0
  //       ? basePlatinumweight
  //       : adjustedPlatinumWeight,
  //     qty ?? 1,
  //     "Divine Mount"
  //   );
  // };

  const CalculateDivineMountDetails = async (
    carat: string,
    size: number,
    qty: number
  ) => {
    console.log("Carat : ", carat);
    console.log("Size : ", size);
    console.log("Qty : ", qty);
    console.log("Default Size : ", baseRingSize);

    const adjustPercent = 3 / 100; // Adjustment percentage as a decimal
    let sizeDifference = 0;

    // Normalize inputs
    let currentCarat = (carat || "").trim();
    const selectedPurity = metalPurity.trim().toUpperCase();
    const selectedQty = qty || 1;

    // Filter variants by size
    const filteredSize = jewelleryDetails?.Variants?.filter((variant) => {
      return Number(variant.Size) === size;
    });

    console.log("Filter Size:", filteredSize);

    // If no variant for this size, fall back to base size + base carat
    if (!filteredSize?.length) {
      console.warn(
        "No matching size found. Falling back to default size:",
        baseRingSize
      );
      sizeDifference = size - baseRingSize; // positive or negative
      currentCarat = baseCarat.trim();
      size = baseRingSize;
    }

    // Filter variants by carat and size
    const filteredVariants = jewelleryDetails?.Variants.filter(
      (variant) =>
        variant.Solitaire_slab.trim() === currentCarat &&
        Number(variant.Size) === size
    );

    console.log("Filter variants by carat and size ", filteredVariants);

    // If still nothing, and carat is base, fallback to base weights without adjustment
    if (!filteredVariants?.length && currentCarat === baseCarat.trim()) {
      console.warn(
        "No matching variant for carat/size. Using base metal weights without adjustment."
      );
      setGoldweight(baseGoldweight);
      setPlatinumweight(basePlatinumweight);
      setMetalweight(baseMetalweight);

      setSideDiaTotPcs(baseSideDiaTotPcs ?? 0);
      setSideDiaTotweight(baseSideDiaTotweight ?? 0);

      await calculateSideDiamondPrice(
        baseSideDiaTotweight ?? 0,
        sideDiaColorClarity,
        selectedQty
      );

      await CalculateMetalAmount(
        metalColor,
        metalPurity,
        baseGoldweight,
        basePlatinumweight,
        selectedQty,
        "Divine Mount (Base Fallback)"
      );
      return;
    }

    // 1) Restrict variants to current metalPurity
    const purityMatchedVariants =
      filteredVariants?.filter(
        (v) => v.Metal_purity?.trim().toUpperCase() === selectedPurity
      ) || [];

    // 2) GOLD weight for current purity
    const goldWeight = purityMatchedVariants.reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom?.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_type === "METAL" &&
          bomItem.Item_group === "GOLD"
      );

      const total = matchingBom?.reduce(
        (sum, bomItem) => sum + (bomItem?.Weight || 0),
        0
      );

      return acc + (total || 0);
    }, 0);

    console.log("Gold Wt : ", goldWeight);

    // 3) PLATINUM weight for current purity
    const platinumWeight = purityMatchedVariants.reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom?.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_type === "METAL" &&
          bomItem.Item_group === "PLATINUM"
      );

      const total = matchingBom?.reduce(
        (sum, bomItem) => sum + (bomItem?.Weight || 0),
        0
      );

      return acc + (total || 0);
    }, 0);

    // 4) Optional size‑difference adjustment (only when size fallback happened)
    let adjustedGoldWeight = goldWeight ?? 0;
    if (!filteredSize?.length && goldWeight) {
      const adjustment = goldWeight * adjustPercent * sizeDifference;
      adjustedGoldWeight += adjustment;
    }

    let adjustedPlatinumWeight = platinumWeight ?? 0;
    if (!filteredSize?.length && platinumWeight) {
      const adjustment = platinumWeight * adjustPercent * sizeDifference;
      adjustedPlatinumWeight += adjustment;
    }

    const adjustedMetalWeight =
      (adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight) +
      (adjustedPlatinumWeight === 0
        ? basePlatinumweight
        : adjustedPlatinumWeight);

    setGoldweight(
      adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight
    );
    setPlatinumweight(
      adjustedPlatinumWeight === 0 ? basePlatinumweight : adjustedPlatinumWeight
    );
    setMetalweight(
      adjustedMetalWeight === 0 ? baseMetalweight : adjustedMetalWeight
    );

    // 5) Side diamond Pcs
    const totalsidepcs = purityMatchedVariants.reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom?.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_type === "STONE" &&
          bomItem.Item_group === "DIAMOND"
      );

      const total = matchingBom?.reduce(
        (sum, bomItem) => sum + (bomItem?.Pcs || 0),
        0
      );

      return acc + (total || 0);
    }, 0);

    setSideDiaTotPcs(
      totalsidepcs === 0 ? baseSideDiaTotPcs ?? 0 : totalsidepcs ?? 0
    );

    // 6) Side diamond weight
    const totalsideweight = purityMatchedVariants.reduce((acc, variant) => {
      const matchingBom = jewelleryDetails?.Bom?.filter(
        (bomItem) =>
          bomItem.Variant_id === variant.Variant_id &&
          bomItem.Item_type === "STONE" &&
          bomItem.Item_group === "DIAMOND"
      );

      const total = matchingBom?.reduce(
        (sum, bomItem) => sum + (bomItem?.Weight || 0),
        0
      );

      return acc + (total || 0);
    }, 0);

    setSideDiaTotweight(
      totalsideweight === 0 ? baseSideDiaTotweight ?? 0 : totalsideweight ?? 0
    );

    await calculateSideDiamondPrice(
      totalsideweight === 0 ? baseSideDiaTotweight ?? 0 : totalsideweight ?? 0,
      sideDiaColorClarity,
      selectedQty
    );

    // 7) Final metal amount for current purity
    await CalculateMetalAmount(
      metalColor,
      metalPurity,
      adjustedGoldWeight === 0 ? baseGoldweight : adjustedGoldWeight,
      adjustedPlatinumWeight === 0
        ? basePlatinumweight
        : adjustedPlatinumWeight,
      selectedQty,
      "Divine Mount"
    );
  };

  const handleMetalPurity = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    console.log("Metal Purity : ", selectedValue);
    setMetalPurity(selectedValue);

    CalculateMetalAmount(
      metalColor,
      selectedValue,
      Goldweight,
      Platinumweight,
      selectedQty,
      "Metal Purity"
    );
  };

  const handleMetalColor = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setMetalColor(selectedValue);
    // alert("Called from metal color ");
    console.log("Called from metal color ", selectedValue);
    CalculateMetalAmount(
      selectedValue,
      metalPurity,
      Goldweight,
      Platinumweight,
      selectedQty,
      "Metal Color"
    );
  };

  const getValidPurity = (metal: string, purity: string): string => {
    // For Gold, check if purity is within the expected range (10KT to 22KT)
    if (metal.toLowerCase() === "gold") {
      if (purity === "950PT") {
        return "18KT";
      }
    }
    return purity;
  };

  const getMetalColor = (metal: string, color: string): string => {
    //console.log("Metal color:", color);
    // Normalize inputs
    const normalizedMetal = metal.trim().toLowerCase();
    const normalizedColor = color.trim().toLowerCase();

    let validColor = "";

    // Handle platinum cases
    if (normalizedMetal === "platinum") {
      validColor = "White"; // For Platinum, always return White regardless of the color description
    }
    // Handle gold cases
    else if (normalizedMetal === "gold") {
      if (
        normalizedColor.includes("yellow gold") ||
        normalizedColor.includes("yellow")
      ) {
        validColor = "Yellow"; // If the color includes "yellow gold", return Yellow
      } else if (
        normalizedColor.includes("rose gold") ||
        normalizedColor.includes("rose")
      ) {
        validColor = "Rose"; // If the color includes "rose gold", return Rose
      } else if (
        normalizedColor.includes("white gold") ||
        normalizedColor.includes("white")
      ) {
        validColor = "White"; // Default to Yellow if other color is unspecified
      }
    }

    return validColor;
  };

  const CalculateMetalAmount = async (
    metalColor: string,
    metalPurity: string,
    goldWeight: number,
    platinumWeight: number,
    qty: number,
    from: string
  ) => {
    try {
      console.log(from);
      console.log("Metal color:", metalColor);
      console.log("Metal purity:", metalPurity);
      console.log("Gold weight:", goldWeight);
      console.log("Platinum weight:", platinumWeight);

      // Basic validation
      if (!metalColor || !metalPurity) {
        setMetalAmtFrom(0);
        setMetalPrice(0);
        return;
      }

      // Pre-process
      const goldColor = metalColor.includes("+")
        ? getMetalColor("GOLD", metalColor)
        : metalColor;

      const selectedQty = qty > 0 ? qty : 1;

      let goldPrice = 0;
      let platinumPrice = 0;

      // Gold pricing
      if (goldWeight > 1) {
        goldPrice = await FetchPrice(
          "GOLD",
          "",
          "",
          goldColor,
          getValidPurity("gold", metalPurity)
        );
      } else if (goldWeight > 0 && goldWeight <= 1) {
        goldPrice = Number(jewelleryDetails?.Metal_price_lessonegms) || 0;
      }

      // Platinum pricing
      if (platinumWeight > 0) {
        platinumPrice = await FetchPrice(
          "PLATINUM",
          "",
          "",
          getMetalColor("PLATINUM", metalColor),
          metalPurity
        );
      }

      console.log("Gold Price : ", goldPrice);
      console.log("platinum Price : ", platinumPrice);
      // Calculations
      let goldAmount =
        goldWeight > 0 ? goldWeight * goldPrice * selectedQty : 0;

      const platinumAmount =
        platinumWeight > 0 ? platinumWeight * platinumPrice * selectedQty : 0;

      // logic for less than or equal to 1 gm
      if (goldWeight > 0 && goldWeight <= 1) {
        goldAmount = Number(jewelleryDetails?.Metal_price_lessonegms) || 0;
      }

      // Minimum gold amount rule
      // if (
      //   goldWeight > 0 &&
      //   goldWeight <= 1 &&
      //   goldPrice > 0 &&
      //   goldAmount < 7800
      // ) {
      //   goldAmount = 7800;
      // }

      console.log("Gold Amt : ", goldAmount);
      console.log("platinum Amt : ", platinumWeight);
      const totalMetalAmount = goldAmount + platinumAmount;
      const metalWeight = (goldWeight ?? 0) + (platinumWeight ?? 0);

      setMetalAmtFrom(totalMetalAmount);
      console.log("Total Metal Amt : ", totalMetalAmount);
      console.log("Metal Weight : ", metalWeight);

      // if (metalWeight > 0) {
      //   setMetalPrice(totalMetalAmount / metalWeight);
      // } else {
      //   setMetalPrice(0);
      // }
      let perGram = 0;
      //if (Metalweight > 0) {
      perGram = totalMetalAmount / metalWeight;
      setMetalPrice(Number(perGram.toFixed(2)));
      console.log("Metal Price per gm : ", perGram);
      //} else {
      //  setMetalPrice(0);
      //}
      console.log("Metal Price per gm : ", perGram);
    } catch (error) {
      console.error("Error in CalculateMetalAmount:", error);
      setMetalAmtFrom(0);
      setMetalPrice(0);
    }
  };

  // const CalculateMetalAmount = async (
  //   metalColor: string,
  //   metalPurity: string,
  //   goldWeight: number,
  //   platinumWeight: number,
  //   qty: number,
  //   from: string
  // ) => {
  //   try {
  //      console.log(from);
  //     // console.log("Metal color : ", metalColor);
  //     // console.log("Metal purity : ", metalPurity);
  //     // console.log("Gold weight : ", goldWeight);
  //     // console.log("Platinum weight : ", platinumWeight);
  //     // Fetch prices for GOLD and PLATINUM if they exist
  //     let goldPrice = 0;
  //     let platinumPrice = 0;

  //     if (goldWeight > 0 && goldWeight > 1) {
  //       goldPrice = await FetchPrice(
  //         "GOLD",
  //         "",
  //         "",
  //         metalColor.includes("+")
  //           ? getMetalColor("GOLD", metalColor)
  //           : metalColor,
  //         getValidPurity("gold", metalPurity)
  //       );
  //     } else if (goldWeight > 0 && goldWeight <= 1) {
  //       goldPrice = Number(jewelleryDetails?.Metal_price_lessonegms) || 0;
  //     }
  //     //console.log("goldPrice : ", goldPrice);
  //     if (platinumWeight > 0) {
  //       platinumPrice = await FetchPrice(
  //         "PLATINUM",
  //         "",
  //         "",
  //         getMetalColor("PLATINUM", metalColor),
  //         metalPurity
  //       );
  //     }

  //     //const qty = selectedQty || 1;
  //     const selectedQty = qty || 1;
  //     // Calculate amounts for available metals
  //     let goldAmount =
  //       goldWeight > 0 ? goldWeight * goldPrice * selectedQty : 0;
  //     const platinumAmount =
  //       platinumWeight > 0 ? platinumWeight * platinumPrice * selectedQty : 0;

  //     // Apply minimum gold amount condition
  //     if (goldWeight <= 1 && goldAmount < 7800) {
  //       goldAmount = 7800;
  //     }

  //     const totalMetalAmount = goldAmount + platinumAmount;
  //     const Metalweight = (goldWeight ?? 0) + (platinumWeight ?? 0);
  //     setMetalAmtFrom(totalMetalAmount);
  //     if (Metalweight > 0) {
  //       setMetalPrice(totalMetalAmount / Metalweight);
  //     }
  //   } catch (error) {
  //     console.error("Error in CalculateMetalAmount:", error);
  //   }
  // };

  const calculateSideDiamondPrice = async (
    totalsideweight: number | null,
    sideDiaColorClarity: string,
    qty: number
  ) => {
    try {
      const [color, clarity] = sideDiaColorClarity.split("-");

      const diamondPrice = await FetchPrice("DIAMOND", "", "", color, clarity);
      setSDiaPrice(diamondPrice);

      const selectedQty = qty || 1;

      if (totalsideweight && !isNaN(diamondPrice)) {
        const sideDiamondPrice = diamondPrice * totalsideweight * selectedQty;
        //console.log("Total Side amt : ", sideDiamondPrice);
        setSDiaAmt(sideDiamondPrice);
      } else {
        console.error("Invalid side diamond pieces or weight.");
        setSDiaAmt(0);
      }
    } catch (error) {
      console.error("Error fetching diamond price:", error);
      setSDiaAmt(0);
    }
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

  const getSolitaireColor = (color: string): string => {
    if (color === "Yellow Vivid") {
      return "VDY";
    } else if (color === "Yellow Intense") {
      return "INY";
    }
    return color;
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
        : data.shape === "Radiant"
        ? "RADQ"
        : data.shape === "Cushion"
        ? "CUSQ"
        : data.shape === "Heart"
        ? "HRT"
        : "";

    const carat = data.carat?.split("-") || ["0", "0"];
    const color = data.color?.split("-") || ["", ""];
    const clarity = data.clarity?.split("-") || ["", ""];

    const qty = selectedQty || 1;

    let SolitaireFrom;
    let SolitaireTo;

    try {
      if (Number(GetMsg()) > 1) {
        //console.log("variantId :", data.variantId);

        const bomList = jewelleryDetails?.Bom?.filter(
          (b) =>
            String(b.Variant_id) === String(data.variantId) &&
            b.Item_group?.trim().toUpperCase() === "SOLITAIRE" &&
            b.Item_type?.trim().toUpperCase() === "STONE"
        );
        //console.log("bomList :", bomList);
        let amountFrom = 0;
        let amountTo = 0;

        for (const bom of bomList || []) {
          const parts = bom.Bom_variant_name.trim()
            .split("-")
            .map((p) => p.trim());
          // Example: SOL-RND-0.39-0.44----
          const bomCaratFrom = parseFloat(parts[2]) || 0;
          const bomCaratTo = parseFloat(parts[3]) || 0;
          //let bomcolor = parts[4] || "";
          //let bomclarity = parts[5] || "";
          //const bomqty = bom.Pcs || 1;
          let bomcolorMin = "";
          let bomcolorMax = "";
          let bomclarityMin = "";
          let bomclarityMax = "";

          if (
            (parts[1] === "PER" || parts[1] === "PRN" || parts[1] === "OVL") &&
            parseFloat(parts[2]) >= 0.1 &&
            parseFloat(parts[3]) <= 0.17
          ) {
            // FANCY SHAPE CARAT FROM 0.10 TO 0.13 = GH/VS
            console.log("1 part");
            bomcolorMin = "GH";
            bomcolorMax = "EF";
            bomclarityMin = "VS";
            bomclarityMax = "VVS";
            //console.log("bomcolor : ", bomcolor, " bomclarity : ", bomclarity);
          } else if (
            (parts[1] === "PER" || parts[1] === "PRN" || parts[1] === "OVL") &&
            parseFloat(parts[2]) >= 0.18 &&
            parseFloat(parts[3]) <= 0.22
          ) {
            // FANCY SHAPE CARAT FROM 0.18 TO 0.22 = GH/VS
            console.log("2 part");
            bomcolorMin = "K";
            bomcolorMax = "D";
            bomclarityMin = "SI1";
            bomclarityMax = "IF";
          } else if (
            parts[1] === "RND" &&
            parseFloat(parts[2]) >= 0.1 &&
            parseFloat(parts[3]) <= 0.17
          ) {
            // SHAPE IS ROUND CARAT FROM 0.10 TO 0.13 = IJ/VS
            console.log("3 part");
            bomcolorMin = "IJ";
            bomcolorMax = "EF";
            bomclarityMin = "SI";
            bomclarityMax = "VVS";
          } else if (
            parts[1] === "RND" &&
            parseFloat(parts[2]) >= 0.18 &&
            parseFloat(parts[3]) <= 0.22
          ) {
            // SHAPE IS ROUND CARAT FROM 0.18 TO 0.22 = K-SI2
            console.log("4 part");
            bomcolorMin = "K";
            bomcolorMax = "D";
            bomclarityMin = "SI2";
            bomclarityMax = "IF";
          }

          let priceFrom = 0;
          let priceTo = 0;

          priceFrom = await FetchPrice(
            "SOLITAIRE",
            String(bomCaratFrom),
            parts[1], //shape,
            parseFloat(carat[0]) === bomCaratFrom
              ? getSolitaireColor(color[1])
              : getSolitaireColor(bomcolorMin),
            parseFloat(carat[0]) === bomCaratFrom ? clarity[1] : bomclarityMin
          );

          priceTo = await FetchPrice(
            "SOLITAIRE",
            String(bomCaratTo),
            parts[1],
            parseFloat(carat[0]) === bomCaratFrom
              ? getSolitaireColor(color[0])
              : getSolitaireColor(bomcolorMax),
            parseFloat(carat[0]) === bomCaratFrom ? clarity[0] : bomclarityMax
          );

          const premiumPercentage = Number(data.premiumPercentage ?? 0);
          const premiumMinPrice =
            priceFrom + priceFrom * (premiumPercentage / 100);
          const premiumMaxPrice = priceTo + priceTo * (premiumPercentage / 100);

          const pcs = Number(bom.Pcs) || 1;
          //const bomCaratRange = bom?.Weight ?? 0;

          amountFrom += premiumMinPrice * bomCaratFrom * qty * pcs;
          amountTo += premiumMaxPrice * bomCaratTo * qty * pcs;

          console.log(
            `Bom: ${bom.Bom_variant_name}, From: ${bomCaratFrom}cts @${priceFrom} , To: ${bomCaratTo}cts @${priceTo} , Pcs: ${pcs}`
          );
        }

        setSoliAmtFrom(parseFloat(amountFrom.toFixed(2)));
        setSoliAmtTo(parseFloat(amountTo.toFixed(2)));
      } else {
        SolitaireFrom = await FetchPrice(
          "SOLITAIRE",
          carat[0],
          shape,
          getSolitaireColor(color[1]),
          clarity[1]
        );
        setSoliPriceFrom(SolitaireFrom);

        SolitaireTo = await FetchPrice(
          "SOLITAIRE",
          carat[1],
          shape,
          getSolitaireColor(color[0]),
          clarity[0]
        );
        setSoliPriceTo(SolitaireTo);
        // Default to 0 if premiumPercentage is invalid or not provided
        const premiumPercentage = Number(data.premiumPercentage ?? 0);
        const premiumMinPrice =
          SolitaireFrom + SolitaireFrom * (Number(premiumPercentage) / 100);
        const premiumMaxPrice =
          SolitaireTo + SolitaireTo * (Number(premiumPercentage) / 100);

        const total_solitaire_pcs = totalPcs || 1; // totalPcs || 1;

        setSoliAmtFrom(
          parseFloat(
            (
              premiumMinPrice *
              parseFloat(carat[0]) *
              qty *
              total_solitaire_pcs
            ).toFixed(2)
          )
        );
        setSoliAmtTo(
          parseFloat(
            (
              premiumMaxPrice *
              parseFloat(carat[1]) *
              qty *
              total_solitaire_pcs
            ).toFixed(2)
          )
        );
      }
    } catch (error) {
      console.error("Error fetching price details:", error);
      notifyErr("Failed to fetch price details.");
    }

    console.log("Selected ringsize edit :", ringSizeFrom);
    console.log(
      "Selected Qty edit :",
      formType === "new" ? Number(ringSizeFrom) : Number(cart?.size_from)
    );
    console.log("Selected Carat edit :", data.carat);

    if (formType === "new") {
      if (
        jewelleryDetails?.Product_size_from &&
        jewelleryDetails?.Product_size_from !== "-"
      ) {
        CalculateDivineMountDetails(
          String(data.carat?.trim()), // ensure trimmed
          formType === "new" ? Number(ringSizeFrom) : Number(cart?.size_from),
          qty ?? 1
        );
      }
    }
  };

  const handleCart = async () => {
    // 1) Ensure latest metal amount & price
    // await CalculateMetalAmount(
    //   metalColor,
    //   metalPurity,
    //   Goldweight,
    //   Platinumweight,
    //   selectedQty,
    //   "Before Save"
    // );

    // 2) Validate metal weight and amount
    if (Goldweight + Platinumweight <= 0) {
      setIsMessageTitle("Error Message");
      setIsMessage(
        "Metal weight is not calculated. Please reselect size/metal."
      );
      setIsCheckoutModalVisible(true);
      return;
    }

    if (!metalAmtFrom || metalAmtFrom <= 0) {
      setIsMessageTitle("Error Message");
      setIsMessage("Metal amount is not calculated. Please try again.");
      setIsCheckoutModalVisible(true);
      return;
    }

    if (!metalPrice || metalPrice <= 0) {
      setIsMessageTitle("Error Message");
      setIsMessage("Metal price is invalid. Please recalculate and retry.");
      setIsCheckoutModalVisible(true);
      return;
    }

    if (jewelleryDetails?.Current_status === "Discarded") {
      setIsMessageTitle("");
      setIsMessage("");
      setIsMessageTitle("Restriction Message");
      setIsMessage("Product Code is Discarded");
      setIsCheckoutModalVisible(true);
      return;
    }
    if (
      jewelleryDetails?.Current_status === "In-Active" &&
      customerOrder?.order_for === "Stock"
    ) {
      setIsMessageTitle("");
      setIsMessage("");
      setIsMessageTitle("Restriction Message");
      setIsMessage("Product Code is In-Active");
      setIsCheckoutModalVisible(true);
      return;
    }

    if (
      !(
        jewelleryDetails?.Product_sub_category === "Solitaire Coin" ||
        jewelleryDetails?.Product_sub_category === "Locket"
      )
    ) {
      if (
        !(
          customisedData?.shape?.trim() &&
          customisedData?.carat?.trim() &&
          customisedData?.color?.trim() &&
          customisedData?.clarity?.trim()
        )
      ) {
        setIsMessageTitle("Error Message");
        setIsMessage("Customise solitaire to add in cart.");
        setIsCheckoutModalVisible(true);
        return;
      }
    }
    if (
      jewelleryDetails?.Product_price == null ||
      Number(jewelleryDetails?.Product_price) === 0
    ) {
      if (metalPrice == null || metalPrice <= 0) {
        setIsMessageTitle("");
        setIsMessage("");
        setIsMessageTitle("Error Message");
        setIsMessage("Metal price must be greater than 0 to proceed.");
        setIsCheckoutModalVisible(true);
        return;
      }
    }
    const exp_dlv_date = customerOrder?.exp_dlv_date
      ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY").isValid()
        ? dayjs(customerOrder.exp_dlv_date, "DD-MM-YYYY")
            .add(dayjs().utcOffset(), "minute")
            .toISOString()
        : new Date().toISOString() // fallback to the current date
      : new Date().toISOString();

    const payload: CartDetail = {
      order_for: customerOrder?.order_for || "",
      customer_id: customerOrder?.customer_id || 0,
      customer_code: customerOrder?.cust_code || "", //new additation
      customer_name: customerOrder?.cust_name || "",
      customer_branch: customerOrder?.store || "",
      product_type: customerOrder?.product_type || "",
      order_type: customerOrder?.order_type || "",
      Product_category: jewelleryDetails?.Product_category || "",
      product_sub_category: jewelleryDetails?.Product_sub_category || "", //new
      collection: jewelleryDetails?.Collection || "",
      exp_dlv_date: exp_dlv_date,
      old_varient: jewelleryDetails?.Old_varient || "",
      product_code: jewelleryDetails?.Item_number || "",
      solitaire_pcs: totalPcs, //new additation
      product_qty: selectedQty,
      product_amt_min:
        jewelleryDetails?.Product_price == null ||
        Number(jewelleryDetails?.Product_price) === 0
          ? soliAmtFrom + (metalAmtFrom ?? 0) + (sDiaAmt ?? 0)
          : Number(jewelleryDetails?.Product_price),
      product_amt_max:
        jewelleryDetails?.Product_price == null ||
        Number(jewelleryDetails?.Product_price) === 0
          ? soliAmtTo + (metalAmtFrom ?? 0) + (sDiaAmt ?? 0)
          : Number(jewelleryDetails?.Product_price),
      solitaire_shape: customisedData?.shape || "",
      solitaire_slab: customisedData?.carat || "",
      solitaire_color: customisedData?.color || "",
      solitaire_quality: customisedData?.clarity || "",
      solitaire_prem_size: customisedData?.premiumSize || "",
      solitaire_prem_pct: Number(customisedData?.premiumPercentage) || 0,
      solitaire_amt_min: soliAmtFrom,
      solitaire_amt_max: soliAmtTo,
      metal_type: metalPurity === "950PT" ? "PLATINUM" : "GOLD",
      metal_purity: metalPurity || "",
      metal_color: metalColor,
      metal_weight: Metalweight ?? 0,
      metal_price: metalPrice ?? 0,
      mount_amt_min: (metalAmtFrom ?? 0) + (sDiaAmt ?? 0),
      mount_amt_max: (metalAmtFrom ?? 0) + (sDiaAmt ?? 0),
      size_from:
        ringSizeFrom == null || isNaN(ringSizeFrom)
          ? ""
          : ringSizeFrom === 0
          ? "-"
          : ringSizeFrom.toString(),
      size_to: "-", //ringSizeTo === 0 ? "-" : ringSizeTo.toString(),
      side_stone_pcs: Number(sideDiaTotPcs),
      side_stone_cts: Number(sideDiaTotweight),
      side_stone_color:
        Number(sideDiaTotPcs) === 0 ? "" : sideDiaColorClarity.split("-")[0],
      side_stone_quality:
        Number(sideDiaTotPcs) === 0 ? "" : sideDiaColorClarity.split("-")[1],
      cart_remarks: cart?.cart_remarks || "",
      order_remarks: cart?.order_remarks || "",
      style: jewelleryDetails?.Style || "", //new
      wear_style: jewelleryDetails?.Wear_style || "", //new
      look: jewelleryDetails?.Look || "", //new
      portfolio_type: jewelleryDetails?.Portfolio_type || "", //new
      gender: jewelleryDetails?.Gender || "", //new
    };

    // Attach ID for updates
    if (cart?.product_code) {
      payload.id = cart.id as number;
    }

    showLoader();
    try {
      let res;
      if (payload.id) {
        // Use EditCart to update the cart
        res = await EditCart(payload);
        resetCartDetail();
        notify("Cart updated successfully");
        //console.log("Cart operation successful, Response ID:");
      } else {
        // Use createCart to insert a new cart item
        res = await createCart([payload]);
        resetCartDetail();
        notify("Cart created successfully");
        updateCartCount(isCartCount + 1); // Increment cart count for new items
        console.log("Cart operation successful, Response ID:", res.data.id);
      }

      router.push("/cart");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error creating/updating cart:", err.message);
        notifyErr(`Error: ${err.message || "Something went wrong"}`);
      } else {
        console.error("Unknown error occurred:", err);
        notifyErr("An unknown error occurred");
      }
    } finally {
      hideLoader(); // Ensure the loader is hidden
    }
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQty = Number(e.target.value);

    if (newQty <= 0 || isNaN(newQty)) {
      notifyErr("Quantity must be at least 1.");
      return;
    }
    const total_solitaire_pcs = totalPcs || 1;
    const carat = customisedData?.carat?.split("-") || ["0", "0"];
    const minCarat = parseFloat(carat[0]) || 0; // Default to 0 if invalid
    const maxCarat = parseFloat(carat[1]) || 0; // Default to 0 if invalid
    const premiumPercentage = Number(customisedData?.premiumPercentage) || 0;

    setSelectedQty(newQty);

    // Validate soliPriceFrom and soliPriceTo
    const validSoliPriceFrom = soliPriceFrom || 0;
    const validSoliPriceTo = soliPriceTo || 0;

    // Calculate premium prices
    const premiumMinPrice =
      validSoliPriceFrom + validSoliPriceFrom * (premiumPercentage / 100);
    const premiumMaxPrice =
      validSoliPriceTo + validSoliPriceTo * (premiumPercentage / 100);

    // Calculate amounts with default fallback for invalid values
    const calculatedSoliAmtFrom =
      premiumMinPrice * minCarat * newQty * total_solitaire_pcs;
    const calculatedSoliAmtTo =
      premiumMaxPrice * maxCarat * newQty * total_solitaire_pcs;

    setSoliAmtFrom(parseFloat(calculatedSoliAmtFrom.toFixed(2)) || 0); // Default to 0 if NaN
    setSoliAmtTo(parseFloat(calculatedSoliAmtTo.toFixed(2)) || 0); // Default to 0 if NaN

    CalculateDivineMountDetails(
      String(customisedData?.carat),
      Number(ringSizeFrom),
      newQty
    );
  };

  const handleSideDiaClarityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSideDiaColorClarity(event.target.value);
    calculateSideDiamondPrice(
      sideDiaTotweight,
      event.target.value,
      selectedQty
    );
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalVisible(false);
  };

  return (
    <div className="flex bg-white">
      {/* Image Gallery Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <ImageGallery
          images={filterByColorAndFormat(metalColor)}
          msg={ChkMsg()}
          //msg={GetMsg()}
        />
      </div>

      {/* Details Section */}
      <div className="bg-white p-4 w-1/2 relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6 text-center">
            <h2 className="text-lg">
              Product Code :{" "}
              <span className="font-semibold">
                {jewelleryDetails?.Item_number}
              </span>
            </h2>
            <h2 className="text-lg">
              Old Code :{" "}
              <span className="font-semibold">
                {jewelleryDetails?.Old_varient}
              </span>
            </h2>
          </div>
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
        <div className="flex">
          <div className="flex space-x-6 text-center">
            <h2 className="text-lg">
              Collection :{" "}
              <span className="font-semibold">
                {jewelleryDetails?.Collection}
              </span>
            </h2>
            <h2 className="text-lg">
              Sub Category :{" "}
              <span className="font-semibold whitespace-nowrap">
                {jewelleryDetails?.Product_sub_category}
              </span>
            </h2>
          </div>
        </div>
        <div className="w-full p-4 mb-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">Divine Solitaire</h2>
              {/* comparing with total pcs to show This is a multi solitaire product */}
              {/* {totalPcs > 1 && <h3>This is a multi solitaire product</h3>} */}
            </div>
            {(jewelleryDetails?.Product_price == null ||
              Number(jewelleryDetails?.Product_price) === 0) && (
              <div className="text-lg">
                <span className="font-semibold">
                  {formatByCurrencyINR(soliAmtFrom ?? 0)} apx -{" "}
                </span>
                <span className="font-semibold">
                  {formatByCurrencyINR(soliAmtTo ?? 0)} apx
                </span>
              </div>
            )}
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
          <p className="my-4 hidden">
            {`Solitaire price from ${soliPriceFrom} - ${soliPriceTo}`}
          </p>
          <div className="flex justify-between items-center mb-2">
            {(jewelleryDetails?.Product_price == null ||
              Number(jewelleryDetails?.Product_price) === 0) && (
              <h2
                className="text-lg text-blue-600 cursor-pointer"
                onClick={() => setIsPopupOpen(true)}
              >
                Customise your Divine Solitaire
              </h2>
            )}

            <div className="text-lg underline text-blue-600"></div>
          </div>
        </div>

        <div className="w-full p-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Divine Mount</h2>
            {(jewelleryDetails?.Product_price == null ||
              Number(jewelleryDetails?.Product_price) === 0) && (
              <div className="text-lg">
                <span className="font-semibold">
                  {formatByCurrencyINR((metalAmtFrom ?? 0) + (sDiaAmt ?? 0))}{" "}
                  apx
                </span>{" "}
                -
                <span className="font-semibold">
                  {" "}
                  {formatByCurrencyINR(
                    (metalAmtFrom ?? 0) + (sDiaAmt ?? 0)
                  )}{" "}
                  apx
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <label className="block text-lg font-medium text-gray-700">
                Metal :
              </label>
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
                {Array.from(
                  new Set(
                    jewelleryDetails?.Metal_color?.split(",")
                      .map((item) => item.trim()) // clean
                      .filter((item) => {
                        if (metalPurity.trim().toUpperCase() === "950PT") {
                          return item.toLowerCase() === "white";
                        }
                        return true;
                      })
                  )
                ).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}

                {/* {jewelleryDetails?.Metal_color.split(",")
                  .filter((item: string) => {
                    if (metalPurity.trim().toUpperCase() === "950PT") {
                      return item.trim().toLowerCase() === "white";
                    }
                    return true;
                  })

                  .map((item: string, index) => (
                    <option key={index} value={item}>
                      <span>{item.trim()}</span>
                    </option>
                  ))} */}
              </select>
            </div>

            <div className="text-lg">
              <span>Metal Weight : </span>
              <span className="font-semibold">
                {Metalweight.toFixed(3)} gms
              </span>
            </div>
            <div className="text-lg hidden">
              <span>Metal Price : </span>
              <span className="font-semibold">{metalPrice}</span>
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
                        Size :
                      </label>
                      <select
                        className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                        value={ringSizeFrom}
                        onChange={handleFromChange}
                      >
                        {generateRingSizes(
                          Number(jewelleryDetails?.Product_size_from),
                          Number(jewelleryDetails?.Product_size_to)
                        ).map((size) => (
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
                    Ring Size OP Range : {jewelleryDetails?.Product_size_from}{" "}
                    to {jewelleryDetails?.Product_size_to}.
                  </p>
                </div>
              </div>
            )}
          {sideDiaTotPcs > 0 && (
            <div className="flex justify-between mt-4">
              <div className="flex items-center space-x-2">
                <div className="text-lg">
                  <span>Side Daimond :</span>
                  <span className="font-semibold">
                    {sideDiaTotPcs}/ {sideDiaTotweight.toFixed(3)}
                  </span>
                  <span className="hidden">
                    Side diamond price :{sDiaPrice}
                  </span>
                </div>
                <div className="flex">
                  <select
                    className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                    value={sideDiaColorClarity}
                    onChange={handleSideDiaClarityChange}
                  >
                    {sideDiaColorClarityOption.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
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
                    {/* {formatByCurrencyINR(
                      soliAmtFrom + (metalAmtFrom ?? 0) + (sDiaAmt ?? 0)
                    )} */}
                    {formatByCurrencyINR(
                      jewelleryDetails?.Product_price == null ||
                        Number(jewelleryDetails?.Product_price) === 0
                        ? (soliAmtFrom ?? 0) +
                            (metalAmtFrom ?? 0) +
                            (sDiaAmt ?? 0)
                        : Number(jewelleryDetails.Product_price)
                    )}{" "}
                    apx
                  </span>
                </div>
                <div className="text-lg">
                  <span className="font-semibold">
                    {/* {formatByCurrencyINR(
                      soliAmtTo + (metalAmtFrom ?? 0) + (sDiaAmt ?? 0)
                    )}{" "} */}
                    {formatByCurrencyINR(
                      jewelleryDetails?.Product_price == null ||
                        Number(jewelleryDetails?.Product_price) === 0
                        ? (soliAmtTo ?? 0) +
                            (metalAmtFrom ?? 0) +
                            (sDiaAmt ?? 0)
                        : Number(jewelleryDetails.Product_price)
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
        collection={jewelleryDetails?.Collection ?? ""}
        Dshape={GetDefaultShape()}
        ismultiSize={Number(GetMsg()) > 1}
        //multiSize_slab={GetBomNamesforMultiSize().names}
        jewelleryData={jewelleryDetails ? [jewelleryDetails] : undefined}
      />

      {/* alert message */}
      {isCheckoutModalVisible && (
        <MessageModal
          title={isMessageTitle} //"Error Meaasge"
          //onClose={() => setIsCheckoutModalVisible(false)}
          onConfirm={closeCheckoutModal}
        >
          <p>{isMessage}</p>
        </MessageModal>
      )}

      {/* auto popup message msg={GetMsg()} */}
      {isModalOpen && <AutoClosePopup message={ChkMsg()} />}
    </div>
  );
}

export default JewelleryDetailScreen;
