//Card/ Stock News Tile Componenet
export default function NewsTile() {
  //instead of const, create an interface and define title and articlelink as strings
  const news_button_info = {
    title: "Title of Article",
    articlelink: "https://www.wsj.com/", // Placeholder link
  };

  function directClick() {
    window.open(news_button_info.articlelink, "_blank"); // use this instead to open in new tab (better UX)
  }

  return (
    //feel free to play around with the code in className, this is tailwindCSS and is used to design the button!
    <button onClick={directClick} className="flex items-center space-x-2 p-2 bg-white shadow-md rounded-lg hover:bg-gray-200 transition">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/029/128/849/small/square-shape-yellow-green-gradient-3d-rendering-png.png"
        alt="news button"
        width={20}
        height={20}
      />
      <span className="text-gray-900 font-medium">{news_button_info.title}</span>
    </button>
  );
}
  
  