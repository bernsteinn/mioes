const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});
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
                position: "left", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
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
                position: "left", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
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
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
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
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
setTimeout(() => {
          window.location = "/admin"
      }, 500)
  })
})