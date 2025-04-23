'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import StockGraph from '../components/stockgraph';
import SectorPredictions from '../components/sectorpredictions';
import TimeRangeSelector from '../components/timerangeselector';

const TrendingSelect = dynamic(() => import('../components/trendingselect'), {
  ssr: false,
});

export default function Page() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<number | null>(7);
  const [selectedCompany, setSelectedCompany] = useState<string>("Apple"); // default company

  return (
    <div className="min-h-screen bg-[#F0EAD2] text-[#3d2e16] flex flex-col items-center justify-start px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold mb-4">Stock Analysis Dashboard</h1>

      <section className="w-full max-w-4xl">
        <SectorPredictions
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
        />
      </section>

      <section className="w-full max-w-4xl">
        <TimeRangeSelector
          selectedTimeframe={selectedTimeframe}
          onSelect={(val) => setSelectedTimeframe(val)}
        />
      </section>

      <section className="w-full max-w-4xl">
        <StockGraph
          selectedCompany={selectedCompany}
          selectedTimeframe={selectedTimeframe}
        />
      </section>
    </div>
  );
}
