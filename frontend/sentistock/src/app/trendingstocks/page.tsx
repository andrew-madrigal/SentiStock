'use client'
import { useState } from 'react';
import Select from 'react-select';

const options = [
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
]
export default function Page() {
  const[selectedOption, setSelectedOption] = useState(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  }
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Trending Stocks Page</h1>
        <Select
                options={options} 
                value = {selectedOption}
                onChange={handleChange}
                isSearchable={true}
            />
      </div>
      
    );
  }
  