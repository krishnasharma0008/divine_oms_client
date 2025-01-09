import React from "react";
import { useCustomerOrderStore } from "@/store/customerorderStore";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PJDetailModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { customerOrder } = useCustomerOrderStore();

  const modalData = [
    { label: "Partner Jewellery", value: customerOrder?.cust_name },
    { label: "Store", value: customerOrder?.store },
    { label: "Address", value: customerOrder?.address },
    { label: "Contact Detail", value: customerOrder?.contactno },
    {
      label: "Item Type",
      value: customerOrder?.product_type
        ? customerOrder.product_type.charAt(0).toUpperCase() +
          customerOrder.product_type.slice(1)
        : "",
    },
    { label: "Order Type", value: customerOrder?.order_type },
    { label: "Order For", value: customerOrder?.order_for },
    //{ label: "Incentive/Deduction", value: "1 % Extra" },
    //{ label: "Delivery", value: "Within 28 working days" },
    //{ label: "Price List", value: "Price at the time of booking." },
    //{ label: "Courier charges", value: "Not charged" },
    //{ label: "Comments", value: "Invoice will go with 1% credit note" },
    // {
    //   label: "Expected Date",
    //   value: customerOrder?.exp_dlv_date,
    // },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-hidden={!isOpen}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-1/2 relative"
        role="document"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          aria-label="Close modal"
        >
          ✕
        </button>
        {/* Modal Content */}
        <h2
          id="modal-title"
          className="text-xl font-semibold mb-4 text-center shadow-md p-2"
        >
          Order-Pj-Detail
        </h2>
        {/* Scrollable Content */}
        <div className="max-h-96 overflow-y-auto">
          {modalData.map((item, index) => (
            <div
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
              } p-2 mb-2 rounded-md flex justify-between items-center`}
            >
              <span className="w-1/2 font-semibold text-left">
                {item.label} :-
              </span>
              <span className="w-1/2 text-left">{item.value || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PJDetailModal;
