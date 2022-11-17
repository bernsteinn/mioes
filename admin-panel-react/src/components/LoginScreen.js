import styles from '../login.module.css'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
export default function Login(){

    function loginOW(e){
        e.preventDefault()
        var u = document.getElementById("username").value
        var p = document.getElementById("pass").value
        if(u.length < 1 || p.length < 1){
            //Display password error
            return
        }
        fetch("/admin/session/login",{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:u, password:p})
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
            if(data.status == true && data.code == 44){
                localStorage.setItem("hasToCompleteSetUp", true)
                toast.success(data.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined})
                setTimeout(() => {
                    window.location.reload()
                }, 500)
                return;
            }
            localStorage.setItem("hasToCompleteSetUp", false)
            toast.success(data.msg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined})
            setTimeout(() => {
                window.location.reload()
            }, 500)
        })
    }
    function registerRedirect(){
        window.location = "/admin/register"
    }
    return(
        
        <div className={styles.screen1} style={{fontFamily: "Poppins"}}>
            <img className={styles.logo} src={"/logo_login.png"}></img>
        <div className={styles.email} id="emailContainer">
          <div className={styles.sec2}>
            <ion-icon name="mail-outline" />
            <input type="email" name="email" id="username" placeholder="Usuario" />
          </div>
        </div>
        <div className={styles.password} id="passwordContainer">
          <div className={styles.sec2}>
            <ion-icon name="lock-closed-outline" />
            <input className={styles.pas} type="password" id="pass" name="password" placeholder="Contraseña" />
            <ion-icon className={styles.showHide} name="eye-outline" />
          </div>
        </div>
        <button className={styles.login} onClick={loginOW}>Iniciar sesión</button>
        <p onClick={registerRedirect} style={{cursor: "pointer"}}>Registrarse</p>
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