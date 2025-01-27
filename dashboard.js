// 4)))

const title = document.getElementById("title");
const author = document.getElementById("author");
const price = document.getElementById("price");
const description = document.getElementById("description");
const image = document.getElementById("image");
const addBookBtn = document.getElementById("addBtn");
const bookList = document.getElementById("book-list");

// Book data array
let books = [];

// Function to display books in the table
function displayBooks() {
  bookList.innerHTML = ""; 

  books.forEach((book, index) => {
    const row = bookList.insertRow();
    const titleCell = row.insertCell();
    const authorCell = row.insertCell();
    const priceCell = row.insertCell();
    const actionsCell = row.insertCell();

    titleCell.textContent = book.title;
    authorCell.textContent = book.author;
    priceCell.textContent = book.price;

    // Add delete button
    actionsCell.innerHTML = `
      <button class="btn btn-sm btn-danger" onclick="deleteBook(${index})">Delete</button>
    `;
  });
}



// 3))
window.deleteBook = async function (index) {
  try {
    const bookToDelete = books[index];

   

    // Delete the book from Supabase database
    const { error: dbError } = await supabase
      .from("Books")
      .delete()
      .eq("id", bookToDelete.id);

    if (dbError) throw dbError;

    // Remove the book from the local books array
    books.splice(index, 1);

    // Re-render the books
    displayBooks();

    
    Swal.fire({
      title: "Book Deleted Successfully",
      icon: "success",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
    });
  }
};





// Function to add a new book
async function addItems(event) {
  event.preventDefault(); // Prevent page reload
  
  // Get input values
  const titleValue = title.value.trim();
  const authorValue = author.value.trim();
  const priceValue = parseFloat(price.value).toFixed(2);

  const descriptionValue = description.value.trim();
  // const imageValue = image.value.trim();
  const imageFile = image.files[0];
  if (!titleValue || !authorValue || !priceValue || !descriptionValue || /*!imageValue*/  !imageFile) {
    Swal.fire({
      title: "Error",
      text: "Please fill in all fields!",
      icon: "error",
    });
    return;
  }

  try {
    // Generate a unique file name for the image and specify the folder
    const folderPath = "uploads"; // Define folder path
    const fileName = `${folderPath}/${Date.now()}_${imageFile.name}`; // Upload in the 'uploads' folder

    // Upload the image to Supabase bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("book-images")
      .upload(fileName, imageFile);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded image
    const { data: publicURLData } = supabase.storage
      .from("book-images")
      .getPublicUrl(fileName);

    const imageURL = publicURLData.publicUrl;




    // Insert the book into Supabase
    const { data, error } = await supabase
      .from("Books")
      .insert([
        {
          title: titleValue,
          author: authorValue,
          price: priceValue,
          description: descriptionValue,
          image_url: imageURL,
        },
      ])
      .select();

    if (error) throw error;

    if(data){
      console.log(data)
    }

    // Clear form fields
    title.value = "";
    author.value = "";
    price.value = "";
    description.value = "";
    image.value = "";

    // Notify success
    Swal.fire({
      title: "Book Added Successfully",
      icon: "success",
    });

    // Re-fetch and display books
    fetchBooks();
  } catch (error) {
    console.error("Error adding book:", error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
    });
  }
}

// Fetch books from Supabase
async function fetchBooks() {
  try {
    // Fetch books from Supabase
    const { data, error } = await supabase.from("Books").select("*");

    if (error) throw error;

    // Update the local books array with the fetched data
    books = data;

    // Display books in the table
    displayBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to fetch books!",
      icon: "error",
    });
  }
}


window.onload= fetchBooks();

// Add event listener to Add button
if (addBookBtn) {
  addBookBtn.addEventListener("click", addItems);
}
