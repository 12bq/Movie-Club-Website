import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details...");
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    const storedReviews = localStorage.getItem(`reviews_${id}`);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  };

  const handleReviewSubmit = (review) => {
    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
  };

  if (loading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <div className="error-message">{error || "Movie not found"}</div>
        <button onClick={() => navigate("/")} className="back-button">
          Go Back Home
        </button>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="movie-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="movie-detail-header">
        <div className="movie-poster-large">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="release-date">
              {movie.release_date?.split("-")[0]}
            </span>
            {movie.runtime && (
              <span className="runtime">{movie.runtime} min</span>
            )}
            {averageRating && (
              <span className="average-rating">
                ⭐ {averageRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
          {movie.genres && movie.genres.length > 0 && (
            <div className="genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          {movie.vote_average && (
            <div className="tmdb-rating">
              TMDB Rating: {movie.vote_average.toFixed(1)}/10
            </div>
          )}
        </div>
      </div>

      {movie.overview && (
        <div className="movie-description">
          <h2>Overview</h2>
          <p>{movie.overview}</p>
        </div>
      )}

      <div className="reviews-section">
        <ReviewForm movieId={id} onReviewSubmit={handleReviewSubmit} />

        {reviews.length > 0 && (
          <div className="reviews-list">
            <h2>Reviews ({reviews.length})</h2>
            {reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < review.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
