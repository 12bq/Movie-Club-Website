import { useState } from "react";
import "../css/ReviewForm.css";

function ReviewForm({ movieId, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    const review = {
      id: Date.now(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    onReviewSubmit(review);
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setError("");
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      
      <div className="star-rating">
        <label>Rating:</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= (hoveredRating || rating) ? "filled" : ""}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="comment-section">
        <label htmlFor="comment">Your Review:</label>
        <textarea
          id="comment"
          className="comment-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this movie..."
          rows="5"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-review-btn">
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
