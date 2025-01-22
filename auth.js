let signup_Email = document.getElementById("signup_email");
let signup_Name = document.getElementById("signup_name");
let signup_Password = document.getElementById("signup_password");
let signup_Button = document.getElementById("signup_button");
let signup_spinner = document.getElementById("spinner");


let signin_Email=document.getElementById("signin_email");
let signin_Password=document.getElementById("signin_password");
let signin_Button=document.getElementById("signin_button");

// const Swal = require('sweetalert2')


// signup_spinner.style.display = "none";
async function signup() {
  try {
    signup_spinner.style.display = "block";

    const { data, error } = await supabase.auth.signUp({
      email: signup_Email.value,
      password: signup_Password.value,
    });

    if (error) throw error;
    if (data) {
      console.log(signup_Email.value);
      console.log(signup_Password.value);
    //   alert("Please check your email for confirmation..");
    Swal.fire({
        title: "Please check your email for confirmation!",
        icon: "success",
        draggable: true
      });
    }

    return data;
  } catch (error) {
    console.log(error);
    alert("Error signing up. Please try again.");
  
  } finally {
    signup_spinner.style.display = "none";
  }
}



async function signIn() {
    try {   
        const { data, error } = await supabase.auth.signInWithPassword({
            email: signin_Email.value,
            password: signin_Password.value,
          })
          if (error) throw error;

          if(data){
            Swal.fire({
                title: "Login successful",
                icon: "success",
                draggable: true
              });
              window.location.href = '/dashboard.html'
          }

          return data
    }
    catch(error){
        console.log(error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid email or password!",
    
          });
    }

}




//if signup button is clicked
if (signup_Button) {
  signup_Button.addEventListener("click", signup);
}


// if signin button is clicked
if(signin_Button){
    signin_Button.addEventListener("click",signIn)
}