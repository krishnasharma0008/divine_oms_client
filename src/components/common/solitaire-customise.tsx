import React, { useState, useEffect } from "react";
import DropdownCust from "./dropdown-cust";
import { usePremiumSizeAndPercentage } from "@/hook";
import {
  Solitaire_shape,
  Solus_shape,
  otherRoundColors,
  otherRoundColorsCarat,
  colors,
  Solus_colors,
  clarities,
  claritiesRound,
  claritiesRoundCarat,
} from "@/util/constants";
import { JewelleryDetail } from "@/interface";
import Dropdown from "./dropdown";

interface CustomisationOptions {
  shape: string;
  color: string;
  carat: string;
  clarity: string;
  premiumSize?: string;
  premiumPercentage?: string;
  variantId?: number;
}

interface SolitaireCustomisationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: CustomisationOptions) => void;
  cts_slab: string[];
  customisedData?: CustomisationOptions;
  collection: string;
  Dshape?: string;
  ismultiSize: boolean;
  jewelleryData?: JewelleryDetail[];
}

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

const SolitaireCustomisationPopup: React.FC<
  SolitaireCustomisationPopupProps
> = ({
  isOpen,
  onClose,
  onApply,
  cts_slab,
  customisedData,
  collection,
  Dshape,
  ismultiSize,
  jewelleryData,
}) => {
  const [shape, setShape] = useState<string>("");
  const [colorF, setColorF] = useState<string>("");
  const [colorT, setColorT] = useState<string>("");
  const [carat, setCarat] = useState<string>("");
  const [clarityF, setClarityF] = useState<string>("");
  const [clarityT, setClarityT] = useState<string>("");
  const [premiumSize, setPremiumSize] = useState<string>("");
  const [premiumPercentage, setPremiumPercentage] = useState<string>("");
  const [multiSize, setMultiSize] = useState<string>("");
  const [multiSizeDisplay, setMultiSizeDisplay] = useState<string>("");
  const [premiumSizeOptions, setPremiumSizeOptions] = useState<string[]>([]);

  const { getPremiumPercentage, getPremiumSizeOptions } =
    usePremiumSizeAndPercentage();

  const isRound = shape === "Round";

  const getColorOptions = (slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);

    if (collection === "SOLUS") {
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

  const getClarityOptions = (slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);
    if (collection === "SOLUS") {
      return claritiesRoundCarat;
    } else {
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

  const getColorTOptions = (colorF: string) => {
    const colorFIndex = getColorOptions(carat).indexOf(colorF);
    return getColorOptions(carat).filter((_, index) => index >= colorFIndex);
  };

  const getClarityTOptions = (clarityF: string) => {
    const clarityFIndex = getClarityOptions(carat).indexOf(clarityF);
    return getClarityOptions(carat).filter(
      (_, index) => index >= clarityFIndex
    );
  };

  useEffect(() => {
    if (
      colorF &&
      getColorOptions(carat).indexOf(colorF) >
        getColorOptions(carat).indexOf(colorT)
    ) {
      setColorT(colorF);
    }
  }, [colorF, carat, getColorOptions, colorT, setColorT]);

  useEffect(() => {
    if (
      clarityF &&
      getClarityOptions(carat).indexOf(clarityF) >
        getClarityOptions(carat).indexOf(clarityT)
    ) {
      setClarityT(clarityF);
    }
  }, [carat, clarityF, clarityT, getClarityOptions, setClarityT]);

  const [fieldErrors, setFieldErrors] = useState<{
    shape?: string;
    colorF?: string;
    colorT?: string;
    carat?: string;
    clarityF?: string;
    clarityT?: string;
  }>({});

  useEffect(() => {
    if (carat) {
      const filteredPremiumSizes = getPremiumSizeOptions(carat);
      setPremiumSizeOptions(filteredPremiumSizes);
      setPremiumSize("");
      setPremiumPercentage("");
    }
  }, [carat, getPremiumSizeOptions]);

  useEffect(() => {
    if (premiumSize) {
      const percentage = getPremiumPercentage(premiumSize);
      setPremiumPercentage(percentage ? percentage : "0");
    }
  }, [premiumSize, getPremiumPercentage]);

  useEffect(() => {
    if (isOpen) {
      if (ismultiSize && multiSize) {
        console.log("Multi Size String:", multiSize);
        const parts = multiSize.split("-");
        const shapeCode = parts[1];
        setShape(shapeMap[shapeCode] || "");
        setCarat(parts[2] + "-" + parts[3]);
        console.log("Carat:", parts[4]);
        if (parts[4]) {
          setColorF(parts[4]);
        }
        if (parts[5]) {
          setClarityF(parts[5]);
        }
        setColorT("");
        setClarityT("");
      } else {
        console.log(customisedData);
        setShape(customisedData?.shape || Dshape || "");
        setCarat(customisedData?.carat || "");
        setColorF(customisedData?.color?.split("-")[0] || "");
        setColorT(customisedData?.color?.split("-")[1] || "");
        setClarityF(customisedData?.clarity?.split("-")[0] || "");
        setClarityT(customisedData?.clarity?.split("-")[1] || "");
        setPremiumSize(customisedData?.premiumSize || "");
        setPremiumPercentage(customisedData?.premiumPercentage || "");

        if (customisedData?.carat) {
          const premiumSizes = getPremiumSizeOptions(customisedData.carat);
          setPremiumSizeOptions(premiumSizes || []);
        } else {
          setPremiumSizeOptions([]);
        }
      }
    }
  }, [isOpen, customisedData, getPremiumSizeOptions, ismultiSize, multiSize]);

  const handleApply = () => {
    console.log("Applying customisation...");
    const errors: Record<string, string> = {};
    if (!shape) errors.shape = "Shape is required.";
    if (!colorF) errors.colorF = "Color (From) is required.";
    if (!colorT) errors.colorT = "Color (To) is required.";
    if (!carat) errors.carat = "Carat is required.";
    if (!clarityF) errors.clarityF = "Clarity (From) is required.";
    if (!clarityT) errors.clarityT = "Clarity (To) is required.";
    setFieldErrors(errors);
    console.log("Field Errors:", errors);
    if (Object.keys(errors).length) return;

    const selectedColor = `${colorF}-${colorT}`;
    const selectedClarity = `${clarityF}-${clarityT}`;

    onApply({
      shape,
      color: selectedColor,
      carat,
      clarity: selectedClarity,
      premiumSize,
      premiumPercentage,
      variantId: multiSizeDisplay ? parseInt(multiSizeDisplay) : undefined,
    });
  };

  const handleClear = () => {
    setShape("");
    setColorF("");
    setColorT("");
    setCarat("");
    setClarityF("");
    setClarityT("");
    setPremiumSize("");
    setPremiumPercentage("");
    setMultiSize("");
  };

  if (!isOpen) return null;

  const handleMultiSizeChange = (variantId: string) => {
    console.log("Selected Variant ID:", variantId);
    setMultiSizeDisplay(variantId);

    const bomList = jewelleryData?.[0]?.Bom?.filter(
      (b) =>
        String(b.Variant_id) === variantId &&
        b.Item_group?.trim().toUpperCase() === "SOLITAIRE" &&
        b.Item_type?.trim().toUpperCase() === "STONE"
    );

    if (bomList && bomList.length > 0) {
      const lowestBom = bomList.reduce((min, curr) =>
        Number(curr.Pcs) < Number(min.Pcs) ? curr : min
      );
      setMultiSize(lowestBom.Bom_variant_name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      {/* ✅ Removed overflow-hidden so dropdowns are not clipped */}
      <div className="bg-white rounded-lg shadow-lg w-[95%] sm:w-3/4 md:w-2/3 lg:w-3/4 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="relative flex items-center justify-center p-6 border-b sticky top-0 bg-white z-30 rounded-t-lg">
          <h2 className="text-lg font-semibold absolute left-1/2 transform -translate-x-1/2">
            Customise Your Solitaire
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-600 hover:text-gray-900 text-2xl font-semibold z-40"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content
            ✅ overflow-y-auto on mobile, overflow-visible on md+ so dropdowns aren't clipped on desktop
        */}
        <div className="p-4 sm:p-6 overflow-x-hidden overflow-y-auto md:overflow-visible flex-1">
          <div className="w-full flex flex-col md:flex-row gap-4 md:gap-2 md:justify-between">

            {!ismultiSize ? (
              <>
                {/* Shape */}
                <div className="w-full md:w-1/6">
                  <label className="block text-gray-700 font-medium text-center mb-7">
                    Shape
                  </label>
                  <DropdownCust
                    label=""
                    options={
                      collection === "SOLUS" ? Solus_shape : Solitaire_shape
                    }
                    value={shape}
                    onChange={setShape}
                    error={fieldErrors.shape}
                    classes="w-full"
                    disabled={!!Dshape}
                  />
                </div>

                {/* Carat */}
                <div className="w-full md:w-1/5">
                  <label className="block text-gray-700 font-medium text-center mb-7">
                    Carat
                  </label>
                  <DropdownCust
                    label=""
                    options={cts_slab}
                    value={carat}
                    onChange={setCarat}
                    error={fieldErrors.carat}
                    classes="w-full"
                  />
                </div>
              </>
            ) : (
              /* Multi Size */
              <div className="w-full md:w-1/4">
                <label className="block text-gray-700 font-medium text-center mb-7">
                  Multi Size
                </label>
                <Dropdown
                  label=""
                  options={
                    jewelleryData?.[0]?.Variants?.filter(
                      (v) => v.Variant_name
                    )?.map((variant) => ({
                      label: variant.Variant_name,
                      value: String(variant.Variant_id),
                    })) || []
                  }
                  value={multiSizeDisplay}
                  onChange={handleMultiSizeChange}
                  classes="w-full"
                />
              </div>
            )}

            {/* Color */}
            <div className="w-full md:w-1/4">
              <label className="block text-gray-700 font-medium text-center">
                Color
              </label>
              {/* ✅ Always side-by-side (flex-row) on all screen sizes */}
              <div className="flex flex-row gap-2">
                <DropdownCust
                  label="From"
                  options={getColorOptions(carat)}
                  value={colorF}
                  onChange={setColorF}
                  error={fieldErrors.colorF}
                  classes="w-1/2"
                  Labelclasses="text-center"
                />
                <DropdownCust
                  label="To"
                  options={getColorTOptions(colorF)}
                  value={colorT}
                  onChange={setColorT}
                  error={fieldErrors.colorT}
                  classes="w-1/2"
                  Labelclasses="text-center"
                />
              </div>
            </div>

            {/* Clarity */}
            <div className="w-full md:w-1/4">
              <label className="block text-gray-700 font-medium text-center">
                Clarity
              </label>
              {/* ✅ Always side-by-side (flex-row) on all screen sizes */}
              <div className="flex flex-row gap-2">
                <DropdownCust
                  label="From"
                  options={getClarityOptions(carat)}
                  value={clarityF}
                  onChange={setClarityF}
                  error={fieldErrors.clarityF}
                  classes="w-1/2"
                  Labelclasses="text-center"
                />
                <DropdownCust
                  label="To"
                  options={getClarityTOptions(clarityF)}
                  value={clarityT}
                  onChange={setClarityT}
                  error={fieldErrors.clarityT}
                  classes="w-1/2"
                  Labelclasses="text-center"
                />
              </div>
            </div>

            {/* Premium Size */}
            <div className="w-full md:w-1/6">
              <label className="block text-gray-700 font-medium text-center mb-2 sm:mb-7">
                Premium Size
              </label>
              <DropdownCust
                label=""
                options={premiumSizeOptions}
                value={premiumSize}
                onChange={setPremiumSize}
                classes="w-full"
              />
            </div>

            {/* Premium % */}
            <div className="w-full md:w-1/6">
              <label className="block text-gray-700 text-sm font-medium text-center mb-2 sm:mb-7">
                Premium %
              </label>
              <input
                type="text"
                value={premiumPercentage}
                disabled
                className="w-full p-2 border rounded bg-gray-100 text-gray-600"
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 pb-6">
          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export default SolitaireCustomisationPopup;