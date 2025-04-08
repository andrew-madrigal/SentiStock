'use client';

import dynamic from 'next/dynamic';

const TrendingSelect = dynamic(() => import('../components/trendingselect'), {
  ssr: false
});

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <TrendingSelect />
    </div>
  );
}
