document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("loadedPage", true)
    document.getElementById("qr-init").addEventListener("click", () => window.location = "/scanqr")
})
