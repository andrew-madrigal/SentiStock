"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { ChartOptions, ChartData } from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface StockGraphProps {
  selectedCompany: string;
  selectedTimeframe: number | null;
}

const data: ChartData<"line"> = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Price",
      data: [100, 105, 102, 110, 108],
      borderColor: "#4CAF50",
      backgroundColor: "rgba(76, 175, 80, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 5,
    },
  ],
};

const options: ChartOptions<"line"> = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: false,
    },
  },
};

export default function StockGraph({ selectedCompany, selectedTimeframe }: StockGraphProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {selectedCompany}'s Projected Stock Movement
        {selectedTimeframe !== null && `, Next ${selectedTimeframe} ${selectedTimeframe === 1 ? "day" : "days"}`}
      </h3>
      <Line data={data} options={options} />
    </div>
  );
}
