// import { JewelleryDetail } from "@/interface";
// import React from "react";
// import { DiamondIcon } from "../icons";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   jewelleryItem: JewelleryDetail | null;
// }

// const JewelDetailModal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   jewelleryItem,
// }) => {
//   if (!isOpen || !jewelleryItem) return null;

//   const productData = [
//     { label: "Collection", value: "" },
//     { label: "Occasion", value: "" },
//     { label: "Style", value: "" },
//     { label: "Product Type", value: jewelleryItem.product_category },
//     { label: "Gross Weight", value: jewelleryItem.weight + " (Apx.)" },
//   ];

//   const DiamondData = [
//     { label: "Shape", value: "" },
//     { label: "Color", value: "" },
//     { label: "Clarity", value: "" },
//     { label: "Pieces", value: "" },
//     { label: "Carats Weight", value: jewelleryItem.weight + " (Apx.)" },
//     { label: "Side Diamond Clarity", value: jewelleryItem.solitaire_slab },
//   ];

//   const MetalData = [
//     { label: "Metal Type", value: jewelleryItem.bom_variant_name },
//     { label: "Metal Color", value: "18 KT" },
//     { label: "Metal Weight", value: jewelleryItem.weight + " (Apx.)" },
//   ];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//       role="dialog"
//       aria-labelledby="modal-title"
//       aria-hidden={!isOpen}
//     >
//       <div className="bg-white p-4 rounded-lg shadow-lg w-4/5 max-w-5xl relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
//           aria-label="Close modal"
//         >
//           ✕
//         </button>

//         {/* Modal Title */}
//         <h2
//           id="modal-title"
//           className="text-xl font-semibold mb-4 text-center shadow-md p-2"
//         >
//           {jewelleryItem.item_number}
//         </h2>
//         <div className="max-h-96 overflow-y-auto">
//           {/* Modal Body with Two Equal Width Divs */}
//           <div className="flex gap-4 flex-wrap">
//             {/* Left Column - Image */}
//             <div className="flex-1 border-r pr-4 mb-4">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={jewelleryItem.image_url}
//                 alt={jewelleryItem.item_number}
//                 className="w-full h-auto object-cover rounded-md"
//                 onError={(e) => {
//                   e.currentTarget.src = "/jewellery/NoImageBig.jpg"; // Fallback image
//                 }}
//               />
//             </div>

//             {/* Right Column - Textual Details */}
//             <div className="flex-1 pl-4 space-y-10">
//               {/* Design Number */}
//               <div className="flex justify-between pb-2">
//                 <span className="font-thin text-lg">
//                   {jewelleryItem.product_category}
//                   {" - "}
//                   {jewelleryItem.item_number}
//                 </span>
//               </div>

//               {/* Icon Row */}
//               <div className="flex items-center space-x-2 pb-2">
//                 <div className="h-5 w-5 bg-[#f2d186] rounded-full mr-2"></div>
//                 {jewelleryItem.bom_variant_name}
//                 <DiamondIcon className="h-5 w-5" />
//               </div>

//               {/* Features Section */}
//               <div className="flex items-center border-y-2 py-2 space-x-6">
//                 <div className="inline-flex items-center space-x-2 mr-2.5">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src="/jewellery/q-1.png"
//                     alt={jewelleryItem.item_number}
//                     className="w-[19px] h-[22px] object-cover rounded-md"
//                   />
//                   <span className="text-sm font-medium">
//                     Certified Jewellery
//                   </span>
//                 </div>

//                 <div className="inline-flex items-center space-x-2">
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src="/jewellery/q-2.png"
//                     alt={jewelleryItem.item_number}
//                     className="w-[29px] h-8 object-cover rounded-md"
//                   />
//                   <span className="text-sm font-medium">On Time Delivery</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* New Div with Three Sub-Divs (Product, Diamond, and Metal Details) */}
//           <div className="flex flex-wrap justify-between mt-6 space-y-4 lg:space-y-0">
//             <div className="flex-1 text-center border border-gray-300 p-4 mx-1 rounded-lg">
//               <h3 className="text-lg font-semibold border-b-[1px] border-black uppercase">
//                 Product Details
//               </h3>
//               {productData.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`${
//                     index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
//                   } p-2 mb-2 rounded-md flex justify-between items-center`}
//                 >
//                   <span className="w-1/2 font-semibold text-left uppercase">
//                     {item.label}
//                   </span>
//                   <span className="w-1/2 text-left">
//                     {item.value || "Not Available"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex-1 text-center border border-gray-300 p-4 mx-1 rounded-lg">
//               <h3 className="text-lg font-semibold border-b-[1px] border-black uppercase">
//                 Diamond Details
//               </h3>
//               {DiamondData.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`${
//                     index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
//                   } p-2 mb-2 rounded-md flex justify-between items-center uppercase`}
//                 >
//                   <span className="w-1/2 font-semibold text-left">
//                     {item.label}
//                   </span>
//                   <span className="w-1/2 text-left">
//                     {item.value || "Not Available"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex-1 text-center border border-gray-300 p-4 mx-1 rounded-lg">
//               <h3 className="text-lg font-semibold border-b-[1px] border-black uppercase">
//                 Metal Details
//               </h3>
//               {MetalData.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`${
//                     index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
//                   } p-2 mb-2 rounded-md flex justify-between items-center uppercase`}
//                 >
//                   <span className="w-1/2 font-semibold text-left">
//                     {item.label}
//                   </span>
//                   <span className="w-1/2 text-left">
//                     {item.value || "Not Available"}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JewelDetailModal;
