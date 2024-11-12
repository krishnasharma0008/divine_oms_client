import React from "react";
import { EyeIcon } from "../icons";
//import { useRouter } from "next/navigation";

export interface JewelleryHomedivProps {
  design_no: string;
  g_wt: string;
  d_size: string;
  imgurl: string;
  onClick?: () => void;
}

const JewelleryHomeDiv: React.FC<JewelleryHomedivProps> = ({
  design_no,
  g_wt,
  d_size,
  imgurl,
  onClick,
}) => {
  //const router = useRouter();

  const handleImageClick = () => {
    //router.push(`/jewellery-detail/${design_no}`);
  };

  return (
    <div className="w-full border rounded-md items-center justify-center group relative overflow-hidden jewellery-item py-4">
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
          onClick={handleImageClick}
          className="w-full h-48 object-cover transition-transform duration-300 transform group-hover:scale-110"
        />
        {/* </Link> */}
        {/* View button with eye icon, appears on hover */}
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-10 h-10 bg-black text-gray-700 opacity-0 border border-black group-hover:opacity-100 hover:bg-white flex items-center justify-center transition-opacity duration-300"
          title="Quick View"
          onClick={onClick}
        >
          <EyeIcon className="fill-black" />
        </button>
      </div>
      <div className="p-4">
        <div className="grid gap-3">
          <div className="w-full flex justify-center">
            <p className="text-center text-gray-700 font-Montserrat text-xl font-semibold leading-6">
              {design_no}
            </p>
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
