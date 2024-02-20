export function filterBooksForNewest(books) {
    const newestBooks = books.filter((book) => book.secondTitle.includes("Väringasagan"));
    newestBooks.sort((a, b) => {
      // Extract the numbers from the secondTitle strings
      const numberA = parseInt(a.secondTitle.match(/\d+/)[0]);
      const numberB = parseInt(b.secondTitle.match(/\d+/)[0]);
      // Compare the numbers
      return numberA - numberB;
    });

    console.log(newestBooks);
    return newestBooks;
}