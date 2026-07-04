"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import { CartDetail } from "@/interface";
import { formatByCurrencyINR } from "@/util/format-inr";
import { getCartPartnerLabel } from "@/util/cart-partner";//, groupCartByPartner

function getProductImage(item: CartDetail): string {
  if (item.product_type.toLowerCase() === "jewellery") {
    return item.image_url ?? "";
  }
  if (item.product_type.toLowerCase() === "solitaire") {
    if (item.solitaire_shape === "Round") return "/solitaire/image7.png";
    if (item.solitaire_shape === "Princess") return "/solitaire/image8.png";
    if (item.solitaire_shape === "Oval") return "/solitaire/image9.png";
  }
  return "/solitaire/image_9.png";
}

interface CartLineItemProps {
  item: CartDetail;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onQuantityChange: (increment: boolean) => void;
  onRemarkClick: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
}

const CartLineItem: React.FC<CartLineItemProps> = ({
  item,
  selected,
  onSelect,
  onDelete,
  onQuantityChange,
  onRemarkClick,
  onCopy,
  onEdit,
}) => {
  const [expanded, setExpanded] = useState(false);

  const designNo =
    item.product_code || item.designno || item.product_type || "—";

  const partnerName = getCartPartnerLabel(item);

  const subCategory = item.product_sub_category?.trim() || "—";

  const slab = item.solitaire_slab?.trim() || "—";
  const color = item.solitaire_color?.trim() || "—";
  const clarity = item.solitaire_quality?.trim() || "—";
  const shape = item.solitaire_shape?.trim();

  return (
    <article
      className={`rounded-lg border bg-white transition-colors ${
        selected
          ? "border-gray-900 ring-1 ring-gray-900/10"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Compact primary row */}
      <div className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          aria-label={`Select ${designNo}`}
        />

        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-gray-50 sm:h-[72px] sm:w-[72px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getProductImage(item)}
            alt={designNo}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/jewellery/NoImageBig.jpg";
            }}
            className="h-full w-full object-contain p-1"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
            {designNo}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {partnerName}
            {subCategory !== "—" && (
              <>
                <span className="mx-1 text-gray-300">·</span>
                {subCategory}
              </>
            )}
          </p>
          <p className="mt-1 text-xs leading-snug text-gray-600">
            <span className="text-gray-500">Slab </span>
            <span className="font-medium text-gray-800">{slab}</span>
            {slab !== "—" && !slab.toLowerCase().includes("ct") ? " cts" : ""}
            <span className="mx-1.5 text-gray-300">|</span>
            <span className="text-gray-500">Color </span>
            <span>{color}</span>
            <span className="mx-1.5 text-gray-300">|</span>
            <span className="text-gray-500">Clarity </span>
            <span>{clarity}</span>
            {shape && (
              <>
                <span className="mx-1.5 text-gray-300">|</span>
                <span>{shape}</span>
              </>
            )}
          </p>
          <p className="mt-1 text-xs font-semibold text-gray-900 sm:hidden">
            {formatByCurrencyINR(item.product_amt_min)} –{" "}
            {formatByCurrencyINR(item.product_amt_max)}
          </p>
        </div>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {formatByCurrencyINR(item.product_amt_min)} –{" "}
            {formatByCurrencyINR(item.product_amt_max)}
          </p>
          <p className="text-[10px] text-gray-500">
            Qty {item.product_qty || 1}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded text-sm text-gray-700 hover:bg-white"
            onClick={() => onQuantityChange(false)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[1.25rem] text-center text-xs font-medium">
            {item.product_qty || 1}
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded text-sm text-gray-700 hover:bg-white"
            onClick={() => onQuantityChange(true)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="hidden shrink-0 items-center gap-1 rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 sm:flex"
          aria-label={`Remove ${designNo}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 8.24A2.75 2.75 0 008.596 16h6.808a2.75 2.75 0 002.742-2.53l.841-8.24.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.496.06l-.37 7.214a.75.75 0 001.494.076L8.58 7.72zm3.44.06a.75.75 0 00-1.494-.06l-.37 7.214a.75.75 0 001.494.076l.37-7.214zM11 9.5a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
              clipRule="evenodd"
            />
          </svg>
          Remove
        </button>
      </div>

      {/* Mobile remove + expand toggle */}
      <div className="flex items-center justify-between border-t border-gray-100 px-2.5 py-1.5 sm:hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          {expanded ? "Hide details" : "More details"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-medium text-red-600 underline-offset-2 hover:underline"
        >
          Remove
        </button>
      </div>

      <div className="hidden border-t border-gray-100 sm:block">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center gap-1 px-3 py-1.5 text-left text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
          {expanded ? "Hide order & mount details" : "Show order & mount details"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-3 py-2.5 text-xs text-gray-600">
          <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            <span>
              Order for:{" "}
              <span className="text-gray-800">{item.order_for || "—"}</span>
            </span>
            <span>
              Store:{" "}
              <span className="text-gray-800">{item.customer_branch || "—"}</span>
            </span>
            {item.old_varient && (
              <span>
                Old code:{" "}
                <span className="text-gray-800">{item.old_varient}</span>
              </span>
            )}
            {item.collection && (
              <span>
                Collection:{" "}
                <span className="text-gray-800">{item.collection}</span>
              </span>
            )}
            {item.product_type === "jewellery" && (
              <span>
                Metal:{" "}
                <span className="text-gray-800">
                  {item.metal_color || "—"} · {item.metal_purity || "—"} ·{" "}
                  {item.metal_weight?.toFixed(3) || "—"} g
                </span>
              </span>
            )}
            {item.product_type === "jewellery" &&
              item.size_from !== "-" &&
              Number(item.size_from) > 3 && (
                <span>
                  Size:{" "}
                  <span className="text-gray-800">{item.size_from}</span>
                </span>
              )}
            <span>
              EDD:{" "}
              <span className="text-gray-800">
                {dayjs(item.exp_dlv_date).isValid()
                  ? dayjs(item.exp_dlv_date).format("DD MMM YYYY")
                  : "—"}
              </span>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-gray-200/80 pt-2">
            <button
              type="button"
              className="font-medium text-gray-800 underline-offset-2 hover:underline"
              onClick={onRemarkClick}
            >
              {item.cart_remarks ? "Edit remark" : "Add remark"}
            </button>
            {item.cart_remarks && (
              <span className="truncate text-gray-500">{item.cart_remarks}</span>
            )}
            {item.product_type === "jewellery" && onCopy && onEdit && (
              <>
                <button
                  type="button"
                  className="rounded border border-gray-300 bg-white px-2 py-0.5 font-medium text-gray-700 hover:bg-gray-100"
                  onClick={onCopy}
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="rounded bg-gray-900 px-2 py-0.5 font-medium text-white hover:bg-gray-800"
                  onClick={onEdit}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default CartLineItem;
