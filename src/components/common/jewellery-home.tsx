import React from "react";
//import { EyeIcon } from "../icons";

export interface JewelleryHomedivProps {
  //Item_id: number;
  design_no: string;
  olddesign_no: string;
  g_wt: string;
  d_size: string;
  imgurl: string;
  onImgClick?: () => void;
  onStkClick?: () => void;
}

const JewelleryHomeDiv: React.FC<JewelleryHomedivProps> = ({
  //Item_id,
  design_no,
  olddesign_no,
  g_wt,
  d_size,
  imgurl,
  onImgClick,
  onStkClick,
}) => {
  

  return (
    <div className="w-full border rounded-md items-center justify-center group relative overflow-hidden jewellery-item">
      <div className="p-4 flex justify-center items-center relative ">
        {/* Image with hover magnify effect */}
        {/* <Link href={`/jewellery-detail/${id}`}> */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgurl}
          alt={`${design_no}`}
          width={200}
          height={60}
          onError={(event) => {
            const imgElement = event.target as HTMLImageElement;
            if (imgElement) {
              imgElement.src = "/jewellery/NoImageBig.jpg";
            }
          }}
          onClick={onImgClick}
          className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-110 group-hover:cursor-pointer"
        />
        {/* </Link> */}
        {/* View button with eye icon, appears on hover */}
        {/*<button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-10 h-10 bg-black text-gray-700 opacity-0 border border-black group-hover:opacity-100 hover:bg-white flex items-center justify-center transition-opacity duration-300"
          title="Quick View"
          onClick={onClick}
        >
          <EyeIcon className="fill-black" />
        </button>*/}
      </div>
      <div className="p-4">
        <div className="grid gap-3">
          <div className="w-full flex justify-center">
            <p className="text-center text-gray-700 font-Montserrat text-xl font-semibold leading-6">
              {design_no}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-left text-gray-700 font-montserrat font-semibold text-base">
              Old :&nbsp; {olddesign_no}
            </p>

            <div>
              <p
                className="text-right text-sky-600 font-montserrat font-normal text-sm underline-offset-1 cursor-pointer"
                onClick={onStkClick}
              >
                In Stock
              </p>
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <div>
              <p className="text-left text-gray-700 font-montserrat font-normal text-sm">
                G.WT:
              </p>
              <p className="text-left text-gray-700 font-montserrat font-normal text-sm">
                {g_wt} apx.
              </p>
            </div>
            <div>
              <p className="text-left text-gray-700 font-montserrat font-normal text-sm">
                D.SIZE:
              </p>
              <p className="text-left text-gray-700 font-montserrat font-normal text-sm">
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
