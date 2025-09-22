"use client";

import React, { useState } from "react";
import Image from "next/image";
import SearchableSelect from "@/components/common/searchDropdown";
// import {
//   Solitaire_shape,
//   otherRoundColors,
//   otherRoundColorsCarat,
//   colors,
//   clarities,
//   claritiesRound,
//   claritiesRoundCarat,
//   slab,
// } from "@/util/constants";

const shapes = [
  { name: "Round", icon: "/shapes/round.png" },
  { name: "Princess", icon: "/shapes/princess.png" },
  { name: "Pear", icon: "/shapes/pear.png" },
  { name: "Oval", icon: "/shapes/oval.png" },
  { name: "Marquise", icon: "/shapes/marquise.png" },
  { name: "Cushion", icon: "/shapes/cushion.png" },
  { name: "Heart", icon: "/shapes/heart.png" },
  { name: "Radiant", icon: "/shapes/radiant.png" },
];

const colors = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "Yellow Vivid",
  "Yellow Intense",
];
const clarities = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const sizeSlabs = ["0.10 - 0.13", "0.14 - 0.17", "0.18 - 0.22"];

const dummyStock: StockItem[] = [
  {
    id: 1,
    shape: "Round",
    carat: 0.1,
    color: "D",
    clarity: "IF",
    premium: "-",
    qty: 10,
    selectedQty: 0,
  },
  {
    id: 2,
    shape: "Princess",
    carat: 0.12,
    color: "E",
    clarity: "VVS1",
    premium: "2%",
    qty: 5,
    selectedQty: 0,
  },
  {
    id: 3,
    shape: "Oval",
    carat: 0.14,
    color: "F",
    clarity: "VS1",
    premium: "3%",
    qty: 8,
    selectedQty: 0,
  },
  {
    id: 4,
    shape: "Cushion",
    carat: 0.2,
    color: "G",
    clarity: "SI1",
    premium: "5%",
    qty: 12,
    selectedQty: 0,
  },
];

interface StockItem {
  id: number;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  premium: string;
  qty: number;
  selectedQty: number;
}

