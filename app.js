let booksGrid = document.getElementById("books-grid")
let formBtn = document.getElementById("form-btn")
let form = document.getElementById("form")
let formCloseBtn = document.getElementById("form-close-btn")
let loaderScreen = document.getElementById("loader-screen")
let filterSelect = document.getElementById('filterSelect')
let allBooks = []
async function getData() {
    try {
        const { data, error } = await supabase
            .from('Books')
            .select()
        loaderScreen.classList.add("show")
        if (error) throw error
        if (data) {
            allBooks = data;
            displayBooks(allBooks);
            loaderScreen.classList.remove("hide")

                ;
        }
    } catch (error) {
        console.log(error);

    }
}
function displayBooks(books) {
    console.log(books);
    booksGrid.innerHTML = books.map((book) => {
        return `  <div class="col"><div class="row align-items-center  shadow bg-body-tertiary border rounded-4"><div class="col-6"><img class="w-100" src="${book.image_url}" alt="${book.title}"></div>
        <div class="col-6 text-start"><h5 class="">${book.title}</h5><h6 class="">Author:${book.author}</h6><p class=""><b> Description </b><br> ${book.description}</p><div class="d-flex justify-content-between align-items-center my-2"> <span>Rs ${book.price}</span> <button class="btn btn-dark">Buy Now</button></div></div>
        <div></div></div></div>`
    }).join('')
}
filterSelect.addEventListener('change', function () {
    let selectedValue = filterSelect.value;
    let filteredBooks = [];

    if (selectedValue === "all") {
        filteredBooks = allBooks;
    } else if (selectedValue === "0-500") {
        filteredBooks = allBooks.filter(book => book.price >= 0 && book.price <= 500);
    } else if (selectedValue === "501-1000") {
        filteredBooks = allBooks.filter(book => book.price >= 501 && book.price <= 1000);
    } else if (selectedValue === "1001-2000") {
        filteredBooks = allBooks.filter(book => book.price >= 1001 && book.price <= 2000);
    } else if (selectedValue === "2001-5000") {
        filteredBooks = allBooks.filter(book => book.price >= 2001 && book.price <= 5000);
    }

    displayBooks(filteredBooks);
});
if (formBtn) {
    formBtn.addEventListener('click', show)
}
function show() {
    form.classList.remove("show")
    form.classList.add("hide")
}
if (formCloseBtn) {
    formCloseBtn.addEventListener('click', close)
}
function close() {
    form.classList.add("show")
    form.classList.remove("hide")
}
window.onload = getData(), close()