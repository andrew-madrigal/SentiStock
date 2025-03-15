"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-inconsolata text-xl font-bold hover:text-green-300">
          SentiStock
        </Link>

        <div className="font-inconsolata flex space-x-6">
          <Link href="/aboutus" className="hover:text-green-300">About Us</Link>
          <Link href="/stockanalysis" className="hover:text-green-300">Stock Analysis</Link>
          <Link href="/trendingstocks" className="hover:text-green-300">Trending Stocks</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
