import styles from '../login.module.css'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
export default function Register(){

    function RegisterOW(e){
        e.preventDefault()
        var u = document.getElementById("username").value
        var p = document.getElementById("pass").value
        var pr = document.getElementById("pass-repeat").value
        var em = document.getElementById("email").value
        if(u.length < 1 || p.length < 1){
            //Display password error
            return
        }
        if(p != pr){
            var passContainer = document.getElementById("passwordContainer")
            var passInput = document.getElementById("pass")
            passContainer.style.background = "red"
            passInput.style.background = "red"
            toast.error("Las contraseñas no coinciden", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return
        }

        
        fetch("/admin/session/register",{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:u, password:p, email: em})
        }).then(response => response.json()).then((data) => {
            var userContainer = document.getElementById("emailContainer")
            var passContainer = document.getElementById("passwordContainer")
            var passInput = document.getElementById("pass")
            var userInput = document.getElementById("username")
            userContainer.style.background = "white"
            passContainer.style.background = "white"
            userInput.style.background = "white"
            passInput.style.background = "white"
            if(data.status != true){
                if(data.err.code == 2){
                    userContainer.style.background = "red"
                    userInput.style.background = "red"
                    toast.error(data.err.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                }
                else{
                    passContainer.style.background = "red"
                    passInput.style.background = "red"
                    toast.error(data.err.msg, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                }
                return
            }
            toast.success(data.msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined})
            setTimeout(() => {
                window.location = "/admin"
            }, 1500)
        })
    }
    return(
        
        <div className={styles.screen1}>
            <img className={styles.logo} src={"/logo_login.png"}></img>
        <div className={styles.email} id="emailContainer">
          <div className={styles.sec2}>
            <ion-icon name="mail-outline" />
            <input type="email" name="email" id="email" placeholder="Email" />
          </div>
        </div>
        <div className={styles.email} id="emailContainer">
          <div className={styles.sec2}>
            <ion-icon name="mail-outline" />
            <input type="email" name="email" id="username" placeholder="Usuario" />
          </div>
        </div>
        <div className={styles.password} id="passwordContainer_repeat">
          <div className={styles.sec2}>
            <ion-icon name="lock-closed-outline" />
            <input className={styles.pas} type="password" id="pass-repeat" name="password" placeholder="Repetir contraseña" />
            <ion-icon className={styles.showHide} name="eye-outline" />
          </div>
        </div>
        <div className={styles.password} id="passwordContainer">
          <div className={styles.sec2}>
            <ion-icon name="lock-closed-outline" />
            <input className={styles.pas} type="password" id="pass" name="password" placeholder="Contraseña" />
            <ion-icon className={styles.showHide} name="eye-outline" />
          </div>
        </div>
        <button className={styles.login} onClick={RegisterOW}>Crear cuenta</button>
        <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
pauseOnHover
/>
{/* Same as */}
<ToastContainer />
      </div>

        )
}