# in website_backend/market.py
from .config import SECTOR_MAP

import pandas as pd
import numpy as np
import yfinance as yf
from fredapi import Fred
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import ta
import time

def get_market_data(
    sector: str = None,
    tickers: list[str] = None,
    lookback_years: int = 5,
    include_technical_indicators: bool = True
):
    """
    If `sector` is given, we pull SECTOR_MAP[sector].
    If `tickers` is also given, we filter the sector list to just those tickers.
    If neither is given, fall back to your old default list.
    """
    # Load API key and init Fred
    load_dotenv()
    fred_api_key = os.getenv("FRED_API_KEY")
    if not fred_api_key:
        raise ValueError("FRED API key not found in environment variables")
    fred = Fred(api_key=fred_api_key)
    
    # decide which tickers to fetch
    if sector:
        base = SECTOR_MAP.get(sector)
        if base is None:
            raise ValueError(f"Unknown sector '{sector}'")
        if tickers:
            # keep only picks that exist in the sector
            fetch_list = [t for t in base if t in tickers]
        else:
            fetch_list = base
    elif tickers:
        fetch_list = tickers
    else:
        # your old default
        fetch_list = [
            'PCG','AEP','AWK','XOM','CVX','SHW','VLO','DUK-PA',
            'HES','NISTF','ATO','STLD','APD','NEE-PR','NEM',
            'XEL','EIX','FE','NRG'
        ]
    
    # Date window
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=lookback_years*365)).strftime('%Y-%m-%d')
    
    # 1) Fetch stock data + technicals
    all_data = []
    for ticker in fetch_list:
        try:
            print(f"\n--- Fetching {ticker} ---")
            df = yf.Ticker(ticker).history(period=f"{lookback_years}y", interval="1d")
            time.sleep(1)
            if df.empty:
                print(f"No data for {ticker}, skipping.")
                continue
            
            df = df.reset_index()
            # Strip any timezone to match FRED later:
            df["Date"] = pd.to_datetime(df["Date"]).dt.tz_localize(None)
            df["Ticker"] = ticker
            
            # Base columns
            stock_data = df[["Date","Ticker","Open","High","Low","Close","Volume"]].copy()
            
            if include_technical_indicators:
                stock_data["Daily_Return"]    = stock_data["Close"].pct_change()
                stock_data["Typical_Price"]   = (stock_data[["High","Low","Close"]].sum(axis=1))/3
                stock_data["VWAP"] = (stock_data["Typical_Price"]*stock_data["Volume"]).cumsum() / stock_data["Volume"].cumsum()
                
                # TA indicators
                stock_data["SMA_20"]   = ta.trend.sma_indicator(stock_data["Close"], window=20)
                stock_data["EMA_20"]   = ta.trend.ema_indicator(stock_data["Close"], window=20)
                stock_data["RSI_14"]   = ta.momentum.RSIIndicator(stock_data["Close"], window=14).rsi()
                macd = ta.trend.MACD(stock_data["Close"])
                stock_data["MACD"]        = macd.macd()
                stock_data["MACD_Signal"] = macd.macd_signal()
                stock_data["MACD_Diff"]   = stock_data["MACD"] - stock_data["MACD_Signal"]
                
                bb = ta.volatility.BollingerBands(stock_data["Close"], window=20)
                stock_data["BB_Upper"] = bb.bollinger_hband()
                stock_data["BB_Lower"] = bb.bollinger_lband()
                
                stock_data["ATR"] = ta.volatility.AverageTrueRange(
                    high=stock_data["High"],
                    low=stock_data["Low"],
                    close=stock_data["Close"]
                ).average_true_range()
                
                stock_data["OBV"] = ta.volume.OnBalanceVolumeIndicator(
                    close=stock_data["Close"],
                    volume=stock_data["Volume"]
                ).on_balance_volume()
                
                stock_data["Rolling_Close_Mean_5"] = stock_data["Close"].rolling(5).mean()
                stock_data["Rolling_Return_3"]     = stock_data["Close"].pct_change().rolling(3).mean()
            
            all_data.append(stock_data)
            print(f"{ticker} 🎉 processed, {len(stock_data)} rows.")
            
        except Exception as e:
            print(f"Error with {ticker}: {e}")
    
    if not all_data:
        raise ValueError("No stock data retrieved.")
    
    stock_data = pd.concat(all_data, ignore_index=True)
    stock_data["Date"] = pd.to_datetime(stock_data["Date"])
    print(f"\nStock data combined: {stock_data.shape[0]} rows, {stock_data.shape[1]} cols")
    
    # Earliest/latest trading dates
    earliest = stock_data["Date"].min().date()
    latest   = stock_data["Date"].max().date()
    print(f"Date-range (stocks): {earliest} → {latest}")
    
    # Define monthly window for econ
    econ_start = earliest.replace(day=1).strftime("%Y-%m-%d")
    econ_end   = latest.strftime("%Y-%m-%d")
    print(f"→ Fetching economic series {econ_start} to {econ_end}")
    
    # 2) Fetch economic data
    econ = pd.DataFrame({
        "Unemployment":      fred.get_series("UNRATE", econ_start, econ_end),
        "Inflation_CPI":     fred.get_series("CPIAUCSL", econ_start, econ_end),
        "Fed_Funds_Rate":    fred.get_series("FEDFUNDS", econ_start, econ_end),
        "GDP":               fred.get_series("GDP", econ_start, econ_end),
        "10Y_Treasury":      fred.get_series("GS10", econ_start, econ_end),
        "Consumer_Sentiment":fred.get_series("UMCSENT", econ_start, econ_end),
        "Retail_Sales":      fred.get_series("RSAFS", econ_start, econ_end),
    })
    # Inspect raw econ pull
    print("\nRaw economic_data (monthly):")
    print(econ.head(), "\n...", econ.tail())
    econ = econ.reset_index().rename(columns={"index":"Date"})
    econ["Date"] = pd.to_datetime(econ["Date"])
    print("Range econ Date:", econ["Date"].min().date(), "→", econ["Date"].max().date())
    print("Any NaT in econ['Date']?", econ["Date"].isna().any())
    
    # 3) Forward-fill to daily
    full_idx = pd.date_range(start=earliest, end=latest, freq="D")
    econ_daily = econ.set_index("Date").reindex(full_idx).ffill()
    econ_daily.index.name = "Date"
    econ_daily = econ_daily.reset_index()
    print("\nEconomic data (daily) sample:")
    print(econ_daily.head(7))
    print("Index dtype:", econ_daily["Date"].dtype)
    
    # create additional features
    econ_daily["GDP_Growth"]      = econ_daily["GDP"].pct_change() * 100
    econ_daily["GDP_Growth_Lag1"] = econ_daily["GDP_Growth"].shift(1)
    econ_daily["Inflation_Lag1"]  = econ_daily["Inflation_CPI"].shift(1)
    econ_daily["Month"]           = econ_daily["Date"].dt.month
    econ_daily["Quarter"]         = econ_daily["Date"].dt.quarter
    econ_daily["Is_Earnings_Season"] = econ_daily["Month"].isin([1,4,7,10]).astype(int)
    
    # 4) Merge
    print("\nMerging stock_data with econ_daily on 'Date'…")
    merged = pd.merge(
        stock_data, econ_daily,
        on="Date", how="left", validate="many_to_one"
    )
    print(" After merge → sample:")
    print(merged[["Date","Ticker","Unemployment","Inflation_CPI"]].head(8))
    print(" Non-null macro rows:", merged["Unemployment"].notna().sum(),
          "/", merged.shape[0])
    
    # 5) Fill any straggler NaNs, create interactions
    macro_cols = ["Unemployment","Inflation_CPI","Fed_Funds_Rate","GDP",
                  "10Y_Treasury","Consumer_Sentiment","Retail_Sales",
                  "GDP_Growth","GDP_Growth_Lag1","Inflation_Lag1"]
    for col in macro_cols:
        if col in merged:
            merged[col] = merged[col].ffill().bfill()
    
    # interactions & time-based
    merged["MACD_x_Inflation"] = merged["MACD_Diff"] * merged["Inflation_CPI"]
    merged["Price_Range"]      = merged["High"] - merged["Low"]
    merged["Volatility_x_InterestRate"] = (
        merged["Price_Range"] * merged["Fed_Funds_Rate"]
    )
    merged["GDP_Previous"]       = merged.groupby("Ticker")["GDP"].shift(1)
    merged["Is_GDP_Report_Month"] = (
        (merged["GDP"] != merged["GDP_Previous"]) & (~merged["GDP"].isna())
    ).astype(int)
    mask = (~merged["GDP"].isna()) & (~merged["GDP_Previous"].isna())
    merged.loc[mask,"GDP_Direction"] = np.sign(
        merged.loc[mask,"GDP"] - merged.loc[mask,"GDP_Previous"]
    )
    merged["Month_In_Quarter"] = merged["Date"].dt.month % 3
    merged.loc[merged["Month_In_Quarter"]==0,"Month_In_Quarter"] = 3
    
    # Final stats
    print(f"\nFinal merged: {merged.shape[0]} rows, {merged.shape[1]} cols")
    print("Date range:", merged["Date"].min().date(), "→", merged["Date"].max().date())
    print("Tickers:", merged["Ticker"].nunique())
    
    return merged

if __name__ == "__main__":
    # Default tickers list is already built into the function
    market_data = get_market_data(lookback_years=5)
    
    # Save to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    market_data.to_csv(f'market_data_with_indicators_{timestamp}.csv', index=False)
    
    print(f"Data saved to market_data_with_indicators_{timestamp}.csv")
    
    # Preview the data
    print("\nData Preview:")
    print(market_data.head())
    
    # Check for any remaining NaN values
    nan_count = market_data.isna().sum().sum()
    print(f"Total NaN values in dataset: {nan_count}")