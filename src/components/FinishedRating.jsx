import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types"; // Import PropTypes

export default function FinishedRating({ score }) {
  return (
    <div>
      {[...Array(score)].map((star, index) => (
        <span key={index}>
          <FaStar className="star" color="#ffc107" size={30} />
        </span>
      ))}
    </div>
  );
}

FinishedRating.propTypes = {
  score: PropTypes.number.isRequired,
};
