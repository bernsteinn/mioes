const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
document.getElementById("loginBtn").addEventListener("click", (e) => {
  e.preventDefault()
  var u = document.getElementById("username").value
  var p = document.getElementById("pass").value
  if(u.length < 1 || p.length < 1){
      //Display password error
      return
  }
  fetch("/admin/session/login",{
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:u, password:p})
  }).then(response => response.json()).then((data) => {
      var userContainer = document.getElementById("userContainer")
      var passContainer = document.getElementById("passwordContainer")
      userContainer.style.background = "#f0f0f0"
      passContainer.style.background = "#f0f0f0"
      if(data.status != true){
          if(data.err.code == 2){
              userContainer.style.background = "red"
              Toastify({
                text: data.err.msg,
                duration: 3000,
                newWindow: false,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #d92626, #ff0000)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
          }
          else{
              passContainer.style.background = "red"
              Toastify({
                text: data.err.msg,
                duration: 3000,
                newWindow: false,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #d92626, #ff0000)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
          }
          return
      }
      if(data.status == true && data.code == 44){
          localStorage.setItem("hasToCompleteSetUp", true)
          Toastify({
            text: data.msg,
            duration: 3000,
            newWindow: false,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #56f53d, #21f300)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
      setTimeout(() => {
              window.location = "/admin"
          }, 500)
          return;
      }
      localStorage.setItem("hasToCompleteSetUp", false)
      Toastify({
        text: data.msg,
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #56f53d, #21f300)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
setTimeout(() => {
          window.location = "/admin"
      }, 500)
  })
})

document.getElementById("registerBtn").addEventListener("click", (e) => {
  e.preventDefault()
  var u = document.getElementById("usernameRegister").value
  var p = document.getElementById("passRegister").value
  var pr = document.getElementById("pass-repeat").value
  var em = document.getElementById("emailRegister").value
  var passInputRepeat = document.getElementById("passErrorRepeat")
  var emailError = document.getElementById("emailError")
  if(u.length < 1 || p.length < 1){
      //Display password error
      return
  }
  if(p != pr){
      var passInput = document.getElementById("passError")
      passInput.style.background = "red"
      passInputRepeat.style.background = "red"
      Toastify({
        text: "Las contraseñas no coinciden",
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #d92626, #ff0000)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
return
  }
  if(!validateEmail(em)){
    emailError.style.background = "red"
    Toastify({
      text: "Este email no es válido",
      duration: 3000,
      newWindow: false,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #d92626, #ff0000)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
return
  }

  
  fetch("/admin/session/register",{
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:u, password:p, email: em})
  }).then(response => response.json()).then((data) => {
      var passInput = document.getElementById("passError")
      var userInput = document.getElementById("userError")
      userInput.style.background = "white"
      passInput.style.background = "white"
      passInputRepeat.style.background = "white"
      if(data.status != true){
          if(data.err.code == 2){
              userInput.style.background = "red"
              Toastify({
                text: data.err.msg,
                duration: 3000,
                newWindow: false,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #d92626, #ff0000)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
          }
          else{
              passInput.style.background = "red"
              passInputRepeat.style.background = "red"
              Toastify({
                text: data.err.msg,
                duration: 3000,
                newWindow: false,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #d92626, #ff0000)",
                },
                onClick: function(){} // Callback after click
              }).showToast();
          }
          return
      }
      Toastify({
        text: data.msg,
        duration: 3000,
        newWindow: false,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #56f53d, #21f300)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      setTimeout(() => {
          container.classList.remove("sign-up-mode");
      }, 500)
  })
})
