import React, { useState, useEffect } from "react";
import DropdownCust from "./dropdown-cust";

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
}

const SolitaireCustomisationPopup: React.FC<
  SolitaireCustomisationPopupProps
> = ({ isOpen, onClose, onApply, cts_slab }) => {
  const [shape, setShape] = useState<string>("");
  const [colorF, setColorF] = useState<string>("");
  const [colorT, setColorT] = useState<string>("");
  const [carat, setCarat] = useState<string>("");
  const [clarityF, setClarityF] = useState<string>("");
  const [clarityT, setClarityT] = useState<string>("");
  const [premiumSize, setPremiumSize] = useState<string>("");
  const [premiumPercentage, setPremiumPercentage] = useState<string>("");
  //const [error, setError] = useState<string>("");

  const options = {
    shape: ["Round", "Princess", "Oval", "Pear"],
    color: ["D", "E", "F", "G", "H", "I", "J", "K"],
    //carat: ["0.30 - 0.38", "0.40 - 0.50", "0.60 - 0.75"],
    clarity: ["IF", "VVSI", "VVS2", "VS1", "VS2", "SI1", "SI2"],
    //premiumSize: ["Small", "Medium", "Large"],
    premiumSize: ["-"],
    premiumPercentage: ["5%", "10%", "15%", "20%"],
  };

  // Dynamic color options based on shape
  const getColorOptions = () =>
    shape === "Round" ? options.color : options.color.slice(0, 5);

  const getClarityOptions = () =>
    shape === "Round" ? options.clarity : options.clarity.slice(0, 5);

  const getColorTOptions = (colorF: string) => {
    const colorFIndex = getColorOptions().indexOf(colorF);
    return getColorOptions().filter((_, index) => index >= colorFIndex);
  };

  const getClarityTOptions = (clarityF: string) => {
    const clarityFIndex = getClarityOptions().indexOf(clarityF);
    return getClarityOptions().filter((_, index) => index >= clarityFIndex);
  };

  useEffect(() => {
    if (
      colorF &&
      options.color.indexOf(colorF) > options.color.indexOf(colorT)
    ) {
      setColorT(colorF);
    }
  }, [colorF]);

  useEffect(() => {
    if (
      clarityF &&
      options.clarity.indexOf(clarityF) > options.clarity.indexOf(clarityT)
    ) {
      setClarityT(clarityF);
    }
  }, [clarityF]);

  const [fieldErrors, setFieldErrors] = useState<{
    shape?: string;
    colorF?: string;
    colorT?: string;
    carat?: string;
    clarityF?: string;
    clarityT?: string;
  }>({});

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

    const selectedColor = `${colorF} - ${colorT}`;
    const selectedClarity = `${clarityF} - ${clarityT}`;
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
              options={options.shape}
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
                options={getColorOptions()}
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
                options={getClarityOptions()}
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
              options={options.premiumSize}
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
