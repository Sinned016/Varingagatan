export function sortDataDescending(data) {
  const sortedData = data.sort(
    (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
  );

  return sortedData;
}
