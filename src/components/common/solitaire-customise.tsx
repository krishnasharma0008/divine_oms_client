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

const selectClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:bg-gray-100 disabled:text-gray-500";

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
    if (!slab) return [];
    const caratVal = parseFloat(slab.split("-")[1]);
    if (Number.isNaN(caratVal)) return colors;

    if (collection === "SOLUS") {
      return Solus_colors;
    }
    if (isRound) {
      return caratVal < 0.18 ? otherRoundColors : colors;
    }
    return caratVal >= 0.1 && caratVal <= 0.17
      ? otherRoundColorsCarat
      : colors.filter(
          (color) => color !== "I" && color !== "J" && color !== "K"
        );
  };

  const getClarityOptions = (slab: string) => {
    if (!slab) return [];
    const caratVal = parseFloat(slab.split("-")[1]);
    if (Number.isNaN(caratVal)) return clarities;

    if (collection === "SOLUS") {
      return claritiesRoundCarat;
    }
    if (isRound) {
      return caratVal < 0.18 ? claritiesRound : clarities;
    }
    return caratVal >= 0.1 && caratVal <= 0.17
      ? claritiesRoundCarat
      : clarities.slice(0, 5);
  };

  const getColorTOptions = (from: string) => {
    const opts = getColorOptions(carat);
    const fromIndex = opts.indexOf(from);
    return fromIndex >= 0 ? opts.filter((_, i) => i >= fromIndex) : opts;
  };

  const getClarityTOptions = (from: string) => {
    const opts = getClarityOptions(carat);
    const fromIndex = opts.indexOf(from);
    return fromIndex >= 0 ? opts.filter((_, i) => i >= fromIndex) : opts;
  };

  const [fieldErrors, setFieldErrors] = useState<{
    shape?: string;
    colorF?: string;
    colorT?: string;
    carat?: string;
    clarityF?: string;
    clarityT?: string;
    multiSize?: string;
  }>({});

  useEffect(() => {
    if (carat) {
      setPremiumSizeOptions(getPremiumSizeOptions(carat));
      setPremiumSize("");
      setPremiumPercentage("");
    } else {
      setPremiumSizeOptions([]);
    }
  }, [carat, getPremiumSizeOptions]);

  useEffect(() => {
    if (premiumSize) {
      const percentage = getPremiumPercentage(premiumSize);
      setPremiumPercentage(percentage ? percentage : "0");
    }
  }, [premiumSize, getPremiumPercentage]);

  useEffect(() => {
    if (
      colorF &&
      getColorOptions(carat).indexOf(colorF) >
        getColorOptions(carat).indexOf(colorT)
    ) {
      setColorT(colorF);
    }
  }, [colorF, carat, colorT, collection, isRound]);

  useEffect(() => {
    if (
      clarityF &&
      getClarityOptions(carat).indexOf(clarityF) >
        getClarityOptions(carat).indexOf(clarityT)
    ) {
      setClarityT(clarityF);
    }
  }, [carat, clarityF, clarityT, collection, isRound]);

  useEffect(() => {
    if (!isOpen) return;

    if (ismultiSize && multiSize) {
      const parts = multiSize.split("-");
      const shapeCode = parts[1];
      setShape(shapeMap[shapeCode] || "");
      setCarat(parts[2] + "-" + parts[3]);
      if (parts[4]) setColorF(parts[4]);
      if (parts[5]) setClarityF(parts[5]);
      setColorT("");
      setClarityT("");
    } else {
      setShape(customisedData?.shape || Dshape || "");
      setCarat(customisedData?.carat || "");
      setColorF(customisedData?.color?.split("-")[0] || "");
      setColorT(customisedData?.color?.split("-")[1] || "");
      setClarityF(customisedData?.clarity?.split("-")[0] || "");
      setClarityT(customisedData?.clarity?.split("-")[1] || "");
      setPremiumSize(customisedData?.premiumSize || "");
      setPremiumPercentage(customisedData?.premiumPercentage || "");
      setPremiumSizeOptions(
        customisedData?.carat
          ? getPremiumSizeOptions(customisedData.carat) || []
          : []
      );
    }
    setFieldErrors({});
  }, [
    isOpen,
    customisedData,
    getPremiumSizeOptions,
    ismultiSize,
    multiSize,
    Dshape,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleApply = () => {
    const errors: Record<string, string> = {};
    if (ismultiSize && !multiSizeDisplay) {
      errors.multiSize = "Please select a multi size variant.";
    }
    if (!ismultiSize && !shape) errors.shape = "Shape is required.";
    if (!carat) errors.carat = "Carat is required.";
    if (!colorF) errors.colorF = "Color (From) is required.";
    if (!colorT) errors.colorT = "Color (To) is required.";
    if (!clarityF) errors.clarityF = "Clarity (From) is required.";
    if (!clarityT) errors.clarityT = "Clarity (To) is required.";
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    onApply({
      shape,
      color: `${colorF}-${colorT}`,
      carat,
      clarity: `${clarityF}-${clarityT}`,
      premiumSize,
      premiumPercentage,
      variantId: multiSizeDisplay ? parseInt(multiSizeDisplay, 10) : undefined,
    });
  };

  const handleClear = () => {
    setShape(Dshape || "");
    setColorF("");
    setColorT("");
    setCarat("");
    setClarityF("");
    setClarityT("");
    setPremiumSize("");
    setPremiumPercentage("");
    setMultiSize("");
    setMultiSizeDisplay("");
    setFieldErrors({});
  };

  const handleMultiSizeChange = (variantId: string) => {
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

  const multiSizeOptions =
    jewelleryData?.[0]?.Variants?.filter((v) => v.Variant_name)?.map(
      (variant) => ({
        label: variant.Variant_name,
        value: String(variant.Variant_id),
      })
    ) || [];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="solitaire-customise-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
          <div>
            <h2
              id="solitaire-customise-title"
              className="text-lg font-semibold text-gray-900"
            >
              Customise your solitaire
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Select shape, carat, color and clarity to continue
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ismultiSize ? (
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Multi size variant
                </label>
                <select
                  value={multiSizeDisplay}
                  onChange={(e) => handleMultiSizeChange(e.target.value)}
                  className={`${selectClassName} ${
                    fieldErrors.multiSize ? "border-red-400" : ""
                  }`}
                >
                  <option value="">Select variant</option>
                  {multiSizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.multiSize && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErrors.multiSize}
                  </p>
                )}
              </div>
            ) : (
              <>
                <DropdownCust
                  label="Shape"
                  options={
                    collection === "SOLUS" ? Solus_shape : Solitaire_shape
                  }
                  value={shape}
                  onChange={setShape}
                  error={fieldErrors.shape}
                  classes="w-full"
                  disabled={!!Dshape}
                />
                <DropdownCust
                  label="Carat slab"
                  options={cts_slab}
                  value={carat}
                  onChange={setCarat}
                  error={fieldErrors.carat}
                  classes="w-full"
                />
              </>
            )}

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">Color range</p>
              <div className="grid grid-cols-2 gap-3">
                <DropdownCust
                  label="From"
                  options={getColorOptions(carat)}
                  value={colorF}
                  onChange={setColorF}
                  error={fieldErrors.colorF}
                  classes="w-full"
                  Labelclasses="text-xs"
                />
                <DropdownCust
                  label="To"
                  options={getColorTOptions(colorF)}
                  value={colorT}
                  onChange={setColorT}
                  error={fieldErrors.colorT}
                  classes="w-full"
                  Labelclasses="text-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-gray-700">
                Clarity range
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DropdownCust
                  label="From"
                  options={getClarityOptions(carat)}
                  value={clarityF}
                  onChange={setClarityF}
                  error={fieldErrors.clarityF}
                  classes="w-full"
                  Labelclasses="text-xs"
                />
                <DropdownCust
                  label="To"
                  options={getClarityTOptions(clarityF)}
                  value={clarityT}
                  onChange={setClarityT}
                  error={fieldErrors.clarityT}
                  classes="w-full"
                  Labelclasses="text-xs"
                />
              </div>
            </div>

            <DropdownCust
              label="Premium size"
              options={premiumSizeOptions}
              value={premiumSize}
              onChange={setPremiumSize}
              classes="w-full"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Premium %
              </label>
              <input
                type="text"
                value={premiumPercentage}
                disabled
                className={`${selectClassName} bg-gray-50`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-white p-4 sm:flex-row sm:justify-end sm:px-6 sm:pb-6">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Apply selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolitaireCustomisationPopup;
