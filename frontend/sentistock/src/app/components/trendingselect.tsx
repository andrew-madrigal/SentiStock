'use client';

import { useState } from 'react';
import Select from 'react-select';

type StockOption = {
  value: string;
  label: string;
};

const options: StockOption[] = [
    {value:"Sezzle", label: "Sezzle (SEZL)" },
    {value:"InterDigital", label: "InterDigital (IDCC)" },
    {value:"Agilysys", label: "Agilysys (AGYS)" },
    {value:"Box", label: "Box (BOX)" },
    {value:"Zeta Global Holdings", label: "Zeta Global Holdings(ZETA)" },
    {value:"Clear Secure", label: "Clear Secure (YOU)" },
    {value:"Payoneer Global", label: "Payoneer Global (PAYO)" },
    {value:"Paymentus Holdings", label: "Paymentus Holdings (PAY)" },
    {value:"Stride", label: "Stride (LRN)" },
    {value:"Upwork", label: "Upwork (UPWK)" },
    {value:"Cleanspark", label: "Cleanspark (CLSK)" },
    {value:"Cipher Mining", label: "Cipher Mining (CIFR)" },
    {value:"Cactus", label: "Cactus (WHD)" },
    {value:"Atlas Energy Solutions", label: "Atlas Energy Solutions (AESI)" },
    {value:"Post Holdings", label: "Post Holdings (POST)" },
    {value:"Archrock", label: "Archrock (AROC)" },
    {value:"Louisiana-Pacific", label: "Louisiana-Pacific (LPX)" },
    {value:"Lantheus", label: "Lantheus (LNTH)" },
    {value:"Lematire Vascular", label: "Lematire Vascular (LMAT)" },
    {value:"Catalyst Pharmaceuticals", label: "Catalyst Pharmaceuticals (CPRX)" },
    {value:"Concept Theraputics", label: "Concept Theraputics (CORT)" },
    {value:"Select Medical Holdings", label: "Select Medical Holdings (SEM)" },
    {value:"Abercrombie & Fitch", label: "Abercrombie & Fitch (ANF)" },
    {value:"Warby Parker", label: "Warby Parker (WRBY)" },
    {value:"Ollie's Bargain Outlet Holdings", label: "Ollie's Bargain Outlet Holdings (OLLI)" },
    {value:"e.l.f Beauty", label: "e.l.f Beauty (ELF)" },
    {value:"Dutch Bros. Coffee", label: "Dutch Bros. Coffee (BROS)" },
    {value:"First Service", label: "First Service (FSV)" },
    {value:"Terreno Realty", label: "Terreno Realty(TRNO)" },
    {value:"Colliers International", label: "Colliers International (COGI)" },
    {value:"Millrose Properties, Inc.", label:"Millrose Properties, Inc. (MRP)"},
    {value:"ABM Industries", label:"AMB Industries (ABM)"}
];

const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#fff', // or make it dark if you prefer
      color: '#000', // doesn't directly control dropdown text, but placeholder/input
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#000' // selected value text color
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#adc178' : '#fff',
      color: '#000', // dropdown option text color
      cursor: 'pointer'
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      color: '#000',
    }),
  };
  

export default function TrendingSelectClient() {
  const [selectedOption, setSelectedOption] = useState<StockOption | null>(null);

  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-bold">Trending Stocks Page</h1>
      <p className="text-lg">
        Select a stock from the dropdown below to view its corresponding prediction.
      </p>
      <Select
        options={options}
        value={selectedOption}
        onChange={setSelectedOption}
        isSearchable
        placeholder="Select a company..."
        styles={customStyles}
      />
      {selectedOption && (
          <p className="text-sm text-gray-400 mt-2">
            You selected: <span className="font-semibold">{selectedOption.label}</span>
          </p>
        )}
    </div>
  );
}
