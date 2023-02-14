import Sidebar from "./Sidebar"
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function ConfigPage(){
    var animateButton = function(e) {
        const resetPassword = new FormData()
        var old = document.getElementById("oldPass").value
        var newP = document.getElementById("newPass").value
        var newRepeat = document.getElementById("newPassRepeat").value
        if(newP === newRepeat){
            resetPassword.append("oldPassword", old)
            resetPassword.append("newPassword", newP)
            e.preventDefault();
            fetch("/admin/changepassword", {method: 'POST',credentials: 'include', body: resetPassword}).then(res => res.json()).then((data) => {
                if(data.status){
                    toast.success("Contraseña cambiada con éxito.")
                    return
                }
                toast.error("Ha habido un problema cambiando la contraseña. Vuelvelo a intentar más tarde.")
                return
            })
        }
      };
    useEffect(() => {
        var classname = document.getElementsByClassName("btn");
      
        for (var i = 0; i < classname.length; i++) {
          classname[i].addEventListener('click', animateButton, false);
        }
      }, [])
    
    return(<><Sidebar element = {
        <>
    <div>
    <div class="card card-style">
            <div class="content mb-0">
                <h1 class="text-center"><i class="fa fa-question-circle fa-3x color-highlight mt-2"></i></h1>
                <h1 class="pt-3 mt-2 text-center font-800 font-40 mb-1">Modificar tus datos</h1>
                <p class="text-center color-highlight font-11">Aquí puedes cambiar tu contraseña</p>

                <div class="input-style has-icon validate-field">
                    <i class="fa fa-at"></i>
                    <input type={"password"} id="oldPass" placeholder="Contraseña actual"></input>  
                    <label for="form2a" class="color-highlight">Contraseña actual</label>
                    <i class="fa fa-times disabled invalid color-red-dark"></i>
                    <i class="fa fa-check disabled valid color-green-dark"></i>
                </div>
                <div class="input-style has-icon validate-field">
                    <i class="fa fa-at"></i>
                    <input type={"password"} id="newPass"placeholder="Nueva contraseña"></input>  
                    <label for="form2a" class="color-highlight">Nueva contraseña</label>
                    <i class="fa fa-times disabled invalid color-red-dark"></i>
                    <i class="fa fa-check disabled valid color-green-dark"></i>
                </div>
                <div class="input-style has-icon validate-field">
                    <i class="fa fa-at"></i>
                    <input type={"password"} id="newPassRepeat"placeholder="Repite la nueva contraseña"></input>  
                    <label for="form2a" class="color-highlight">Repetir nueva contraseña</label>
                    <i class="fa fa-times disabled invalid color-red-dark"></i>
                    <i class="fa fa-check disabled valid color-green-dark"></i>
                </div>
                <a href="#" class="btn btn-m my-3 btn-full rounded-sm bg-highlight text-uppercase font-900">Guardar</a>
            </div>
        </div>
    </div>
    </>
}></Sidebar></>)
}