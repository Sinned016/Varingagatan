
export function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return null;

  const totalRating = reviews.reduce((sum, review) => sum + review.reviewRating, 0);
  const averageRating = totalRating / reviews.length;
  const roundedAverageRating = Math.round(averageRating)

  return roundedAverageRating;
}