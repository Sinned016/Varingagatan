import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes

export default function FinishedRating({ score, size }) {
  console.log(score);
  return (
    <div className="finished-rating">
      {score ? (
        [...Array(score)].map((star, index) => (
          <span key={index}>
            <FaStar className="star" color="#ffc107" size={size ? size : 30} />
          </span>
        ))
      ) : (
        <p className="no-rating">No rating</p>
      )}
    </div>
  );
}

FinishedRating.propTypes = {
  score: PropTypes.number.isRequired,
};
