import { useState } from "react";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { QRCodeCanvas } from "qrcode.react";
function download(href, name){
    var link = document.createElement("a");
    link.setAttribute('download', name);
    link.href = href;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
export default function QrCodeGenerator(){
    const [restaurantUrl, setUrl] = useState()
    useEffect(() => {
        fetch("/admin/session/id", {credentials: 'include'}).then(response => response.json()).then((data) => {
            if(data.status != false){
                setUrl(data.url)
            }
        })
    }, [])
    function saveQr(){
        const data = new FormData()
        data.append("url", restaurantUrl)
        fetch("/admin/generateqr", {method: 'POST', credentials: 'include', body: data}).then(res => res.json()).then((dataRes) => {
            download(`data:image/png;base64,${dataRes.img}`, 'mioes_qr.png')
        })
    }
    return(
        <Sidebar element={<div style={{display: 'flex', justifyContent: 'center'}}>
            <style dangerouslySetInnerHTML={{__html: "\n.div {\n    width: 20.125rem;\n    background-color: #cadff5;\n    padding: 25px;\n    border-radius: 25px;\n    text-align: center;\n}\n\n.qrImg {\n    width: 70%;\n    border-radius: 10px;\n}\n\n.div2 {\n    padding-left: 20px;\n    padding-right: 20px;\n}\n\n.title {\n    font-size: 1.375rem;\n    font-weight: 700;\n}\n\n.text {\n    font-size: 15px;\n    font-weight: 400;\n}\n" }} />
            <div class="div">
            <h1>Genera tu QR</h1>
            <QRCodeCanvas
      id="qrImg"
      value={restaurantUrl}
      alt="Qr"
      imageSettings={{width: '70%', height: '55%'}}
      className="qrImg"
      bgColor={"#cadff5"}
      level={"H"}
    />
        <div class="div2">
            <h1 className="title">Este es tu código QR</h1>
            <p className="text">Escanea el código QR para ver el perfil de tu restaurante.</p>
            <button onClick={saveQr}>Descargar QR</button>
        </div>
        <a href="https://forms.gle/njVBVjHSThnmgGxG7" style={{fontWeight: 800}}>Pedir pegatinas</a>
        </div>
        <QRCodeCanvas
      id="qrImgToDownload"
      value={restaurantUrl}
      alt="Qr"
      imageSettings={{width: '300px', height: '300px'}}
      className="qrImg"
      bgColor="#FFFFFFFF"
      level={"H"}
      hidden
    />
        </div>}></Sidebar>
    )
}