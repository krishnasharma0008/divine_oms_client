"use client";

import ImageGallery from "@/components/common/image-gallery";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShoppingCartIcon from "@/components/icons/shopping-cart-icon";

function JewelleryDetailScreen() {
  const { id } = useParams();
  const [decodedDesignId, setDecodedDesignId] = useState<string | null>(null);
  const [selectedPcs, setSelectedPcs] = useState<number>(1);

  useEffect(() => {
    if (id) {
      setDecodedDesignId(decodeURIComponent(id as string));
    }
  }, [id]);

  const images = [
    {
      url: "/vtdia/carousel_1.png",
      thumbnailUrl: "/vtdia/carousel_1.png",
      title: "Image 1",
      uid: "0",
    },
    {
      url: "/vtdia/carousel_2.png",
      thumbnailUrl: "/vtdia/carousel_2.png",
      title: "Image 2",
      uid: "1",
    },
    {
      url: "/vtdia/carousel_3.png",
      thumbnailUrl: "/vtdia/carousel_3.png",
      title: "Image 3",
      uid: "2",
    },
    {
      url: "/vtdia/carousel_4.png",
      thumbnailUrl: "/vtdia/carousel_4.png",
      title: "Image 4",
      uid: "3",
    },
  ];

  const imageGalleryImages = images.map((image, index) => ({
    ...image,
    uid: index.toString(),
  }));

  const productData = [
    { label: "Solitaire", value: "" },
    { label: "Metal Weight", value: "" },
    { label: "Metal", value: "" },
    { label: "Ring Size", value: "" },
    { label: "Side Diamond", value: "" },
  ];

  const handlePcsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPcs(Number(event.target.value));
  };

  return (
    <div className="flex bg-white">
      {/* Image Gallery Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <ImageGallery images={imageGalleryImages} />
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
                <span className="w-1/2 text-left">{item.label}</span>
                <span className="w-1/2 text-left">
                  {item.value || "Not Available"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg">
            Product Code:{" "}
            <span className="font-semibold">{decodedDesignId}</span>
          </h2>
          <div className="flex items-center space-x-2">
            <label className="block font-medium text-gray-700">QTY</label>
            <select
              className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
              value={selectedPcs}
              onChange={handlePcsChange}
            >
              {Array.from({ length: 50 }, (_, i) => i + 1).map((pcs) => (
                <option key={pcs} value={pcs}>
                  {pcs}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-full p-4 mb-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Divine Solitaire</h2>
            <div className="text-lg">
              ₹<span className="font-semibold">48,449 apx - </span>₹
              <span className="font-semibold">68,449 apx</span>
            </div>
          </div>

          <div className="w-full p-4 bg-[#F9F6ED] border border-gray-300 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg mb-2">
                  <span>Shape : </span>
                  <span className="font-semibold">Round</span>
                </div>
                <div className="text-lg mb-2">
                  <span>Color : </span>
                  <span className="font-semibold">D - E</span>
                </div>
              </div>
              <div>
                <div className="text-lg mb-2">
                  <span>Carat : </span>
                  <span className="font-semibold">0.30 - 0.38</span>
                </div>
                <div className="text-lg mb-2">
                  <span>Clarity : </span>
                  <span className="font-semibold">IF - VVSI</span>
                </div>
              </div>
            </div>
          </div>
          <p className="my-4">
            *The jewellery available in 0.30 to 0.38 carat range. Solitaire Pcs{" "}
            {selectedPcs}
          </p>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg text-blue-600">
              Customise your Divine Solitaire
            </h2>
            <div className="text-lg underline text-blue-600">
              <span>Check available Price</span>
            </div>
          </div>
        </div>

        <div className="w-full p-4 bg-[#F9F6ED] rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Divine Mount</h2>
            <div className="text-lg">
              ₹<span className="font-semibold">33,443 apx - </span>₹
              <span className="font-semibold">33,443 apx</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <label className="block text-lg font-medium text-gray-700">
                Metal Color
              </label>
              <select
                className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                value={selectedPcs}
                onChange={handlePcsChange}
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map((pcs) => (
                  <option key={pcs} value={pcs}>
                    {pcs}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-lg">
              <span>Metal Weight : </span>
              <span className="font-semibold">300 gms</span>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-2">
              <label className="block text-lg font-medium text-gray-700">
                Ring Size :
              </label>
              <div className="flex space-x-2">
                <select
                  className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                  value={selectedPcs}
                  onChange={handlePcsChange}
                >
                  {Array.from({ length: 16 }, (_, i) => i + 4).map((pcs) => (
                    <option key={pcs} value={pcs}>
                      {pcs}
                    </option>
                  ))}
                </select>

                <select
                  className="p-2 border border-gray-300 rounded bg-[#F9F6ED]"
                  value={selectedPcs}
                  onChange={handlePcsChange}
                >
                  {Array.from({ length: 16 }, (_, i) => i + 4).map((pcs) => (
                    <option key={pcs} value={pcs}>
                      {pcs}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="inline-flex">
              <label className="w-20 block text-lg font-medium text-gray-700"></label>
              <p className="text-sm text-gray-600 mt-2">
                Ring Size OP Range : 4 to 16.
              </p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex items-center space-x-2">
              <div className="text-lg">
                <span>Side Daimond :</span>
                <span className="font-semibold">10/0.6cts IJ SI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full space-x-6">
          <div className="w-full p-2 my-4 border border-black rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-sm">Min</h2>
              <h2 className="text-sm">Max</h2>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg">
                ₹<span className="font-semibold">82,433 apx</span>
              </div>
              <div className="text-lg">
                ₹<span className="font-semibold">1,01,593 apx</span>
              </div>
            </div>
          </div>
          <div className="w-full p-4 my-4 flex items-center justify-center space-x-2">
            <button className="w-full flex items-center p-2 py-4 bg-black text-white rounded-lg space-x-2 justify-center">
              <ShoppingCartIcon />
              <span className="text-lg font-semibold">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JewelleryDetailScreen;