//export default function CheckScreen() {
const CheckScreen = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  //const [availableStock, setAvailableStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    sizeSlab: "",
    premium: "",
    color: "",
    clarity: "",
    shape: "",
  });

  // For single-select filters (color, clarity, premium, sizeSlab, shape if single)
  const handleSingleSelect = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value, // toggle
    }));
  };

  const handleApplyFilters = () => {
    setLoading(true);

    //⏳ Simulating fetch from DB with filters
    setTimeout(() => {
      console.log("Applied Filters:", filters);
      setStock(dummyStock);
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setFilters({
      sizeSlab: "0.10 - 0.13",
      premium: "",
      color: "",
      clarity: "",
      shape: "",
    });
    setStock([]); // clear stock too
  };

  const handleQtyChange = (id: number, delta: number) => {
    setStock((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedQty: Math.max(
                0,
                Math.min(item.qty, item.selectedQty + delta)
              ),
            }
          : item
      )
    );
  };

  const handleSubmit = () => {
    // console.log("Submitting Order with Stock:", availableStock);
    // console.log("Submitting Order with Stock:", dummyStock);
    console.log("Submitting Order with Stock:", stock);
    const filtered = stock.filter((item) => item.selectedQty > 0);
    //setAvailableStock(filtered);
    console.log("Available Stock:", filtered);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filters -</h2>
          <div className="space-x-3">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-100"
            >
              Clear Filters
            </button>
            {/* <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800"
            >
              Apply Filters
            </button> */}

            <button
              type="button"
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        {/* <div className="grid grid-cols-2 gap-6"> */}
        <div className="flex gap-6 justify-between ">
          {/* Left Column */}
          <div className="w-[40%] space-y-6">
            {/* Size Slab + Premium */}
            <div className="border rounded-lg p-4">
              <div className="flex grid grid-cols-2 space-x-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Size Slab
                  </label>
                  <SearchableSelect
                    options={sizeSlabs.map((slab) => ({
                      label: slab,
                      value: slab,
                    }))}
                    // value={filters.sizeSlab}
                    // onChange={(e) =>
                    //   setFilters({ ...filters, sizeSlab: e.target.value })
                    // }
                    onChange={(val) => {
                      console.log("User cleared the selection", val);
                      console.log("User cleared the selection");
                      if (val) {
                        setFilters({ ...filters, sizeSlab: val.value });
                      }
                    }}
                    //className="border rounded-md px-3 py-2 w-48"
                    // >
                    //   <option value="">Select</option>
                    //   {sizeSlabs.map((slab) => (
                    //     <option key={slab} value={slab}>
                    //       {slab}
                    //     </option>
                    //   ))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Premium %
                  </label>
                  <input
                    type="number"
                    value={filters.premium}
                    onChange={(e) =>
                      setFilters({ ...filters, premium: e.target.value })
                    }
                    className="border rounded-md px-3 py-2 w-48"
                  />
                </div>
              </div>
            </div>

            {/* Shape */}
            {/* Shape Section */}
            <div className="mb-6 border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-3">Shape</h3>
              {/* Row 1 */}
              <div className="flex flex-wrap gap-4 mb-4">
                {shapes.slice(0, 5).map((shape) => (
                  <div
                    key={shape.name}
                    onClick={() => handleSingleSelect("shape", shape.name)}
                    className={`flex flex-col items-center cursor-pointer border-2 rounded-lg p-2 w-20 transition ${
                      filters.shape === shape.name
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={shape.icon}
                      alt={shape.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 mb-1"
                    />
                    <span className="text-xs">{shape.name}</span>
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap gap-4">
                {shapes.slice(5).map((shape) => (
                  <div
                    key={shape.name}
                    onClick={() => handleSingleSelect("shape", shape.name)}
                    className={`flex flex-col items-center cursor-pointer border-2 rounded-lg p-2 w-20 transition ${
                      filters.shape === shape.name
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={shape.icon}
                      alt={shape.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 mb-1"
                    />
                    <span className="text-xs">{shape.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[55%] space-y-6">
            {/* Color */}
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setFilters({ ...filters, color })}
                    className={`px-3 py-1 rounded-md border ${
                      filters.color === color
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity */}
            <div className="border rounded-lg p-4">
              <p className="text-sm font-medium mb-3">Clarity</p>
              <div className="flex flex-wrap gap-2">
                {clarities.map((clarity) => (
                  <button
                    type="button"
                    key={clarity}
                    onClick={() => setFilters({ ...filters, clarity: clarity })}
                    className={`px-3 py-1 rounded-md border ${
                      filters.clarity === clarity
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {clarity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dummy Available Stock */}

        {/* Stock Table */}
        {stock.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mt-6 mb-2">Available Stock</h2>
            <table className="w-full border rounded-lg text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Sr No</th>
                  <th className="p-2 border">Shape</th>
                  <th className="p-2 border">Carat</th>
                  <th className="p-2 border">Color</th>
                  <th className="p-2 border">Clarity</th>
                  <th className="p-2 border">Premium %</th>
                  <th className="p-2 border">Available Qty</th>
                  <th className="p-2 border">Add Qty</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((item, idx) => (
                  <tr key={item.id} className="text-center">
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border">{item.shape}</td>
                    <td className="p-2 border">{item.carat}</td>
                    <td className="p-2 border">{item.color}</td>
                    <td className="p-2 border">{item.clarity}</td>
                    <td className="p-2 border">{item.premium}</td>
                    <td className="p-2 border">{item.qty}</td>
                    <td className="p-2 border flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, -1)}
                        //className="px-2 py-1 border rounded-md"
                        className={`
    px-3 py-1 rounded-md font-bold border transition-colors duration-150
    ${
      item.selectedQty === 0
        ? "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed"
        : "bg-black text-white border-black active:bg-white active:text-black"
    }
  `}
                      >
                        -
                      </button>
                      <span>{item.selectedQty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, 1)}
                        //className="px-2 py-1 border rounded-md"
                        className="
                                  px-3 py-1 rounded-md font-bold 
                                  bg-black text-white border border-black
                                  active:bg-white active:text-black
                                  transition-colors duration-150
                                "
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Submit */}
        {stock.length > 0 && (
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md"
              onClick={handleSubmit}
            >
              Submit Order
            </button>
          </div>
        )}
        {/* <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Available Stock</h3>
          <p className="text-gray-500 text-sm">
            Showing dummy stock data after applying filters...
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default CheckScreen;
