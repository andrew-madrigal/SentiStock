import NewsTile from "../components/newstile";

export default function TrendingPage() {
  const newsArticles = [
    { title: "Stock Market Hits Record High", articleLink: "https://www.wsj.com/" },
    { title: "Tech Stocks Lead Market Rally", articleLink: "https://www.bloomberg.com/" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest Stock News</h1>
      <div className="space-y-4 w-full max-w-3xl">
        {/* {newsArticles.map((news, index) => (
          Please first fix your component before uncommenting the line below, you need to define the interface first before the
          following line works. If there's no error after uncommenting the line below and the map function, you're on the right track!
          //<NewsTile key={index} title={news.title} articleLink={news.articleLink} />
        ))} */}
      </div>
    </div>
  );
}
