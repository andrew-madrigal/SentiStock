"use client";
import { useState, useEffect, useRef } from "react";

interface SectorPredictionsProps {
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
}

export type Sector =
  | "Energy"
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Consumer"
  | "Real Estate";

const SectorPredictions: React.FC<SectorPredictionsProps> = ({
  selectedCompany,
  setSelectedCompany,
}) => {
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState("Select an industry sector");

  const sectorDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const sectorOptions: Sector[] = [
    "Energy",
    "Technology",
    "Finance",
    "Healthcare",
    "Consumer",
    "Real Estate",
  ];

  const companiesBySector: Record<string, string[]> = {
    Energy: ["Exxon Mobil", "Chevron", "BP", "Shell", "ConocoPhillips"],
    Technology: ["Apple", "Microsoft", "Google", "Amazon", "Meta"],
    Finance: ["JPMorgan Chase", "Bank of America", "Goldman Sachs", "Morgan Stanley", "Wells Fargo"],
    Healthcare: ["Johnson & Johnson", "Pfizer", "Merck", "UnitedHealth Group", "Abbott Laboratories"],
    Consumer: ["Procter & Gamble", "Coca-Cola", "PepsiCo", "McDonald's", "Nike"],
    "Real Estate": ["Simon Property Group", "AvalonBay Communities", "Equity Residential", "Public Storage", "Welltower"],
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
        setIsSectorDropdownOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSectorDropdownClick = () => {
    setIsSectorDropdownOpen(!isSectorDropdownOpen);
    setIsCompanyDropdownOpen(false);
  };

  const handleCompanyDropdownClick = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
    setIsSectorDropdownOpen(false);
  };

  const handleSectorSelect = (sector: string) => {
    setSelectedSector(sector);
    setSelectedCompany("Select a company");
    setIsSectorDropdownOpen(false);
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsCompanyDropdownOpen(false);
  };

  return (
    <div className="w-full bg-[#ADC178] py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Industry Sector Analysis</h2>
        <p className="text-base text-gray-700 mb-4">
          Analyze market trends, sentiment, and investment opportunities across different economic sectors.
        </p>

        <div className="flex flex-col items-center space-y-4">
          {/* Sector Dropdown */}
          <div className="relative max-w-xs w-full" ref={sectorDropdownRef}>
            <button
              onClick={handleSectorDropdownClick}
              className="w-full bg-white text-gray-800 py-2 px-4 rounded border border-gray-300 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
            >
              <span>{selectedSector}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isSectorDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isSectorDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
                {sectorOptions.map((sector, index) => (
                  <div
                    key={index}
                    onClick={() => handleSectorSelect(sector)}
                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                  >
                    {sector}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Dropdown - Only show if a sector is selected */}
          {selectedSector !== "Select an industry sector" && (
            <div className="relative max-w-xs w-full" ref={companyDropdownRef}>
              <button
                onClick={handleCompanyDropdownClick}
                className="w-full bg-white text-gray-800 py-2 px-4 rounded border border-gray-300 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
              >
                <span>{selectedCompany}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCompanyDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded border border-gray-300 shadow-sm overflow-hidden">
                  {companiesBySector[selectedSector as Sector].map((company, index) => (
                    <div
                      key={index}
                      onClick={() => handleCompanySelect(company)}
                      className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorPredictions;
