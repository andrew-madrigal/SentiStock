"use client";
import { useState, useEffect, useRef } from "react";
import HomeBackgroundWrapper from "./components/homebackgroundwrapper";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-[#F0EAD2]">
      <HomeBackgroundWrapper>
        <div className="flex flex-col items-center justify-center text-center text-[#3d2e16] px-4">
          <h1 className="text-4xl sm:text-6xl font-bold">SentiStock</h1>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl">
            Leverages social media sentiment analysis and historical stock price data to predict future stock movements.
          </p>

          <Link href="/stockanalysis" passHref>
            <button className="mt-8 inline-flex items-center bg-[#adc178] hover:bg-[#a2b76e] text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300">
              Try our Stock Analysis Tool
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </HomeBackgroundWrapper>
    </div>
  );
}