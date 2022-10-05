import Sidebar from "./Sidebar"
import { ToastContainer, toast } from 'react-toastify';

export default function SocialMedia(){
    const newPost = () => {
        const form = new FormData()
        const file = document.getElementById("postImage").files[0]
        if(!['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].includes(file.type)){
            alert("Solo imagenes.")
            return;
        }
        if(file.size > 2 * 2056 * 2056) {
            console.log('La foto no puede pesar más de 5MB');
            return;
        }
        form.append('postImage', file)
        form.append('title', document.getElementById("title").value)
        form.append('msg', document.getElementById("msg").value)
        fetch("/newpost", {
            method: 'POST',
            credentials: 'include',
            body: form
        }).then(response => response.json()).then((data) => {
            if(data.status == true){
                console.log("Posted succesfully")
            }
        })
    }
    return(<><Sidebar element = {
<div className="card card-style" style={{height: '70%', marginLeft: '10%', marginTop: '10%'}}>

    <div className="content mb-0">
      <h3>Nueva publicación</h3>
      <p>
        Esta publicación les va a aparecer a los usuarios.
      </p>
      <div className="input-style has-borders no-icon validate-field mb-4">
        <input type="text" className="form-control validate-text" id="title" placeholder="Título" />
        <label htmlFor="title" className="color-highlight">Título</label>
        <i className="fa fa-times disabled invalid color-red-dark" />
        <i className="fa fa-check disabled valid color-green-dark" />
        <em>(obligatorio)</em>
      </div>
      <div className="input-style has-borders no-icon mb-4">
        <textarea id="msg"placeholder="Enter your message" defaultValue={""} />
        <label htmlFor="msg" className="color-highlight">Texto para tu publicación</label>
        <em className="mt-n3">(required)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
      <div>
        <h4>Subir una imagen</h4>
        <p>
          Tu publicación necesita una imagen para verse bien, subela aqui.
        </p>
        <div className="file-data pb-5">
          <input type="file" id="postImage" className="upload-file bg-highlight shadow-s rounded-s " accept="image/*" />
          <p className="upload-file-text color-white">Subir imagen</p>
        </div>
      </div>
      </div>
      <a href="#" onClick={newPost} className="btn btn-m rounded-sm mt-4 mb-4 btn-full bg-green-dark text-uppercase font-900">Crear Publicación</a>
    </div>
  </div>}></Sidebar></>)
}