let booksGrid = document.getElementById("books-grid")
let formBtn = document.getElementById("form-btn")
let form = document.getElementById("form")
let formCloseBtn = document.getElementById("form-close-btn")
let loaderScreen = document.getElementById("loader-screen")
async function getData() {
try {
    const { data, error } = await supabase
    .from('Books')
    .select()
loaderScreen.classList.add("show")
  if (error) throw error
  console.log(data);
   if(data){
    loaderScreen.classList.remove("hide")

    ;for (let val of data){console.log(val);
   
    booksGrid.innerHTML += `  <div class="col"><div class="row align-items-center  shadow bg-body-tertiary border rounded-4"><div class="col-6"><img class="w-100" src="${val.image_url}" alt="${val.title}"></div>
        <div class="col-6 text-start"><h5 class="">${val.title}</h5><h6 class="">Author:${val.author}</h6><p class=""><b> Description </b><br> ${val.description}</p><div class="d-flex justify-content-between align-items-center my-2"> <span>Rs 4560</span> <button class="btn btn-dark">Buy Now</button></div></div>
        <div></div></div></div>`
    }
   }
} catch (error) {
    console.log(error);
    
}
 
}
formBtn.addEventListener('click',show)
function show(){
    form.classList.remove("show")
    form.classList.add("hide")
}
formCloseBtn.addEventListener('click', close)
function close(){
    form.classList.add("show")
    form.classList.remove("hide")
}
window.onload = getData(),close()