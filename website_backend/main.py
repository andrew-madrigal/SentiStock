from fastapi import FastAPI, HTTPException
from .config import SECTOR_MAP
from .market import get_market_data

app = FastAPI()

@app.get("/api/market-data/")
async def market_data_for_sector(sector: str):
    tickers = SECTOR_MAP.get(sector.lower())
    if not tickers:
        raise HTTPException(404, f"Unknown sector '{sector}'")
    df = get_market_data(tickers=tickers)
    return df.to_dict(orient="records")
