import React from "react";

export interface JewelleryHomedivProps {
  design_no: string;
  olddesign_no: string;
  g_wt: string;
  d_size: string;
  imgurl: string;
  isnew: boolean;
  isExclusive?: boolean;
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
  isExclusive = false,
  onImgClick,
}) => {
  return (
    <article className="jewellery-item group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md">
      {(isnew || isExclusive) && (
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {isnew && (
            <span className="rounded-full bg-[#A9C5C6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-900">
              New
            </span>
          )}
          {isExclusive && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Exclusive
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onImgClick}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-50 p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        aria-label={`View details for ${design_no}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgurl}
          alt={`Jewellery design ${design_no}`}
          width={200}
          height={200}
          onError={(event) => {
            const imgElement = event.target as HTMLImageElement;
            if (imgElement) {
              imgElement.src = "/jewellery/NoImageBig.jpg";
            }
          }}
          loading="lazy"
          className="h-full max-h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-44 lg:max-h-48"
        />
      </button>

      <div className="flex flex-1 flex-col gap-2 border-t border-gray-100 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {design_no}
          </p>
          {olddesign_no && (
            <p className="shrink-0 text-[11px] text-gray-500">
              Old: {olddesign_no}
            </p>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-gray-600 sm:text-xs">
          <div>
            <span className="text-gray-400">G.WT</span>
            <p className="font-medium text-gray-800">
              {parseFloat(g_wt).toFixed(3)} apx.
            </p>
          </div>
          <div className="text-right">
            <span className="text-gray-400">D.SIZE</span>
            <p className="font-medium text-gray-800">{d_size}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default JewelleryHomeDiv;
