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

interface CustomisationOptions {
  shape: string;
  color: string;
  carat: string;
  clarity: string;
  premiumSize?: string;
  premiumPercentage?: string;
}

interface SolitaireCustomisationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: CustomisationOptions) => void;
  cts_slab: string[];
  customisedData?: CustomisationOptions;
  collection: string;
}

const SolitaireCustomisationPopup: React.FC<
  SolitaireCustomisationPopupProps
> = ({ isOpen, onClose, onApply, cts_slab, customisedData, collection }) => {
  const [shape, setShape] = useState<string>("");
  const [colorF, setColorF] = useState<string>("");
  const [colorT, setColorT] = useState<string>("");
  const [carat, setCarat] = useState<string>("");
  const [clarityF, setClarityF] = useState<string>("");
  const [clarityT, setClarityT] = useState<string>("");
  const [premiumSize, setPremiumSize] = useState<string>("");
  const [premiumPercentage, setPremiumPercentage] = useState<string>("");

  const [premiumSizeOptions, setPremiumSizeOptions] = useState<string[]>([]);
  //const [error, setError] = useState<string>("");

  // Use the custom hook for premium size and percentage
  const { getPremiumPercentage, getPremiumSizeOptions } =
    usePremiumSizeAndPercentage();

  const isRound = shape === "Round"; // Check if the shape is Round

  // const otherRoundColors = ["EF", "GH", "IJ"];
  // const otherRoundColorsCarat = ["EF", "GH"];
  // const colors = ["D", "E", "F", "G", "H", "I", "J", "K"];

  // const clarities = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
  // const claritiesRound = ["VVS", "VS", "SI"];
  // const claritiesRoundCarat = ["VVS", "VS"];

  // Function to get color options based on the slab
  const getColorOptions = (slab: string) => {
    const carat = parseFloat(slab.split("-")[1]);

    if (collection === "SOLUS") {
      return Solus_colors; // Use solus color options if collection is SOLUS
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
      return claritiesRoundCarat; // Use solus color options if collection is SOLUS
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
      //colorT &&
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
      // Filter the premium size options based on the carat size
      const filteredPremiumSizes = getPremiumSizeOptions(carat);
      setPremiumSizeOptions(filteredPremiumSizes);
      setPremiumSize(""); // Reset the selected premium size
      setPremiumPercentage(""); // Reset the premium percentage
    }
  }, [carat, getPremiumSizeOptions]); // This runs whenever 'carat' changes

  // Fetch Premium Percentage when Premium Size is selected
  useEffect(() => {
    if (premiumSize) {
      const percentage = getPremiumPercentage(premiumSize);
      setPremiumPercentage(percentage ? percentage : "0");
    }
  }, [premiumSize, getPremiumPercentage]);

  useEffect(() => {
    if (isOpen) {
      // Reset fields with either customised data or default values
      console.log(customisedData);
      setShape(customisedData?.shape || "");
      setCarat(customisedData?.carat || "");
      setColorF(customisedData?.color?.split("-")[0] || "");
      setColorT(customisedData?.color?.split("-")[1] || "");
      setClarityF(customisedData?.clarity?.split("-")[0] || "");
      setClarityT(customisedData?.clarity?.split("-")[1] || "");
      setPremiumSize(customisedData?.premiumSize || "");
      console.log("customisedData?.premiumSize:", customisedData?.premiumSize);
      setPremiumPercentage(customisedData?.premiumPercentage || "");

      // Fetch and update premium size options
      if (customisedData?.carat) {
        const premiumSizes = getPremiumSizeOptions(customisedData.carat);
        setPremiumSizeOptions(premiumSizes || []);
      } else {
        setPremiumSizeOptions([]);
      }
    }
  }, [isOpen, customisedData, getPremiumSizeOptions]);

  useEffect(() => {
    console.log("premiumSize after setting:", premiumSize);
  }, [premiumSize]);

  const handleApply = () => {
    const errors: Record<string, string> = {};
    if (!shape) errors.shape = "Shape is required.";
    if (!colorF) errors.colorF = "Color (From) is required.";
    if (!colorT) errors.colorT = "Color (To) is required.";
    if (!carat) errors.carat = "Carat is required.";
    if (!clarityF) errors.clarityF = "Clarity (From) is required.";
    if (!clarityT) errors.clarityT = "Clarity (To) is required.";
    setFieldErrors(errors);

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
    //setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 sm:w-3/4 md:w-2/3 lg:w-3/4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-2 text-gray-600 hover:text-gray-900"
        >
          <span className="text-2xl font-semibold">&times;</span>{" "}
          {/* "X" for close */}
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">
          Customise Your Solitaire
        </h2>

        {/* Form Layout */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
        <div className="w-full flex space-y-4 space-x-2 md:space-y-0 justify-between">
          <div className="w-1/6">
            <label className="block text-gray-700 font-medium text-center mb-7">
              Shape
            </label>
            <DropdownCust
              label=""
              options={collection === "SOLUS" ? Solus_shape : Solitaire_shape}
              value={shape}
              onChange={setShape}
              error={fieldErrors.shape}
              classes="w-full"
            />
          </div>
          <div className="w-1/5">
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
            {/* {mcolor.split(",").map((item: string, index) => (
              <option key={index} value={item}>
                <span>{item.trim()}</span>
              </option>
            ))} */}
          </div>
          <div className="w-1/4">
            <label className="block text-gray-700 font-medium text-center">
              Color
            </label>
            <div className="flex space-x-2">
              <DropdownCust
                label="From"
                options={getColorOptions(carat)}
                value={colorF}
                onChange={setColorF}
                error={fieldErrors.colorF}
                classes="w-1/2"
                Labelclasses="text-center "
              />
              <DropdownCust
                label="To"
                options={getColorTOptions(colorF)}
                value={colorT}
                onChange={setColorT}
                error={fieldErrors.colorT}
                classes="w-1/2"
                Labelclasses="text-center "
              />
            </div>
          </div>
          <div className="w-1/4">
            <label className="block text-gray-700 font-medium text-center">
              Clarity
            </label>
            <div className="flex space-x-2">
              <DropdownCust
                label="From"
                options={getClarityOptions(carat)}
                value={clarityF}
                onChange={setClarityF}
                error={fieldErrors.clarityF}
                classes="w-1/2"
                Labelclasses="text-center "
              />
              <DropdownCust
                label="To"
                options={getClarityTOptions(clarityF)}
                value={clarityT}
                onChange={setClarityT}
                error={fieldErrors.clarityT}
                classes="w-1/2"
                Labelclasses="text-center "
              />
            </div>
          </div>
          <div className="w-1/6">
            <label className="block text-gray-700 font-medium text-center mb-7">
              Premium Size
            </label>
            <DropdownCust
              label=""
              options={premiumSizeOptions}
              value={premiumSize}
              onChange={setPremiumSize}
              //error={fieldErrors.premiumSize}
              classes="w-full"
            />
          </div>
          <div className="w-1/6">
            <label className="block text-gray-700 text-sm font-medium mb-7">
              Premium %
            </label>
            <input
              type="text"
              value={premiumPercentage}
              disabled
              className="w-full p-2 border rounded bg-gray-100 text-gray-600"
              // error={fieldErrors.premiumPercentage}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolitaireCustomisationPopup;
