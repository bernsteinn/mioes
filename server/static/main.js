
var qrInitializer = document.querySelector(".qr-init")
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0';
link.media = 'all';
head.appendChild(link);
var readerContainer = document.createElement("div")
readerContainer.style.display = "block"
readerContainer.style.marginLeft = "auto"
readerContainer.style.marginRight = "auto"
//readerContainer.style.borderRadius = "10px"
readerContainer.id = "reader"
var video = document.createElement("video")
var loader = document.createElement("div")
loader.className = "loader"
video.autoplay = true
video.id = "qr-camera"
video.style.borderRadius = "10px"
video.style.marginLeft = "auto"
video.style.marginRight = "auto"
video.style.width = "50%"
var pageTitle = document.createElement("h1")
pageTitle.innerText = "Escanea el código QR"
pageTitle.style.textAlign = "center"
var localstream
function showCarta(){
  var container = document.getElementById("content")
  var section = document.createElement("section")
  section.className ="layout"
  section.id = "layout"
  container.innerHTML = ""
  container.appendChild(section)
  var data = JSON.parse(sessionStorage.getItem("r_info"))
  document.getElementById("cart").style.backgroundColor = "black"
  document.getElementById("cart").style.color = "white"
  document.getElementById("description").style.backgroundColor = "#d1e6e8"
  document.getElementById("description").style.color = "#0c032d"
  var data = JSON.parse(sessionStorage.getItem("r_info"))
  data.menuCategories.forEach(element => {
    var category = document.createElement("div")
    category.className = "menu-element"
    category.innerHTML = `<img class="categoryImage" src=${element.img}><p class="categoryName">${element.name}</p>`
    section.appendChild(category)
  });
  var stylesMenu = document.getElementById("layout")
  stylesMenu.style.gridTemplateRows = `repeat(${data.menuElements}, 1fr)`
  stylesMenu.style.height = `${data.menuElements * 20}vh`
}
function showDescription(){
  var container = document.getElementById("content")
  var data = JSON.parse(sessionStorage.getItem("r_info"))
  document.getElementById("description").style.backgroundColor = "black"
  document.getElementById("description").style.color = "white"
  document.getElementById("cart").style.backgroundColor = "#d1e6e8"
  document.getElementById("cart").style.color = "#0c032d"
  container.innerHTML = `                    
  <h2>Descripción</h1>
  <p>${data.description}</p>
  <h2>Tipología</h1>
  <p>${data.tipo}</p>
`



}
async function scanQr(){
    var appWrapper = document.getElementById("app-wrapper")
    appWrapper.hidden = true
    Html5Qrcode.getCameras().then(cameras => {
      document.body.appendChild(pageTitle)
       document.body.appendChild(readerContainer)
       document.body.style.backgroundColor = "#ffc244"
        if (cameras && cameras.length) {
            const reader = new Html5Qrcode("reader")
            reader.start({ facingMode: "environment"},{fps:10, qrbox: 250}, (decodedText, decodedResult) =>{
              document.body.appendChild(loader)
              reader.stop()
              Loader.open()
                fetch("https://api.mioes.app/qr-results", {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({data:decodedResult.decodedText})
                }).then(response => response.json()).then((data) => {
                  setTimeout(() => {
                    Loader.close()
                  }, 500)
                  console.log(data)
                  document.body.style.backgroundColor = "white"
                  appWrapper.hidden = false  
                  pageTitle.hidden = true
                  video.pause()
                  video.hidden = true
                  document.querySelector(".loader").hidden = false
                  appWrapper.innerHTML = `<div style='height:300vh;background-color:#ffc244;'>
                  <img src='/${data.img}' style='width:100vw;display:block; margin-left:auto, margin-right:auto; border-bottom-right-radius: 50% 18%; border-bottom-left-radius: 50% 18%;'>
                  <h1 style='text-align:center;'>${data.name}</h1>
                  <h3 style='text-align:center;'>
                  <span style="position:relative; top:5px;"class="material-symbols-outlined" onclick="mapsSelector(${data.lat}, ${data.long})">location_on</span>
                  ${data.address}
                  </h3>
                  <div class="btn-group" style="    display: flex;
                  justify-content: center; gap: 10px;
                  ">
                  <button class="b" id="description" onclick="showDescription()">Información</button>
                  <button class="b" id="cart"onclick="showCarta()">Carta</button>
                  <style>
                  .b{
                    width:110px;
                    color: #0c032d;
                    background-color: #d1e6e8;
                    border-radius: 50px;
                    height: 35px;
                    border:black;
                  }
                  </style>
                  </div> 
                  <div id="content" style="margin-left:25px;">
                    <h2>Descripción</h1>
                    <p>${data.description}</p>
                    <h2>Tipología</h1>
                    <p>${data.tipo}</p>
                  </div>
                  </div>`
                  document.getElementById("description").style.backgroundColor = "black"
                  document.getElementById("description").style.color = "white"
                  sessionStorage.setItem("r_info", JSON.stringify(data))
                })
            },
            (errorMessage) => {

            })
          }
        }).catch(err => {
          alert("Algo ha ido mal, vuelve a intentarlo.")
          window.location.reload()
        });
}
qrInitializer.addEventListener("click", scanQr)
function searchRestaurant(){
  var appWrapper = document.getElementById("app-wrapper")
  var code = document.getElementById("manualRestaurantInput")
  if(code.value.length < 12 ){alert("Este código no es correcto, por favor, vuelvelo a intentar."); return}
  Loader.open()
  fetch("https://api.mioes.app/search", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({restaurantId: code.value})
  }).then(response => response.json()).then((data) => {
    setTimeout(() => {
      Loader.close()
    }, 500)
    console.log(data)
    document.body.style.backgroundColor = "white"
    appWrapper.hidden = false  
    pageTitle.hidden = true
    video.pause()
    video.hidden = true
    appWrapper.innerHTML = `<div style='height:300vh;background-color:#ffc244;'>
    <img src='/${data.img}' style='width:100vw;display:block; margin-left:auto, margin-right:auto; border-bottom-right-radius: 50% 18%; border-bottom-left-radius: 50% 18%;'>
    <h1 style='text-align:center;'>${data.name}</h1><h3 style='text-align:center;'>
    <span style="position:relative; top:5px;"class="material-symbols-outlined" onclick="mapsSelector(${data.lat}, ${data.long})">location_on</span>
    ${data.address}</h3>
    <div class="btn-group" style="    display: flex;
    justify-content: center; gap: 10px;
    ">
    <button class="b" id="description" onclick="showDescription()">Información</button>
    <button class="b" id="cart"onclick="showCarta()">Carta</button>
    <style>
    .b{
      width:110px;
      color: #0c032d;
      background-color: #d1e6e8;
      border-radius: 50px;
      height: 35px;
      border:black;
    }
    </style>
    </div> 
    <div id="content" style="margin-left:25px;">
      <h2>Descripción</h1>
      <p>${data.description}</p>
      <h2>Tipología</h1>
      <p>${data.tipo}</p>
    </div>
    </div>`
    document.getElementById("description").style.backgroundColor = "black"
    document.getElementById("description").style.color = "white"
    sessionStorage.setItem("r_info", JSON.stringify(data))
  })


}

function mapsSelector(lat, long) {
  if 
    ((navigator.platform.indexOf("iPhone") != -1) || 
     (navigator.platform.indexOf("iPad") != -1) || 
     (navigator.platform.indexOf("iPod") != -1))
    window.open("maps://maps.google.com/maps?daddr="+lat+","+long+"&amp;ll=");
    else
    window.open("https://maps.google.com/maps?daddr="+lat+","+long+"&amp;ll=");
}