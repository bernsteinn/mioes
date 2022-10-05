import Login from "./LoginScreen"
import Modal from './Modal'
import Sidebar from "./Sidebar"
import Spinner from "./Spinner"
import useInterval from './useInterval'
import {SocketContext, socket} from './socketContext';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import SetUpAccount from "./SetUpAccount"
export default function Dashboard(){
    const socket = useContext(SocketContext)
    const [isSocketConnected, setSocketConnected] = useState(socket.connected)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [loading, setLoading] = useState(true)
    const [liveJobs, setLiveJobs] = useState(0)
    useEffect(() => {
        socket.emit("updateMe")
        }, [])
    socket.on("update", (jobs) => {
        setLiveJobs(jobs.liveJobs)
        setLoading(false)
    })
    return(<>
<SocketContext.Provider value={socket}>
    {loading == false ? <Sidebar element={<div className="liveJobsToDo"><p>{liveJobs}</p></div>}></Sidebar>:null}
</SocketContext.Provider>
    </>)
}