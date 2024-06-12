import { useState } from "react";
import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes

export default function StarRating({ reviewRating, setReviewRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input type="radio" name="rating" value={ratingValue} onClick={() => setReviewRating(ratingValue)} />
            <FaStar
              className="star"
              color={ratingValue <= (hover || reviewRating) ? "#ffc107" : "#e4e5e9"}
              size={30}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  reviewRating: PropTypes.number.isRequired,
  setReviewRating: PropTypes.func.isRequired,
};
