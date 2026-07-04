"use client";

import React, { useMemo, useState } from "react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ActiveFilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface FilterSectionProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
    aria-hidden
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  count = 0,
  defaultOpen = false,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <span className="flex items-center gap-2">
          {count > 0 && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
          <ChevronIcon open={open} />
        </span>
      </button>
      {open && <div className="pb-4 pt-0">{children}</div>}
    </div>
  );
};

interface SingleSelectListProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

const SingleSelectList: React.FC<SingleSelectListProps> = ({
  options,
  selected,
  onChange,
}) => (
  <ul className="space-y-1">
    {options.map((option) => {
      const isSelected = selected === option.value;
      return (
        <li key={option.value}>
          <button
            type="button"
            onClick={() => onChange(isSelected ? "" : option.value)}
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition ${
              isSelected
                ? "bg-gray-50 font-medium text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected ? "border-gray-900" : "border-gray-300"
              }`}
            >
              {isSelected && (
                <span className="h-2 w-2 rounded-full bg-gray-900" />
              )}
            </span>
            <span>{option.label}</span>
          </button>
        </li>
      );
    })}
  </ul>
);

interface SingleSelectPillsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

const SingleSelectPills: React.FC<SingleSelectPillsProps> = ({
  options,
  selected,
  onChange,
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((option) => {
      const isSelected = selected === option.value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(isSelected ? "" : option.value)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
            isSelected
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

interface PillMultiSelectProps {
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const PillMultiSelect: React.FC<PillMultiSelectProps> = ({
  options,
  selected,
  onChange,
}) => {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggle(option.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
              isSelected
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

interface CheckboxListProps {
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const CheckboxList: React.FC<CheckboxListProps> = ({
  options,
  selected,
  onChange,
  searchable = false,
  searchPlaceholder = "Search...",
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="space-y-3">
      {searchable && options.length > 6 && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
      )}
      <ul className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <li className="py-2 text-sm text-gray-500">No matches found</li>
        ) : (
          filtered.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <li key={option.value}>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50 ${
                    isSelected ? "bg-gray-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(option.value)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export interface JewelleryFilterPanelProps {
  priceOptions: FilterOption[];
  exclusiveOptions: FilterOption[];
  genderOptions: FilterOption[];
  metalOptions: FilterOption[];
  portfolioOptions: FilterOption[];
  productCategory: FilterOption[];
  productSubCategory: FilterOption[];
  productCollection: FilterOption[];
  showDiscarded?: boolean;
  selectedPrice: string;
  selectedExclusive: string;
  selectedCategory: string[];
  selectedSubcategory: string[];
  selectedGender: string[];
  selectedMetal: string[];
  selectedCollection: string[];
  selectedPortfolio: string[];
  isDiscarded: boolean;
  onPriceChange: (value: string) => void;
  onExclusiveChange: (value: string) => void;
  onCategoryChange: (values: string[]) => void;
  onSubcategoryChange: (values: string[]) => void;
  onGenderChange: (values: string[]) => void;
  onMetalChange: (values: string[]) => void;
  onCollectionChange: (values: string[]) => void;
  onPortfolioChange: (values: string[]) => void;
  onDiscardedChange: (discarded: boolean) => void;
}

export const JewelleryFilterPanel: React.FC<JewelleryFilterPanelProps> = ({
  priceOptions,
  exclusiveOptions,
  genderOptions,
  metalOptions,
  portfolioOptions,
  productCategory,
  productSubCategory,
  productCollection,
  showDiscarded = false,
  selectedPrice,
  selectedExclusive,
  selectedCategory,
  selectedSubcategory,
  selectedGender,
  selectedMetal,
  selectedCollection,
  selectedPortfolio,
  isDiscarded,
  onPriceChange,
  onExclusiveChange,
  onCategoryChange,
  onSubcategoryChange,
  onGenderChange,
  onMetalChange,
  onCollectionChange,
  onPortfolioChange,
  onDiscardedChange,
}) => (
  <div className="divide-y divide-gray-200">
    <FilterSection
      title="Price"
      count={selectedPrice ? 1 : 0}
      defaultOpen
    >
      <SingleSelectList
        options={priceOptions}
        selected={selectedPrice}
        onChange={onPriceChange}
      />
    </FilterSection>

    <FilterSection
      title="Category"
      count={selectedCategory.length}
      defaultOpen
    >
      <CheckboxList
        options={productCategory}
        selected={selectedCategory}
        onChange={onCategoryChange}
        searchable
        searchPlaceholder="Search categories..."
      />
    </FilterSection>

    <FilterSection
      title="Sub category"
      count={selectedSubcategory.length}
    >
      <CheckboxList
        options={productSubCategory}
        selected={selectedSubcategory}
        onChange={onSubcategoryChange}
        searchable
        searchPlaceholder="Search sub categories..."
      />
    </FilterSection>

    <FilterSection title="Gender" count={selectedGender.length}>
      <PillMultiSelect
        options={genderOptions}
        selected={selectedGender}
        onChange={onGenderChange}
      />
    </FilterSection>

    <FilterSection title="Metal" count={selectedMetal.length}>
      <PillMultiSelect
        options={metalOptions}
        selected={selectedMetal}
        onChange={onMetalChange}
      />
    </FilterSection>

    <FilterSection
      title="Collection"
      count={selectedCollection.length}
    >
      <CheckboxList
        options={productCollection}
        selected={selectedCollection}
        onChange={onCollectionChange}
        searchable
        searchPlaceholder="Search collections..."
      />
    </FilterSection>

    <FilterSection title="Portfolio" count={selectedPortfolio.length}>
      <PillMultiSelect
        options={portfolioOptions}
        selected={selectedPortfolio}
        onChange={onPortfolioChange}
      />
    </FilterSection>

    <FilterSection title="Exclusive" count={selectedExclusive ? 1 : 0}>
      <SingleSelectPills
        options={exclusiveOptions}
        selected={selectedExclusive}
        onChange={onExclusiveChange}
      />
    </FilterSection>

    {showDiscarded && (
      <FilterSection title="Admin" count={isDiscarded ? 1 : 0}>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50">
          <input
            type="checkbox"
            checked={isDiscarded}
            onChange={(e) => onDiscardedChange(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">Show discarded items</span>
        </label>
      </FilterSection>
    )}
  </div>
);

export const ActiveFilterChips: React.FC<{
  chips: ActiveFilterChip[];
  onClearAll?: () => void;
  className?: string;
}> = ({ chips, onClearAll, className = "" }) => {
  if (chips.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      role="list"
      aria-label="Active filters"
    >
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          role="listitem"
          onClick={chip.onRemove}
          className="inline-flex max-w-full items-center gap-1 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-2 text-xs text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 sm:text-sm"
        >
          <span className="truncate">{chip.label}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0 text-gray-400"
            aria-hidden
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
        </button>
      ))}
      {onClearAll && chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline sm:text-sm"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export const FilterSearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
}> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search by product code",
  className = "",
}) => (
  <div className={`relative ${className}`}>
    <input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSubmit) {
          onSubmit();
        }
      }}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pl-10 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/10"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);
