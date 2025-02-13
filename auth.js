let signup_Email = document.getElementById("signup_email");
let signup_Name = document.getElementById("signup_name");
let signup_Password = document.getElementById("signup_password");
let signup_Button = document.getElementById("signup_button");
let signup_spinner = document.getElementById("spinner");
let logOutBtn = document.getElementById('logOut')
let signUp_with_google_btn = document.getElementById("google-signup")
let signin_Email = document.getElementById("signin_email");
let signin_Password = document.getElementById("signin_password");
let signin_Button = document.getElementById("signin_button");

// const Swal = require('sweetalert2')


// signup_spinner.style.display = "none";
async function signup() {
  try {
    signup_spinner.style.display = "block"; // Show spinner

    // Step 1: Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: signup_Email.value,
      password: signup_Password.value,
    });

    if (error) throw error; // Throw error if signup fails

    if (data.user) {

      Swal.fire({
        title: "Please check your email for confirmation!",
        icon: "success",
        draggable: true,
      });
window.location.href = 'login.html'
      //  Set role based on email
      const role = signup_Email.value === "hammad@mailinator.com" ? "admin" : "user";

      //  Insert the user into the "users" table

      const { error: userError } = await supabase

        .from("users")
        .insert([
          {
            id: data.user.id, // Use the correct ID from the signup response
            email: signup_Email.value,
            role: role, // Default role
          },
        ]);

      if (userError) {
        console.error("Error inserting into users table:", userError);
        Swal.fire({
          title: "Error saving user to the database.",
          text: userError.message,
          icon: "error",
        });
        return;
      }
    }

    // Clear input fields
    signup_Email.value = "";
    signup_Name.value = ""; // Optional if you're using the name field later
    signup_Password.value = "";
  } catch (error) {
    console.error("Error during signup:", error);
    Swal.fire({
      title: "Error signing up!",
      text: error.message,
      icon: "error",
    });
  } finally {
    signup_spinner.style.display = "none"; // Hide spinner
  }
}
async function signUpGoogle() {
  try {
    event.preventDefault()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard.html`, // Redirect to the dashboard
      },
    })

    if (error) throw error;
    if (data) {
      console.log(data);



    }
  }

  catch (error) {
    console.log("Error:" + error);
  }
}



async function signIn() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: signin_Email.value,
      password: signin_Password.value,
    })
    if (error) throw error;
    console.log(data);

    if (data) {
      Swal.fire({
        title: "Login successful",
        icon: "success",
        draggable: true
      });

      console.log(data.user.email)

      // if (data.user.email  =="hammad@mailinator.com" && data.user.id=="95ae4d45-881a-48fe-b1eb-0e31283efbed"){
      //   // console.log(email.value,password.value);

      //   window.location.href = '/dashboard.html'
      // }
      // Fetch user's role from the "users" table



      // This is my auth logic for the future 
      //   const { data: userData, error: roleError } = await supabase
      //   .from("users")
      //   .select("role")
      //   .eq("id", data.user.id)
      //   .single();

      // if (roleError) throw roleError; 

      // console.log("User Role:", userData.role);

      // // Redirect based on role
      // if (userData.role === "admin") {
      //   window.location.href = "/dashboard.html"; // Admin goes to dashboard
      // } else {
      //   window.location.href = "/marketplace.html"; // User goes to marketplace
      // }


      window.location.href = "/marketplace.html"; // User goes to marketplace
    }

    return data
  }
  catch (error) {
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


if (signUp_with_google_btn) {
  signUp_with_google_btn.addEventListener("click", signUpGoogle);
}


// if signin button is clicked
if (signin_Button) {
  signin_Button.addEventListener("click", signIn)
}

async function checkSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    let authPages = ["/index.html", "/login.html", "/"];
    let currentPath = window.location.pathname;
    let isAuth = authPages.some((page) => page.includes(currentPath));
    const session = data.session;
    if (session) {
      if (isAuth) {
        window.location.href = "/marketplace.html";
      }
    }
    if (session === null) {
      if (!isAuth) {
        window.location.href = "/login.html";
      }
    }
  } catch (error) {
    console.log(error);
  }
}
checkSession();

async function currentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (user) {
      let currentUser = {
        userId: user.id,
        email: user.email
      }
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
  } catch (error) {
    console.log(error);

  }
}
currentUser()

async function logOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    window.location.reload()
    localStorage.removeItem('currentUser')
  } catch (error) {
    console.log(error);

  }
}
if (logOutBtn) {
  logOutBtn.addEventListener('click', logOut)
}