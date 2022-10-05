document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("loadedPage", true)
    document.getElementById("qr-init").addEventListener("click", () => window.location = "/scanqr")
    window.addEventListener("scroll", function(){
        if(window.scrollY==0){
            document.getElementById("headerNav").style.background = "transparent"
            document.getElementById("headerNav").style.boxShadow = "none"    
        } else {
            document.getElementById("headerNav").style.background = "rgb(255, 255, 255)"
            document.getElementById("headerNav").style.boxShadow = "rgba(0, 0, 0, 0.2) 0px 1px 8px"   

        }
      });
})
