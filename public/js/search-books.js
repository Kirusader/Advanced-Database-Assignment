/** @format */

const handleSave = async (id) => {
  await fetch("/api/saved-books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });
};

const bookView = (book) => `

<div class="col-12">
<div class="card">
<h5 class="card-header"> ${book.title} <strong>(search match: ${book.score})</strong></h5>
<div class="card-body">
 <h6 class="card-text"><b>Author</b>: ${book.authors}</h6>
  <ul class="list-group">
       <li class="list-group-item">Book Rating: ${book.average_rating}</li>
        <li class="list-group-item">Book ISBN: ${book.isbn}</li>
        <li class="list-group-item">Publication Date: ${book.publication_date}</li>
        <li class="list-group-item">Publisher: ${book.publisher}</li>
        
  </ul>
</div>
<a href="#" class="btn btn-primary" onclick="handleSave('${book._id}')">Save</a>
</div>
</div>
`;

const handleSubmit = async () => {
  const searchVal = document.querySelector("#searchInput").value;
  try {
    const bookDomRef = document.querySelector("#bookItems");
    const ref = await fetch(`/api/search-books/?search=${searchVal}`);
    const searchResults = await ref.json();
    let bookHtml = [];
    searchResults.forEach((book) => {
      bookHtml.push(bookView(book));
    });
    bookDomRef.innerHTML = bookHtml.join("");
  } catch (e) {
    console.log(e);
    console.log("could not search api");
  }
};
