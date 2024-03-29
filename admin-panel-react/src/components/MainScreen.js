import Dashboard from "./Dashboard"
import { useState, useEffect} from "react"
import Login from "./LoginScreen"
import Spinner from "./Spinner"
import {SocketContext, socket} from "./socketContext"
import SetUpAccount from "./SetUpAccount"


export default function MainScreen(){
    const [loggedIn, setLoggedin] = useState()
    const [loading, setLoading] = useState(true)
  
  
    useEffect(() => {
      fetch("/session", {credentials: 'include'}).then(response => response.json()).then((data) => {
        if(data.loggedin != true){
          setTimeout(() => {
            setLoggedin(false)
            setLoading(false)
  
          }, 1500)  
            return
        }
        setTimeout(() => {
          setLoggedin(true)
          setLoading(false)

        }, 1500)  
      })  
    }, [])  
    return(
    <div>  
    <SocketContext.Provider value={socket}>
    {loading == false ? loggedIn == true && loading == false ? <Dashboard/> : window.location = "/" : <Spinner/>}
    </SocketContext.Provider>
    </div>

    )
}