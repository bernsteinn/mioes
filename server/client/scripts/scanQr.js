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
                    if(data.status == true){
                        window.location = `/restaurant?id=${data.id}`
                    }
                  })
        })
        }
        else{
            if(preloader) preloader.classList.add("preloader-hide")
        }
    }).catch(err => {alert(err);setTimeout(() => {if(preloader) preloader.classList.add("preloader-hide")}, 300)})
}
