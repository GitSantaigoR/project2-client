import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../services/API_URL";


const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [books, setBooks] = useState([])
  const [favorites, setFavorites] = useState([]);
  const [ favoriteRecords, setFavoriteRecords ] = useState([])

  const getBooks = () => {
    axios.get(API_URL + '/books')
      .then((response) => {
        console.log("Books ===>", response.data)
        setBooks(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getFavorites = () => {

    axios.get(API_URL + '/favorites')
      .then((response) => {
        console.log("Favorites ===>", response.data)
        let theseIds = response.data.map((element) => element.bookId)
        if (books.length) {
          let theseFavorites = books.filter((book) => theseIds.includes(book.id))
          setFavoriteRecords(response.data)
          setFavorites(theseFavorites)
        } else {
          getBooks()
        }
      })
      .catch((err) => {
        console.log(err)
      })

  }

  const addToFavorites = (id) => {

    axios.post(API_URL + '/favorites', {bookId: id})
      .then((response) => {
        console.log("Favorited ===>", response.data)
        getFavorites()
      })
      .catch((err) => {
        console.log(err)
      })

    // const oldFavorites = [...favorites];

    // const newFavorites = oldFavorites.concat(book.id !== id);

    // setFavorites(newFavorites);
  };

  const removeFromFavorites = (id) => {

    let favoriteId = favoriteRecords.find((favorite) => favorite.bookId == id).id

    axios.delete(API_URL + `/favorites/${favoriteId}`)
      .then((response) => {
        console.log("Deleted favorite")
        getFavorites()
      })
      .catch((err) => {
        console.log(err)
      })

  };


  useEffect(() => {
    getBooks()
    // getFavorites()
  }, [])

  useEffect(() => {
    if (books.length) {
      getFavorites()
    } else {
      getBooks()
    }
  }, [books])

  return (
    <AppContext.Provider value={{ books, getBooks, favorites, addToFavorites, removeFromFavorites }} >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
