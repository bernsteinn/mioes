var opacity = 0;
var animation;
setTimeout(() => {
    document.getElementById("footer-bar").hidden = false;
    animation = setInterval(() => {
        opacity = opacity + 0.02
        if(opacity > 1){clearInterval(animation)}
        document.getElementById("footer-bar").style.opacity = opacity
        console.log("yes")
    }, 25)
}, 2000)

function scanQr(){
    var preloader = document.getElementById('preloader')
    if(preloader){
        setTimeout(() => {
            preloader.classList.remove("preloader-hide")
            preloader.classList.add("preloader")
        }, 300)}
    Html5Qrcode.getCameras().then(cameras => {
        if(cameras && cameras.length){
            const reader = new Html5Qrcode("reader")
            setTimeout(() =>{
                if(preloader) preloader.classList.add("preloader-hide")
            }, 600)
            reader.start({facingMode: "environment"}, {fps: 10, qrbox: 250}, (decodedText, decodedResult) => {
                reader.stop()
                fetch("https://api.mioes.app/qr-results", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({data:decodedResult.decodedText})
                  }).then(response => response.json()).then((data) => {
                    console.log(data)
            })
        })
        }
        else{
            if(preloader) preloader.classList.add("preloader-hide")
        }
    }).catch(err => {alert(err);setTimeout(() => {if(preloader) preloader.classList.add("preloader-hide")}, 300)})
}
