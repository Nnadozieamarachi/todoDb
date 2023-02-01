document.addEventListener("DOMContentLoaded", function () {
  const signupBtn = document.getElementsByClassName("signupBtn")[0];
  const signinBtn = document.getElementsByClassName("signinBtn")[0];
  const email = document.getElementsByClassName("emailInput")[0];
  const password = document.getElementsByClassName("password")[0];
  const userNameInput = document.getElementsByClassName("userNameInput")[0];
  const signupBtnSwap = document.getElementsByClassName("signupBtnSwap")[0];
  const signinBtnSwap = document.getElementsByClassName("signupBtnSwap")[0];

  function addNewUser() {
    const userEmail = email.value;
    const userPassword = password.value;
    const userName = userNameInput.value;

    console.log(userEmail);
    console.log(userName);

    fetch("http://localhost:3002/signup", {
      method: "POST",
      cors: "no-cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
        userName: userName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          console.log(data.status);
          // Sign-up was successful, redirect to next page
          window.location = "./home.html";
        } else {
          // Sign-up failed, display error message
          console.log("Sign-up failed with error: ", data.error);
        }
      })
      .catch((error) => {
        console.log("error parsing response:", error);
      });
  }
  signupBtn.addEventListener("click", addNewUser);

  function loginUser() {
    const userEmail = email.value;
    const userPassword = password.value;
    console.log(userEmail);

    fetch("http://localhost:3002/login", {
      method: "POST",
      cors: "no-cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.description === "logged in successfully") {
          // Compare the password entered by the user with the one in the database
          // const passwordMatch = bcrypt.compare(
          //   userPassword,
          //   data.password,
          //   function (err, result) {
          //     if (passwordMatch) {
          //       // Password matched
          //       res.json({
          //         description: "logged in successfully",
          //       });
          //       // open homepage
          window.location = "./home.html";
          //     } else {
          //       // Password didn't match
          //       res.json({
          //         description: "Incorrect password",
          //       });
          //       console.log("Incorrect Password");
          //     }
          //   }
          // );
        } else {
          res.json({
            description: "login failed",
          });
        }
      })
      .catch((error) => console.log(error));
  }

  signinBtn.addEventListener("click", loginUser);

  // function swapSigninPage() {
  //   window.location = "./signin.html";
  // }
  // signinBtnSwap.addEventListener("click", swapSigninPage);

  //switching  to the signup page
  function swapSignupPage() {
    window.location = "./signup.html";
  }
  signupBtnSwap.addEventListener("click", swapSignupPage);
});
