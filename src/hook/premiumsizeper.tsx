import { useState, useCallback } from "react";

interface PremiumSize {
  size: string;
  percentage: number;
}

const premiumSizeMapping: PremiumSize[] = [
  { size: "0.18-0.19", percentage: 0 },
  { size: "0.2-0.22", percentage: 5 },
  { size: "0.23-0.24", percentage: 0 },
  { size: "0.25-0.26", percentage: 5 },
  { size: "0.27-0.29", percentage: 7 },
  { size: "0.3-0.34", percentage: 0 },
  { size: "0.35-0.38", percentage: 10 },
  { size: "0.39-0.41", percentage: 0 },
  { size: "0.42-0.44", percentage: 5 },
  { size: "0.45-0.46", percentage: 0 },
  { size: "0.47-0.49", percentage: 8 },
  { size: "0.5-0.59", percentage: 0 },
  { size: "0.6-0.64", percentage: 0 },
  { size: "0.65-0.69", percentage: 6 },
  { size: "0.7-0.71", percentage: 0 },
  { size: "0.72-0.74", percentage: 3 },
  { size: "0.75-0.79", percentage: 7 },
  { size: "0.8-0.81", percentage: 0 },
  { size: "0.82-0.84", percentage: 7 },
  { size: "0.85-0.89", percentage: 10 },
  { size: "0.9-0.91", percentage: 0 },
  { size: "0.92-0.94", percentage: 8 },
  { size: "0.95-0.99", percentage: 12 },
  { size: "1-1.03", percentage: 4 },
  { size: "1.04-1.23", percentage: 4 },
  { size: "1.24-1.29", percentage: 0 },
  { size: "1.3-1.39", percentage: 4 },
  { size: "1.4-1.49", percentage: 10 },
  { size: "1.5-1.59", percentage: 0 },
  { size: "1.6-1.69", percentage: 5 },
  { size: "1.7-1.74", percentage: 0 },
  { size: "1.75-1.79", percentage: 5 },
  { size: "1.8-1.99", percentage: 10 },
  { size: "2-2.19", percentage: 0 },
  { size: "2.2-2.29", percentage: 8 },
  { size: "2.3-2.49", percentage: 12 },
  { size: "2.5-2.59", percentage: 0 },
  { size: "2.6-2.69", percentage: 5 },
  { size: "2.7-2.99", percentage: 10 },
];

const usePremiumSizeAndPercentage = () => {
  const [premiumSize, setPremiumSize] = useState<string>("");
  const [premiumPercentage, setPremiumPercentage] = useState<string>("");

  // Function to get the premium percentage based on the selected size
  const getPremiumPercentage = useCallback((selectedSize: string): string => {
    const premiumSizeData = premiumSizeMapping.find((item) => item.size === selectedSize);
    return premiumSizeData ? premiumSizeData.percentage.toString() : "0";
  }, []);

  // Function to get premium size options based on a given carat size
  const getPremiumSizeOptions = useCallback((size: string): string[] => {
    const [minSize, maxSize] = size.split("-").map(parseFloat); // Extract min and max values from the size range

    // Filter the premium sizes based on the provided size range
    return premiumSizeMapping
      .filter((option) => {
        const [optionMin, optionMax] = option.size.split("-").map(parseFloat);
        return (
          (optionMin >= minSize && optionMin <= maxSize) || 
          (optionMax >= minSize && optionMax <= maxSize)
        );
      })
      .map((option) => option.size); // Return the filtered premium sizes
  }, []);

  // Expose state and functions for use in components
  return {
    premiumSize,
    setPremiumSize,
    premiumPercentage,
    setPremiumPercentage,
    getPremiumPercentage,
    getPremiumSizeOptions,
  };
};

export default usePremiumSizeAndPercentage;
