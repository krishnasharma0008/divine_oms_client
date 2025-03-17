import React, { useEffect, useState } from "react";
import { MessageCloseIcon } from "../icons";

const AutoClosePopup: React.FC<{ message: string; duration?: number }> = ({
  message,
  duration = 5,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 10000);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [timeLeft]);

  if (!isOpen) return null;

  return (
    <>
      {message !== "" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="relative border-[#CFAD61] border-[3px] bg-[#FFD674FC] rounded-lg w-1/2 p-6 flex flex-col items-center"
            style={{
              background: "linear-gradient(90deg, #FFFAEE 0%, #FFFCF4 100%)",
            }}
          >
            <div className="w-full flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
              >
                <MessageCloseIcon className="w-[20px] h-[20px]" />
              </button>
            </div>
            <div className="w-full flex justify-center py-[59px]">
              {/* Centered Message */}
              <p className="text-lg font-semibold text-center">{message}</p>
            </div>

            {/* Countdown Timer (Below the message and aligned to the right) */}
            <div className="w-full flex justify-end">
              <div className="absolute w-[39px] h-[39px] bottom-2 right-2 flex items-center justify-center border-4 bg-[#FFDF91E5] border-[#FFDF91E5] rounded-full">
                <p className="text-black bg-[#FFDF91E5] font-bold">
                  {timeLeft}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoClosePopup;
