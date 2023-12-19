import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/appContext";
import axios from "axios";
import { API_URL } from "../services/API_URL";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [newReview, setNewReview] = useState({
    bookId: Number(id),
    review: "",
    date: new Date(Date.now()).toLocaleString(),
    isEditing: false
  });

  const [reviewToUpdate, setReviewToUpdate] = useState({
    bookId: Number(id),
    review: "",
    date: new Date(Date.now()).toLocaleString(),
    isEditing: true
  })


  const getBook = () => {
    axios
      .get(API_URL + `/books/${id}?_embed=reviews`)
      .then((response) => {
        console.log("Found book ===>", response.data);
        setBook(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setNewReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleReviewChange = (e) => {
    setReviewToUpdate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(API_URL + "/reviews", newReview)
      .then((response) => {
        console.log("New review ===>", response.data);
        setNewReview({
          bookId: Number(id),
          review: "",
          date: new Date(Date.now()).toLocaleString(),
        });
        getBook();
      })
      .catch((err) => {
        console.log("Review error");
        console.log("This is the error", err);
      });
  };

  const deleteReview = (id) => {

    axios.delete(API_URL + `/reviews/${id}`)
        .then((response) => {
            console.log("Deleted review ===>", response.data)
            getBook()
        })
        .catch((err) => {
            console.log(err)
        })
  }

  const setIsEditing = (id) => {
    let theseReviews = [...book.reviews]
    let thisIndex
    let thisReview = theseReviews.find((review, index) => {
        thisIndex = index
        return review.id == id
    })
    thisReview = {...thisReview, isEditing: true}
    theseReviews[thisIndex] = thisReview
    setReviewToUpdate(thisReview)
    setBook((prev) => ({...prev, ["reviews"]: theseReviews}))
  }

  const handleReviewUpdate = (e, i) => {
    e.preventDefault()
    console.log("Updating Review")
    axios.put(API_URL + `/reviews/${i}`, {...reviewToUpdate, ['isEditing']: false})
    .then((response) => {
        console.log("Updated review ===>", response.data);
        setReviewToUpdate({
            bookId: Number(id),
            review: "",
            date: new Date(Date.now()).toLocaleString(),
            isEditing: true
          });
        getBook();
      })
      .catch((err) => {
        console.log("Review update error");
        console.log("This is the error", err);
      });
  }

  useEffect(() => {
    getBook();
  }, [id]);

  return (
    <div className="book-details">
      {book && (
        <>
          <h2>{book.title}</h2>
          <img src={book.image_url} alt="#" />
          <h2>Description</h2>
          <p>{book.description}</p>
          <h2>Authors</h2>
          <p>{book.authors}</p>
          <h2>Genres</h2>
          <p>{book.genres}</p>
        </>
      )}

      {/* <img src={book.image_url} alt="#"/> */}

      <hr />

      <div>
        <h3>Reviews</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Add Review
            <input
              name="review"
              onChange={handleChange}
              value={newReview.review}
              type="text"
              style={{ width: "20vw" }}
            />
          </label>
          <button className="review-button">Submit</button>
        </form>

        {book && book.reviews.length > 0 && (
          <>
            {book.reviews.map((review) => {
              return (
                <div>
                  <p>{review.review}</p>
                  <p>- {review.date} <span><CiEdit onClick={() => setIsEditing(review.id)}  /></span> <span><MdDeleteForever onClick={() => deleteReview(review.id)}/></span></p>
                  {review.isEditing && 
                            <form onSubmit={(e)=>handleReviewUpdate(e, review.id)}>
                            <label>
                              Edit Review
                              <input
                                name="review"
                                onChange={handleReviewChange}
                                value={reviewToUpdate.review}
                                type="text"
                                style={{ width: "20vw" }}
                              />
                            </label>
                            <button className="review-button">Submit</button>
                          </form>
                  }
                  <br />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
