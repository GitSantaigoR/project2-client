import { useContext } from "react";
import { AppContext } from "../context/appContext";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites, addToFavorites, removeFromFavorites } =
    useContext(AppContext);

  console.log("favorites are", favorites);

  const favoritesChecker = (id) => {
    const boolean = favorites.some((book) => book.id === id);
    return boolean;
  };

  return (
    <div className="favorites">
      {favorites.map((book) => (
        <div key={book.id} className="book">
          <div>
            <h4>{book.title}</h4>
          </div>
          <div>
            <Link to={`/book/${book.id}`}>
              <img src={book.image_url} alt="#" />
            </Link>
          </div>
          <div>
            {favoritesChecker(book.id) ? (
              <button onClick={() => removeFromFavorites(book.id)}>
                Remove from Favorites
              </button>
            ) : (
              <button onClick={() => addToFavorites(book.id)}>
                Add to Favorites
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
