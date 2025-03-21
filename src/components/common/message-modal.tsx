import React from "react";

interface ModalProps {
  title: string;
  //onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

const MessageModal: React.FC<ModalProps> = ({
  title,
  //onClose,
  onConfirm,
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-1/3 p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end space-x-4">
          {/* <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button> */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
