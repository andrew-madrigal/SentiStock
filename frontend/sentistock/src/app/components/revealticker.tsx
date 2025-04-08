'use client'

interface revealTickerProps {
    stock_ticker: string;
    stock_name: string;
    stock_sector: string;
    yfinance_link: string;
  }
  
  const RevealTicker: React.FC<revealTickerProps> = ({stock_ticker, stock_name, stock_sector, yfinance_link}) =>{
    return(
        <details className="mb-12">
        <summary className="cursor-pointer font-bold text-xl hover:text-[#adc178]">
          {stock_ticker}
        </summary>
        <ul className="text-xl mt-2 marker:text-[#adc178] list-disc pl-5">
          <li>Stock name: {stock_name}</li>
          <li>Sector: {stock_sector}</li>
          <li>Learn more: <a
              href={yfinance_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline">
              {yfinance_link}
            </a>
            </li>
        </ul>
      </details>
    );
  };
  export default RevealTicker;