let booksGrid = document.getElementById("books-grid");
let formBtn = document.getElementById("form-btn");
let form = document.getElementById("form");
let formCloseBtn = document.getElementById("form-close-btn");
let loaderScreen = document.getElementById("loader-screen");
let filterSelect = document.getElementById('filterSelect');
let allBooks = [];


async function getData() {
    try {
        const { data, error } = await supabase
            .from('Books')
            .select();

        loaderScreen.classList.add("show");

        if (error) throw error;

        if (data) {
            allBooks = data; 
            displayBooks(allBooks); 
            loaderScreen.classList.remove("show"); 
            loaderScreen.classList.add("hide");
        }
    } catch (error) {
        console.log(error);
        loaderScreen.classList.remove("show"); 
        loaderScreen.classList.add("hide");
    }
}


function displayBooks(books) {
    booksGrid.innerHTML = books.map((book) => {
        return `
        <div class="col p-3 p-lg-4">
            <div class="card-book h-100 style="box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;">
                <img src="${book.image_url}" class="card-img" alt="${book.title}">
                <div class="card-body">
                    <h5 class="book-title">${book.title}</h5>
                    <p class="book-author">
                        <i class="bi bi-person-fill me-2"></i>${book.author}
                    </p>
                    <p class="book-description">${book.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-tag">₹${book.price}</span>
                        <button class="btn btn-buy">
                            <i class="bi bi-cart3 me-2"></i>Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
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
    formBtn.addEventListener('click', show);
}


function show() {
    form.classList.remove("hide");
    form.classList.add("show");
}


if (formCloseBtn) {
    formCloseBtn.addEventListener('click', close);
}


function close() {
    form.classList.add("hide");
    form.classList.remove("show");
}


window.onload = function() {
    getData(); 
    close(); 
}
