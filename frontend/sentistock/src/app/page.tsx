export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 text-center">
      <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white">
        SentiStock
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
      Leverages social media sentiment analysis and historical stock price data to predict future stock movements.
      </p>
    </div>
  );
}
