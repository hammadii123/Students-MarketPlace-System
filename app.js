let booksGrid = document.getElementById("books-grid")
let favBookGrid = document.getElementById('Fav-books-grid')
let formBtn = document.getElementById("form-btn")
let form = document.getElementById("form")
let formCloseBtn = document.getElementById("form-close-btn")
let loaderScreen = document.getElementById("loader-screen")
let filterSelect = document.getElementById('filterSelect')
let AllBooksBtn = document.getElementById('AllBooks')
let FavouritesBtn = document.getElementById('Favourites')
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
if (AllBooksBtn) {
    AllBooksBtn.addEventListener('click', displayBooks)
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
window.addFavBook = addFavBook
async function addFavBook(id) {
    console.log(id);

    let currentUser = localStorage.getItem('currentUser')
    currentUser = JSON.parse(currentUser)
    try {
        const { data, error } = await supabase
            .from('favBooks')
            .select('id')
            .eq('userId', currentUser.userId)
            .eq('bookId', id);
        if (error) throw error
        if (data.length > 0) {
            await supabase
                .from('favBooks')
                .delete()
                .match({ userId: currentUser.userId, bookId: id });

                Swal.fire({
                    title: "Info",
                    text: "Removed From Favourites",
                    icon: "error"
                  });
        }
        else {
            try {
                const { error: storeError } = await supabase
                    .from('favBooks')
                    .insert({ userId: currentUser.userId, bookId: id, email: currentUser.email })
                if (storeError) throw storeError

                Swal.fire({
                    title: "Info",
                    text: "Added to Favourites",
                    icon: "success"
                  });

            } catch (error) {
                console.log(error);

            }
        }

    } catch (error) {
        console.log(error);

    }
}
async function getFavBook() {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let userId = currentUser.userId
    try {
        const { data, error } = await supabase
            .from('favBooks')
            .select('bookId')
            .eq('userId', userId);
        if (error) throw error
        if (data) {
            console.log(data);

            let favouriteIds = data.map((fav) => fav.bookId)
            console.log(favouriteIds);
            if (favouriteIds.length > 0) {
                try {
                    const { data: favData, error: favError } = await supabase
                        .from('Books')
                        .select('*')
                        .in('id', favouriteIds);
                    if (favError) throw favError
                    if (favData) {
                        console.log(favData);
                        showFavBooks(favData)
                    }
                } catch (error) {
                    console.log(error);

                }
            }

        }
    } catch (error) {
        console.log(error);
    }
}
async function showFavBooks(Data) {
    console.log('running...');

    if (Data.length === 0) {
        favBookGrid.innerHTML = "<p>No favorite books found.</p>";
        booksGrid.style.display = "none";
        favBookGrid.style.display = "flex";
    }
    favBookGrid.innerHTML = Data.map((book) => {
        return `  
        <div class="col">
            <div class="row align-items-center shadow bg-body-tertiary border rounded-4">
                <div class="col-6">
                    <img class="w-100" src="${book.image_url}" alt="${book.title}">
                </div>
                <div class="col-6 text-start">
                    <h5>${book.title}</h5>
                    <h6>Author: ${book.author}</h6>
                    <p><b>Description</b><br> ${book.description}</p>
                    <div class="d-flex justify-content-between align-items-center my-2">
                        <span>Rs ${book.price}</span>
                        <button class="btn btn-dark">Buy Now</button>
                        <button class="btn btn-outline-danger" onclick="removeFav(${book.id})">❌</button>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}
window.removeFav = removeFav
async function removeFav(id) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let userId = currentUser.userId
    try {const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
            await supabase
            .from('favBooks')
            .delete()
            .match({ userId: userId, bookId: id });
            getFavBook()
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          
        }
      });
       
    } catch (error) {
        console.log(error);

    }
}
if (AllBooksBtn) {
    AllBooksBtn.addEventListener('click', function () {
        booksGrid.style.display = "flex"; 
        favBookGrid.style.display = "none"; 
        displayBooks(allBooks);
    });
}

if (FavouritesBtn) {
    FavouritesBtn.addEventListener('click', function () {
        booksGrid.style.display = "none"; 
        favBookGrid.style.display = "flex";  
        getFavBook();
    });
}
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
