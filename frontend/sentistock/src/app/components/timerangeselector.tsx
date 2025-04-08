"use client";

import { useState } from "react";

interface TimeRangeSelectorProps {
  selectedTimeframe: number | null;
  onSelect: (days: number) => void;
}

export default function TimeRangeSelector({ selectedTimeframe, onSelect }: TimeRangeSelectorProps) {
  const [sliderValue, setSliderValue] = useState(selectedTimeframe || 7);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    onSelect(value);
  };

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <label htmlFor="time-slider" className="mb-2 text-gray-800 dark:text-white text-sm">
        Predict stock movement for the next {sliderValue} {sliderValue === 1 ? "day" : "days"}
      </label>
      <input
        id="time-slider"
        type="range"
        min="1"
        max="30"
        value={sliderValue}
        onChange={handleSliderChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 w-full mt-2">
        <span>1d</span>
        <span>7d</span>
        <span>14d</span>
        <span>21d</span>
        <span>30d</span>
      </div>
    </div>
  );
}
