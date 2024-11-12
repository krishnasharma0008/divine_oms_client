import React, { useMemo } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJValue: string | null;
  selectedSValue: string | null;
  selectedAdd: string | null;
  selectedContact: string | null;
  selectedValue: string | null;
  // selectedOrderValue: string | null;
  // selectedOrderForValue: string | null;
  // selectedDate: string | null;
}

const PJDetailModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedJValue,
  selectedSValue,
  selectedAdd,
  selectedContact,
  selectedValue,
  // selectedOrderValue,
  // selectedOrderForValue,
  // selectedDate,
}) => {
  // Memoizing the modal data before the early return
  const modalData = useMemo(
    () => [
      { label: "Partner Jewellery", value: selectedJValue },
      { label: "Store", value: selectedSValue },
      { label: "Address", value: selectedAdd },
      { label: "Contact Detail", value: selectedContact },
      { label: "Item Type", value: selectedValue },
      //{ label: "Order Type", value: selectedOrderForValue },
      { label: "Incentive/Deduction", value: "1 % Extra" },
      { label: "Delivery", value: "Within 28 working days" },
      { label: "Price List", value: "Price at the time of booking." },
      { label: "Courier charges", value: "Not charged" },
      { label: "Comments", value: "Invoice will go with 1% credit note" },
      { label: "Expected Date", value: "" },
    ],
    [
      selectedJValue,
      selectedSValue,
      selectedAdd,
      selectedContact,
      selectedValue,
    ]
  );

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
              <span className="w-1/2 text-left">
                {item.value || "Not Available"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PJDetailModal;
