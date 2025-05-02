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
    Fetches stock and macroeconomic data, computes technical indicators, and returns a merged DataFrame.

    - sector: if provided, selects tickers from SECTOR_MAP[sector]
    - tickers: overrides sector if provided
    - lookback_years: number of years of history to fetch
    - include_technical_indicators: whether to compute TA indicators
    """
    # -- Initialize FRED API --
    load_dotenv()
    fred_api_key = os.getenv("FRED_API_KEY")
    if not fred_api_key:
        raise ValueError("FRED API key not found in environment variables")
    fred = Fred(api_key=fred_api_key)

    # -- Determine tickers to fetch --
    if sector:
        base = SECTOR_MAP.get(sector)
        if base is None:
            raise ValueError(f"Unknown sector '{sector}'")
        fetch_list = [t for t in base if (not tickers) or (t in tickers)]
    elif tickers:
        fetch_list = tickers
    else:
        # default tickers
        fetch_list = [
            'PCG','AEP','AWK','XOM','CVX','SHW','VLO','DUK-PA',
            'HES','NISTF','ATO','STLD','APD','NEE-PR','NEM',
            'XEL','EIX','FE','NRG'
        ]

    # -- Date window --
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = (datetime.now() - timedelta(days=lookback_years*365)).strftime('%Y-%m-%d')

    all_data = []

    # -- 1) Batch fetch via yfinance --
    try:
        print(f"\n--- Batch fetching {len(fetch_list)} tickers ---")
        raw = yf.download(
            tickers=fetch_list,
            period=f"{lookback_years}y",
            interval="1d",
            auto_adjust=False,
            group_by='ticker',
            threads=False
        )
        time.sleep(1)

        for ticker in fetch_list:
            if ticker not in raw.columns.levels[0]:
                print(f"No data for {ticker} in batch, skipping.")
                continue

            df = raw[ticker].dropna().reset_index()
            df["Date"] = pd.to_datetime(df["Date"]).dt.tz_localize(None)
            df["Ticker"] = ticker

            stock_data = df[["Date","Ticker","Open","High","Low","Close","Volume"]].copy()
            if include_technical_indicators:
                stock_data["Daily_Return"] = stock_data["Close"].pct_change()
                stock_data["Typical_Price"] = stock_data[["High","Low","Close"]].sum(axis=1) / 3
                stock_data["VWAP"] = (stock_data["Typical_Price"] * stock_data["Volume"]).cumsum() / stock_data["Volume"].cumsum()
                stock_data["SMA_20"] = ta.trend.sma_indicator(stock_data["Close"], window=20)
                stock_data["EMA_20"] = ta.trend.ema_indicator(stock_data["Close"], window=20)
                stock_data["RSI_14"] = ta.momentum.RSIIndicator(stock_data["Close"], window=14).rsi()
                macd = ta.trend.MACD(stock_data["Close"])
                stock_data["MACD"] = macd.macd()
                stock_data["MACD_Signal"] = macd.macd_signal()
                stock_data["MACD_Diff"] = stock_data["MACD"] - stock_data["MACD_Signal"]
                bb = ta.volatility.BollingerBands(stock_data["Close"], window=20)
                stock_data["BB_Upper"] = bb.bollinger_hband()
                stock_data["BB_Lower"] = bb.bollinger_lband()
                stock_data["ATR"] = ta.volatility.AverageTrueRange(
                    high=stock_data["High"], low=stock_data["Low"], close=stock_data["Close"]
                ).average_true_range()
                stock_data["OBV"] = ta.volume.OnBalanceVolumeIndicator(
                    close=stock_data["Close"], volume=stock_data["Volume"]
                ).on_balance_volume()
                stock_data["Rolling_Close_Mean_5"] = stock_data["Close"].rolling(5).mean()
                stock_data["Rolling_Return_3"] = stock_data["Close"].pct_change().rolling(3).mean()

            all_data.append(stock_data)
        print("Batch fetch succeeded 🎉")

    except Exception as e:
        print(f"Batch fetch failed ({e}), falling back to individual fetch with backoff")
        # -- Fallback: per-ticker with exponential backoff --
        for ticker in fetch_list:
            for attempt in range(5):
                try:
                    print(f"Fetching {ticker}, attempt {attempt+1}")
                    df = yf.Ticker(ticker).history(
                        period=f"{lookback_years}y", interval="1d"
                    ).reset_index()
                    time.sleep(1 + attempt * 0.5)
                    if df.empty:
                        raise ValueError("empty data")
                    df["Date"] = pd.to_datetime(df["Date"]).dt.tz_localize(None)
                    df["Ticker"] = ticker

                    stock_data = df[["Date","Ticker","Open","High","Low","Close","Volume"]].copy()
                    if include_technical_indicators:
                        stock_data["Daily_Return"] = stock_data["Close"].pct_change()
                        stock_data["Typical_Price"] = stock_data[["High","Low","Close"]].sum(axis=1) / 3
                        stock_data["VWAP"] = (stock_data["Typical_Price"] * stock_data["Volume"]).cumsum() / stock_data["Volume"].cumsum()
                        stock_data["SMA_20"] = ta.trend.sma_indicator(stock_data["Close"], window=20)
                        stock_data["EMA_20"] = ta.trend.ema_indicator(stock_data["Close"], window=20)
                        stock_data["RSI_14"] = ta.momentum.RSIIndicator(stock_data["Close"], window=14).rsi()
                        macd = ta.trend.MACD(stock_data["Close"])
                        stock_data["MACD"] = macd.macd()
                        stock_data["MACD_Signal"] = macd.macd_signal()
                        stock_data["MACD_Diff"] = stock_data["MACD"] - stock_data["MACD_Signal"]
                        bb = ta.volatility.BollingerBands(stock_data["Close"], window=20)
                        stock_data["BB_Upper"] = bb.bollinger_hband()
                        stock_data["BB_Lower"] = bb.bollinger_lband()
                        stock_data["ATR"] = ta.volatility.AverageTrueRange(
                            high=stock_data["High"], low=stock_data["Low"], close=stock_data["Close"]
                        ).average_true_range()
                        stock_data["OBV"] = ta.volume.OnBalanceVolumeIndicator(
                            close=stock_data["Close"], volume=stock_data["Volume"]
                        ).on_balance_volume()
                        stock_data["Rolling_Close_Mean_5"] = stock_data["Close"].rolling(5).mean()
                        stock_data["Rolling_Return_3"] = stock_data["Close"].pct_change().rolling(3).mean()

                    all_data.append(stock_data)
                    break
                except Exception as ee:
                    wait = (2 ** attempt) + np.random.rand()
                    print(f"  → rate‑limited or error ({ee}), retrying in {wait:.1f}s")
                    time.sleep(wait)
            else:
                print(f"Failed to fetch {ticker} after retries, skipping.")

    if not all_data:
        raise ValueError("No stock data retrieved.")

    # -- Combine all stock data --
    stock_data = pd.concat(all_data, ignore_index=True)
    stock_data["Date"] = pd.to_datetime(stock_data["Date"])
    print(f"\nStock data combined: {stock_data.shape[0]} rows, {stock_data.shape[1]} cols")

    earliest = stock_data["Date"].min().date()
    latest   = stock_data["Date"].max().date()
    print(f"Date-range (stocks): {earliest} → {latest}")

    # -- Economic data window --
    econ_start = earliest.replace(day=1).strftime("%Y-%m-%d")
    econ_end   = latest.strftime("%Y-%m-%d")
    print(f"→ Fetching economic series {econ_start} to {econ_end}")

    # -- 2) Fetch macro series --
    econ = pd.DataFrame({
        "Unemployment":      fred.get_series("UNRATE", econ_start, econ_end),
        "Inflation_CPI":     fred.get_series("CPIAUCSL", econ_start, econ_end),
        "Fed_Funds_Rate":    fred.get_series("FEDFUNDS", econ_start, econ_end),
        "GDP":               fred.get_series("GDP", econ_start, econ_end),
        "10Y_Treasury":      fred.get_series("GS10", econ_start, econ_end),
        "Consumer_Sentiment":fred.get_series("UMCSENT", econ_start, econ_end),
        "Retail_Sales":      fred.get_series("RSAFS", econ_start, econ_end),
    })
    econ = econ.reset_index().rename(columns={"index":"Date"})
    econ["Date"] = pd.to_datetime(econ["Date"])

    # -- 3) Forward-fill to daily frequency --
    full_idx = pd.date_range(start=earliest, end=latest, freq="D")
    econ_daily = econ.set_index("Date").reindex(full_idx).ffill()
    econ_daily.index.name = "Date"
    econ_daily = econ_daily.reset_index()

    # -- Macro features --
    econ_daily["GDP_Growth"]      = econ_daily["GDP"].pct_change() * 100
    econ_daily["GDP_Growth_Lag1"] = econ_daily["GDP_Growth"].shift(1)
    econ_daily["Inflation_Lag1"]  = econ_daily["Inflation_CPI"].shift(1)
    econ_daily["Month"]           = econ_daily["Date"].dt.month
    econ_daily["Quarter"]         = econ_daily["Date"].dt.quarter
    econ_daily["Is_Earnings_Season"] = econ_daily["Month"].isin([1,4,7,10]).astype(int)

    # -- 4) Merge stock and macro data --
    merged = pd.merge(
        stock_data, econ_daily,
        on="Date", how="left", validate="many_to_one"
    )

    # -- 5) Final fixes: fill NaNs and create interactions --
    macro_cols = [
        "Unemployment","Inflation_CPI","Fed_Funds_Rate","GDP",
        "10Y_Treasury","Consumer_Sentiment","Retail_Sales",
        "GDP_Growth","GDP_Growth_Lag1","Inflation_Lag1"
    ]
    for col in macro_cols:
        if col in merged:
            merged[col] = merged[col].ffill().bfill()

    merged["MACD_x_Inflation"]         = merged["MACD_Diff"] * merged["Inflation_CPI"]
    merged["Price_Range"]              = merged["High"] - merged["Low"]
    merged["Volatility_x_InterestRate"] = merged["Price_Range"] * merged["Fed_Funds_Rate"]
    merged["GDP_Previous"]             = merged.groupby("Ticker")["GDP"].shift(1)
    merged["Is_GDP_Report_Month"]      = ((merged["GDP"] != merged["GDP_Previous"]) & (~merged["GDP"].isna())).astype(int)
    mask = (~merged["GDP"].isna()) & (~merged["GDP_Previous"].isna())
    merged.loc[mask, "GDP_Direction"]  = np.sign(merged.loc[mask, "GDP"] - merged.loc[mask, "GDP_Previous"])
    merged["Month_In_Quarter"]         = merged["Date"].dt.month % 3
    merged.loc[merged["Month_In_Quarter"] == 0, "Month_In_Quarter"] = 3

    print(f"\nFinal merged: {merged.shape[0]} rows, {merged.shape[1]} cols")