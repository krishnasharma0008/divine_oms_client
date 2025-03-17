"use client";

import ImageGallery from "@/components/common/image-gallery";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShoppingCartIcon from "@/components/icons/shopping-cart-icon";
import { getJewelleryProductList } from "@/api/jewellery-detail";
import NotificationContext from "@/context/notification-context";
import { JewelleryDetail } from "@/interface";

interface Item {
  srno: number;
  slab: string;
  name: string;
  size: string;
  metal: string;
  mrp: number;
}

function JewelleryStockScreen() {
  const { id } = useParams<{ id: string }>();
  const [jewelleryDetails, setJewelleryDetails] = useState<JewelleryDetail>();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const { notifyErr } = useContext(NotificationContext);

  useEffect(() => {
    console.log(id);
    if (!id || id.trim() === "") {
      notifyErr("Invalid jewellery ID.");
      return;
    }
    FetchData(id);
  }, []);

  const FetchData = async (itemId: string) => {
    try {
      const response = await getJewelleryProductList(itemId);
      setJewelleryDetails(response.data.data);
    } catch (error) {
      notifyErr("An error occurred while fetching data.");
    } finally {
      //setLoading(false);
    }
  };

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
    { label: "Solitaire", value: "-" },
    { label: "Metal Weight", value: "-" },
    { label: "Metal", value: "-" },
    { label: "Ring Size", value: "-" },
    { label: "Side Diamond", value: "-" },
  ];

  // Mock data for the table
  const tableData = [
    {
      srno: 1,
      slab: "A",
      name: "Divine Solitaire",
      size: "10",
      metal: "Gold",
      mrp: 48449,
    },
    {
      srno: 2,
      slab: "B",
      name: "Divine Mount",
      size: "12",
      metal: "Silver",
      mrp: 33443,
    },
    // Add more rows as needed
  ];

  const handleCheckboxChange = (item: Item, isChecked: boolean) => {
    let newSelectedItems = [...selectedItems];

    if (isChecked) {
      newSelectedItems.push(item);
    } else {
      newSelectedItems = newSelectedItems.filter(
        (selectedItem) => selectedItem.srno !== item.srno
      );
    }

    setSelectedItems(newSelectedItems);

    // Recalculate total amount
    const newTotal = newSelectedItems.reduce(
      (sum, currentItem) => sum + currentItem.mrp,
      0
    );
    setTotalAmount(newTotal);
  };

  return (
    <div className="flex bg-white">
      {/* Image Gallery Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <ImageGallery msg="" images={imageGalleryImages} />
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
                <span className="w-1/2 text-right">
                  {item.value || "Not Available"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">
            <span className="font-semibold">
              {jewelleryDetails?.Product_category}
              {" - "}
              {jewelleryDetails?.Item_number}
            </span>
          </h2>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Product Table</h2>

          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">SrNo</th>
                <th className="border px-4 py-2">Slab</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Size</th>
                <th className="border px-4 py-2">Metal</th>
                <th className="border px-4 py-2">MRP</th>
                <th className="border px-4 py-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.srno}</td>
                  <td className="border px-4 py-2">{item.slab}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.size}</td>
                  <td className="border px-4 py-2">{item.metal}</td>
                  <td className="border px-4 py-2">₹{item.mrp}</td>
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(item, e.target.checked)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold border border-[#e5e7eb] p-2">
              ₹{totalAmount}
            </h3>
            <button className="flex px-6 py-2 bg-black text-white rounded-lg">
              <ShoppingCartIcon className="mr-2" />
              <span className="text-lg font-semibold">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JewelleryStockScreen;
