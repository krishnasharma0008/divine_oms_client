import React from "react";

export interface JewelleryHomedivProps {
  design_no: string;
  olddesign_no: string;
  g_wt: string;
  d_size: string;
  imgurl: string;
  isnew: boolean;
  onImgClick?: () => void;
  onStkClick?: () => void;
}

const JewelleryHomeDiv: React.FC<JewelleryHomedivProps> = ({
  design_no,
  olddesign_no,
  g_wt,
  d_size,
  imgurl,
  isnew,
  onImgClick,
  onStkClick,
}) => {
  return (
    <div className="w-full border rounded-md group relative jewellery-item hover:shadow-lg transition-shadow">
      {/* Ribbon for New Launch */}
      {isnew && (
        <>
          <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden z-10">
            <div
              className="absolute top-[18px] -left-8 w-36 bg-[#A9C5C6] text-black text-xs font-semibold py-[5px] text-center rotate-[-45deg] shadow-lg"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 93% 50%, 100% 100%, 0 100%, 7% 50%)",
              }}
            >
              <span className="px-2">New Launch</span>

              {/* Curved Ends */}
            </div>
          </div>
          <div className="absolute left-[83px] top-[0px] w-2 h-px bg-[#A9C5C6] z-11" />
          <div className="absolute -left-[0px] bottom-[125px] w-px h-2 bg-[#A9C5C6] transform z-11" />
        </>
      )}

      <div className="flex justify-center items-center relative p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgurl}
          alt={`Jewellery design ${design_no}`}
          width={200}
          height={60}
          onError={(event) => {
            const imgElement = event.target as HTMLImageElement;
            if (imgElement) {
              imgElement.src = "/jewellery/NoImageBig.jpg";
            }
          }}
          onClick={onImgClick}
          loading="lazy"
          className="object-contain w-full h-36 transition-transform duration-300 transform group-hover:scale-110 cursor-pointer"
        />
      </div>

      <div className="px-2 pb-2">
        <div className="grid">
          <div className="w-full flex justify-between">
            <p className="text-left text-gray-700 font-Montserrat text-sm font-semibold">
              {design_no}
            </p>
            <p className="text-left text-gray-700 font-montserrat font-semibold text-sm">
              Old :&nbsp; {olddesign_no}
            </p>
          </div>

          {onStkClick && (
            <div className="flex justify-end">
              <p
                className="text-right text-sky-600 font-montserrat font-normal text-sm underline-offset-1 cursor-pointer"
                onClick={onStkClick}
                tabIndex={0}
              >
                In Stock
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex">
              <p className="text-left text-gray-700 font-montserrat font-normal text-xs">
                G.WT :&nbsp;
              </p>
              <p className="text-left text-gray-700 font-montserrat font-normal text-xs">
                {parseFloat(g_wt).toFixed(3)} apx.
              </p>
            </div>
            <div className="flex">
              <p className="text-left text-gray-700 font-montserrat font-normal text-xs">
                D.SIZE :&nbsp;
              </p>
              <p className="text-left text-gray-700 font-montserrat font-normal text-xs">
                {d_size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryHomeDiv;
