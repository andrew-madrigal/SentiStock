export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-6 py-12 bg-[#F0EAD2] text-[#3d2e16]">
      <div className="max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          SentiStock: AI-Powered Sentiment & Stock Prediction
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          SentiStock leverages AI-driven sentiment analysis and time series forecasting 
          to analyze market sentiment and predict stock price movements for six major 
          stock market sectors.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Data Collection",
                description: "Aggregates sentiment data from Reddit and financial news."
              },
              {
                title: "Sentiment Analysis",
                description: "Uses NLP models to classify discussions as positive, neutral, or negative."
              },
              {
                title: "Stock Forecasting",
                description: "Implements LSTMs and transformers to predict trends up to one month."
              },
              {
                title: "Interactive Web Interface",
                description: "Users can explore predictions and visual trends seamlessly."
              }
            ].map((step, index) => (
              <div key={index} className="bg-[#ADC178] shadow-md rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-700 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">Why SentiStock?</h2>
          <ul className="list-disc list-inside text-gray-700 mt-3 space-y-2">
            <li><strong>Data-Driven Insights:</strong> Combines social sentiment with stock forecasting.</li>
            <li><strong>Sector-Specific Analysis:</strong> Focuses on key large-cap stocks for accuracy.</li>
            <li><strong>AI-Powered Predictions:</strong> Uses deep learning for enhanced market analysis.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
