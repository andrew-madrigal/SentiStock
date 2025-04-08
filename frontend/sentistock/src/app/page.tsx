"use client";
import { useState, useEffect, useRef } from "react";

type Sector = "Energy" | "Technology" | "Finance" | "Healthcare" | "Consumer" | "Real Estate";

export default function Home() {
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isTimeframeDropdownOpen, setIsTimeframeDropdownOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<Sector | "Select an industry sector">("Select an industry sector");
  const [selectedCompany, setSelectedCompany] = useState("Select a company");
  const [selectedTimeframe, setSelectedTimeframe] = useState<number | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  
  const sectorDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const timeframeDropdownRef = useRef<HTMLDivElement>(null);

  const sectorOptions: Sector[] = [
    "Energy",
    "Technology",
    "Finance",
    "Healthcare",
    "Consumer",
    "Real Estate"
  ];

  // Sample companies for each sector
  const companiesBySector: Record<Sector, string[]> = {
    "Energy": ["Exxon Mobil", "Chevron", "BP", "Shell", "ConocoPhillips"],
    "Technology": ["Apple", "Microsoft", "Google", "Amazon", "Meta"],
    "Finance": ["JPMorgan Chase", "Bank of America", "Goldman Sachs", "Morgan Stanley", "Wells Fargo"],
    "Healthcare": ["Johnson & Johnson", "Pfizer", "Merck", "UnitedHealth Group", "Abbott Laboratories"],
    "Consumer": ["Procter & Gamble", "Coca-Cola", "PepsiCo", "McDonald's", "Nike"],
    "Real Estate": ["Simon Property Group", "AvalonBay Communities", "Equity Residential", "Public Storage", "Welltower"]
  };

  // Sample current prices for companies (in a real app, this would come from an API)
  const currentPrices: Record<string, number> = {
    "Exxon Mobil": 105.42,
    "Chevron": 152.78,
    "BP": 38.65,
    "Shell": 58.92,
    "ConocoPhillips": 118.34,
    "Apple": 178.99,
    "Microsoft": 378.85,
    "Google": 142.65,
    "Amazon": 178.75,
    "Meta": 474.99,
    "JPMorgan Chase": 182.63,
    "Bank of America": 35.87,
    "Goldman Sachs": 389.49,
    "Morgan Stanley": 93.42,
    "Wells Fargo": 57.83,
    "Johnson & Johnson": 152.34,
    "Pfizer": 28.76,
    "Merck": 125.43,
    "UnitedHealth Group": 518.91,
    "Abbott Laboratories": 105.67,
    "Procter & Gamble": 156.78,
    "Coca-Cola": 59.34,
    "PepsiCo": 168.92,
    "McDonald's": 293.41,
    "Nike": 98.76,
    "Simon Property Group": 142.34,
    "AvalonBay Communities": 178.92,
    "Equity Residential": 65.43,
    "Public Storage": 285.67,
    "Welltower": 92.45
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectorDropdownRef.current && !sectorDropdownRef.current.contains(event.target as Node)) {
        setIsSectorDropdownOpen(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
      if (timeframeDropdownRef.current && !timeframeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeframeDropdownOpen(false);
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
    setIsTimeframeDropdownOpen(false);
  };

  const handleCompanyDropdownClick = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
    setIsSectorDropdownOpen(false);
    setIsTimeframeDropdownOpen(false);
  };

  const handleTimeframeDropdownClick = () => {
    setIsTimeframeDropdownOpen(!isTimeframeDropdownOpen);
    setIsSectorDropdownOpen(false);
    setIsCompanyDropdownOpen(false);
  };

  const handleSectorSelect = (sector: Sector) => {
    setSelectedSector(sector);
    setIsSectorDropdownOpen(false);
    setSelectedCompany("Select a company");
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setIsCompanyDropdownOpen(false);
  };

  const handleTimeframeSelect = (days: number) => {
    setSelectedTimeframe(days);
    setIsTimeframeDropdownOpen(false);
    
    // Generate random prediction for demonstration
    // In a real app, this would come from your sentiment analysis algorithm
    if (selectedCompany !== "Select a company" && currentPrices[selectedCompany]) {
      const currentPrice = currentPrices[selectedCompany];
      // Random percentage change between -5% and +5%
      const randomChange = (Math.random() * 10 - 5) / 100;
      const newPrice = currentPrice * (1 + randomChange);
      setPredictedPrice(Number(newPrice.toFixed(2)));
      setPercentageChange(Number((randomChange * 100).toFixed(2)));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#F0EAD2]">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white">
        SentiStock
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
        Leverages social media sentiment analysis and historical stock price data to predict future stock movements.
      </p>
      
      <div className="mt-12 w-full bg-[#ADC178] py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Industry Sector Analysis
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
            Analyze market trends, sentiment, and investment opportunities across different economic sectors.
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Sector Dropdown */}
            <div className="relative max-w-xs w-full" ref={sectorDropdownRef}>
              <button
                onClick={handleSectorDropdownClick}
                className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded border border-gray-300 dark:border-gray-600 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <span>{selectedSector}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isSectorDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSectorDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
                  {sectorOptions.map((sector, index) => (
                    <div
                      key={index}
                      onClick={() => handleSectorSelect(sector)}
                      className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white text-sm"
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
                  className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded border border-gray-300 dark:border-gray-600 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <span>{selectedCompany}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCompanyDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
                    {companiesBySector[selectedSector as Sector].map((company, index) => (
                      <div
                        key={index}
                        onClick={() => handleCompanySelect(company)}
                        className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white text-sm"
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
      
      {/* Stock Graph Section - Outside the green rectangle */}
      {selectedCompany !== "Select a company" && (
        <div className="mt-8 w-full">
          {/* Graph Section with F0EAD2 background */}
          <div className="bg-[#F0EAD2] dark:bg-gray-800 shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {selectedCompany}'s Projected Stock Movement
                {selectedTimeframe !== null && `, Next ${selectedTimeframe} ${selectedTimeframe === 1 ? 'day' : 'days'}`}
              </h3>
              <div className="relative w-full h-64 bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                {/* Placeholder for the graph - replace with actual graph component later */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                    {/* Sample line graph path */}
                    <path
                      d="M0,200 C100,150 200,250 300,200 C400,150 500,250 600,200 C700,150 800,250 800,200"
                      fill="none"
                      stroke="#4CAF50"
                      strokeWidth="3"
                    />
                    {/* X-axis */}
                    <line x1="0" y1="350" x2="800" y2="350" stroke="#666" strokeWidth="2" />
                    {/* Y-axis */}
                    <line x1="50" y1="50" x2="50" y2="350" stroke="#666" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                This graph shows the projected stock price movement for {selectedCompany} based on our sentiment analysis algorithm.
              </p>
            </div>
          </div>
          
          {/* Prediction Information and Timeframe Dropdown with green background */}
          <div className="bg-[#ADC178] dark:bg-gray-800 shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
              {/* Prediction Information */}
              {predictedPrice !== null && percentageChange !== null && selectedTimeframe !== null && (
                <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Predicted price in {selectedTimeframe} {selectedTimeframe === 1 ? 'day' : 'days'}: <span className="font-bold">${predictedPrice}</span>
                  </p>
                  <p className={`text-lg font-medium ${percentageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    Predicted change: {percentageChange >= 0 ? '+' : ''}{percentageChange}%
                  </p>
                </div>
              )}
              
              {/* Timeframe Dropdown */}
              <div className="flex justify-center">
                <div className="relative max-w-xs w-full" ref={timeframeDropdownRef}>
                  <button
                    onClick={handleTimeframeDropdownClick}
                    className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded border border-gray-300 dark:border-gray-600 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span>
                      {selectedTimeframe === null 
                        ? "How far out do you want to predict?" 
                        : `Analyze ${selectedTimeframe} ${selectedTimeframe === 1 ? 'day' : 'days'} in advance`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isTimeframeDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isTimeframeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
                      {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <div
                          key={days}
                          onClick={() => handleTimeframeSelect(days)}
                          className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white text-sm"
                        >
                          {days} {days === 1 ? 'day' : 'days'} in advance
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
