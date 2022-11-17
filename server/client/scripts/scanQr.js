function scanQr(){
    setTimeout(function(){
        var preloader = document.getElementById('preloader')
        var imgLoaderContainer = document.getElementById("imgLoaderContainer")
        if(preloader){preloader.classList.add('preloader-hide'); imgLoaderContainer.hidden = true}
    },250);
        Html5Qrcode.getCameras().then(cameras => {
        if(cameras && cameras.length){
            const reader = new Html5Qrcode("reader")
            setTimeout(() =>{
                if(preloader) preloader.classList.add("preloader-hide")
            }, 600)
            reader.start({facingMode: "environment"}, {fps: 10, qrbox: 250}, (decodedText, decodedResult) => {
                reader.stop()
                window.location.replace(decodedResult);
                console.log(decodedResult, decodedText)  
        })
        }
        else{
            if(preloader) preloader.classList.add("preloader-hide")
        }
    }).catch(err => {alert(err);setTimeout(() => {if(preloader) preloader.classList.add("preloader-hide")}, 300)})
}
