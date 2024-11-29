import React, { useState, useEffect } from "react";

interface AddRemarkModalProps {
  isVisible: boolean;
  closeModal: () => void;
  saveRemark: (newRemark: string) => void;
  remark: string;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  isVisible,
  closeModal,
  saveRemark,
  remark,
}) => {
  const [newRemark, setNewRemark] = useState(remark);

  // Reset the local state when the modal becomes visible or the `remark` changes
  useEffect(() => {
    if (isVisible) {
      setNewRemark(remark);
    }
  }, [isVisible, remark]);

  const handleSave = () => {
    saveRemark(newRemark);
    setNewRemark(""); // Reset remark input
    closeModal();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg transform transition-transform duration-300">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Remark</h2>
        <textarea
          value={newRemark}
          onChange={(e) => setNewRemark(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded transition duration-300 transform hover:bg-gray-400"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded transition duration-300 transform hover:bg-gray-800"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRemarkModal;
