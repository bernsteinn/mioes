import '../index.css'
import {React, useEffect, useState, useContext} from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, Link} from 'react-router-dom';
import useInterval from './useInterval';
import { io } from 'socket.io-client'
import Demo from './SetUpAccount';
import { StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { SocketContext, socket } from './socketContext';

const Sidebar = ({element}) => {
  const socket = useContext(SocketContext)
  const [setup, setupIsPending] = useState(false)
  const [img, setProfilePic] = useState()
  const [name, setName] = useState()
  const [user, setUser] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [fileType, setFileType] = useState()
  const [selectedOption, setSelectedOption] = useState("img")
  useEffect(() => {
    if (!selectedFile) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [selectedFile])
  const newPost = () => {
    if(fileType == "img"){
    const form = new FormData()
    const file = document.getElementById("postImage").files[0]
    const checkImg = () => {try{if(selectedFile['type'].includes('image')) return true}catch{return false}}
    if(!checkImg() || selectedFile == undefined){
        document.getElementById("img-error").style.color = "red"
        document.getElementById("img-error").innerText = "Porfavor, sube una imagen."
        return
    }
    if(!['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'].includes(file.type)){
        document.getElementById("img-error").style.color = "red"
        document.getElementById("img-error").innerText = "Porfavor, sube una imagen."
        return;
    }
    if(file.size / 1024 / 1024 > 5) {
      document.getElementById("img-error").style.color = "red"
      document.getElementById("img-error").innerText = "La imagen no puede pesar más de 5MB."
      return;
    }
    form.append('postImage', file)
    form.append("video", false)
    form.append('title', document.getElementById("title").value)
    form.append('msg', document.getElementById("msg").value)
    fetch("/newpost", {
        method: 'POST',
        credentials: 'include',
        body: form
    }).then(response => response.json()).then((data) => {
        if(data.status == true){
          toast.success("Publicación publicada con éxito")  
          return
        }
        toast.error(data.msg)
        
    })
  }
  if(fileType == "video"){
    const form = new FormData()
    const file = document.getElementById("postVid").files[0]
    const checkImg = () => {try{if(selectedFile['type'].includes('video')) return true}catch{return false}}
    if(!checkImg() || selectedFile == undefined){
        document.getElementById("vid-error").style.color = "red"
        document.getElementById("vid-error").innerText = "Porfavor, sube un video."
        return
    }
    if(!['video/mp4', 'video/mpg', 'video/avi', 'video/m4v'].includes(file.type)){
        document.getElementById("vid-error").style.color = "red"
        document.getElementById("vid-error").innerText = "Porfavor, sube un video en formato mp4."
        return;
    }
    if(file.size / 1024 / 1024 > 50) {
      document.getElementById("vid-error").style.color = "red"
      document.getElementById("vid-error").innerText = "El video no puede pesar más de 50MB."
      return;
    }
    form.append('postVideo', file)
    form.append('video', true)
    form.append('title', document.getElementById("title").value)
    form.append('msg', document.getElementById("msg").value)
    const id = toast.loading("Procesando video...")
    fetch("/newpost", {
        method: 'POST',
        credentials: 'include',
        body: form
    }).then(response => response.json()).then((data) => {
        if(data.status == true){
            socket.on("update", (data) => {
              if(data.status != false && data.progress == 100){
              toast.update(id, { render: "Hecho!", type: "success", isLoading: false });
              setTimeout(() => {
                toast.dismiss(id)
              }, 3000)
            }
            else{
              toast.update(id, { render: "Algo ha ido mal, vuelvelo a intentar más tarde", type: "error", isLoading: false });
              setTimeout(() => {
                toast.dismiss(id)
              }, 3000)
            }
            })      
          
            return
        }
        toast.update(id, { render: "Algo ha ido mal, vuelvelo a intentar más tarde", type: "error", isLoading: false });
        
    })
  }
}
const newCategory = () => {

}
const onSelectFile = (e) => {
  if (!e.target.files || e.target.files.length === 0) {
    setSelectedFile(undefined)
    return
}
setSelectedFile(e.target.files[0])

}
  useEffect(() => {
    document.querySelector(".logout").addEventListener("click", () => {
      window.location = "/admin/session/logout"
    })
    if (localStorage.getItem("hasToCompleteSetUp") == "true"){setupIsPending(true)}
  fetch("/session", {credentials: 'include'}).then(response => response.json()).then((data) => {
    if(data.loggedin != true){
        window.location = "/admin"
      return
    }
    setProfilePic(data.img)
    setUser(data.user)
    setName(data.name)
    return  
  })
  document.addEventListener('DOMContentLoaded', function () {
    var modeSwitch = document.querySelector('.mode-switch');
  
    modeSwitch.addEventListener('click', function () {                     
      document.documentElement.classList.toggle('dark');
      modeSwitch.classList.toggle('active');
    });
    
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');
    
    listView.addEventListener('click', function () {
      gridView.classList.remove('active');
      listView.classList.add('active');
      projectsList.classList.remove('jsGridView');
      projectsList.classList.add('jsListView');
    });
    
    gridView.addEventListener('click', function () {
      gridView.classList.add('active');
      listView.classList.remove('active');
      projectsList.classList.remove('jsListView');
      projectsList.classList.add('jsGridView');
    });
    
    document.querySelector('.messages-btn').addEventListener('click', function () {
      document.querySelector('.messages-section').classList.add('show');
    });
    
    document.querySelector('.messages-close').addEventListener('click', function() {
      document.querySelector('.messages-section').classList.remove('show');
    });
  });
  var menuOpen = document.querySelectorAll('[data-menu]');
  var wrappers = document.querySelectorAll('.header, #footer-bar, .page-content');

  menuOpen.forEach(el => el.addEventListener('click',e =>{
      //Close Existing Opened Menus
      const activeMenu = document.querySelectorAll('.menu-active');
      for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
      //Open Clicked Menu
      var menuData = el.getAttribute('data-menu');
      document.getElementById(menuData).classList.add('menu-active');
      document.getElementById(menuData).style.display = "block"
      document.getElementsByClassName('menu-hider')[0].classList.add('menu-active');
      //Check and Apply Effects
      var menu = document.getElementById(menuData);
      var menuEffect = menu.getAttribute('data-menu-effect');
      var menuLeft = menu.classList.contains('menu-box-left');
      var menuRight = menu.classList.contains('menu-box-right');
      var menuTop = menu.classList.contains('menu-box-top');
      var menuBottom = menu.classList.contains('menu-box-bottom');
      var menuWidth = menu.offsetWidth;
      var menuHeight = menu.offsetHeight;

      if(menuEffect === "menu-push"){
          var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
          if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth+"px)"}}
          if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth+"px)"}}
          if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight+"px)"}}
          if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight+"px)"}}
      }
      if(menuEffect === "menu-parallax"){
          var menuWidth = document.getElementById(menuData).getAttribute('data-menu-width');
          if(menuLeft){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX("+menuWidth/10+"px)"}}
          if(menuRight){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+menuWidth/10+"px)"}}
          if(menuBottom){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY(-"+menuHeight/5+"px)"}}
          if(menuTop){for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateY("+menuHeight/5+"px)"}}
      }
  }));

  //Closing Menus
  const menuClose = document.querySelectorAll('.close-menu, .menu-hider');
  menuClose.forEach(el => el.addEventListener('click',e =>{
      const activeMenu = document.querySelectorAll('.menu-active');
      for(let i=0; i < activeMenu.length; i++){activeMenu[i].classList.remove('menu-active');}
      //for(let i=0; i < wrappers.length; i++){wrappers[i].style.transform = "translateX(-"+0+"px)"}
      var iframes = document.querySelectorAll('iframe');
      iframes.forEach(el => {var hrefer = el.getAttribute('src'); el.setAttribute('newSrc', hrefer); el.setAttribute('src',''); var newSrc = el.getAttribute('newSrc');el.setAttribute('src', newSrc)});
  }));
  
}, [])

    useInterval(() => { 
        fetch("/session", {credentials: 'include'}).then(response => response.json()).then((data) => {
            if(data.loggedin != true){
                sessionStorage.clear()
                window.location = "/"
              return
            }
            return  
        })
    }, 30000);

    useEffect(() => {
      var currentPage = window.location.pathname
      if(currentPage == "/admin/profile"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("profile").classList.add("active")  
      }
      if(currentPage == "/admin/manage"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("menu").classList.add("active")  
      }
      if(currentPage == "/admin/config"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("settings").classList.add("active")  
      }
      if(currentPage == "/admin/"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("home").classList.add("active")  
      }
      if(currentPage == "/admin/qrcode"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("qrcode").classList.add("active")  
      }
      if(currentPage == "/admin/premium"){
        var links = document.querySelectorAll(".app-sidebar-link")
        links.forEach((lik) => {
            lik.classList.remove("active")
        })  
        document.getElementById("premium").classList.add("active")  
      }


      }, [])
      useEffect(() => {
        console.log(fileType)
      }, [fileType])
  return (
    <SocketContext.Provider value={socket}>
    <div>
      <ToastContainer></ToastContainer>
      <style dangerouslySetInnerHTML={{__html: "\n      body{font-family: 'DM Sans', sans-serif;}\n\n      " }} />
            <div class="menu-hider"></div>
            <div class="page-content" style={{margin: '0', padding: '0'}}></div>
            <div id="menu-modal-newpost" className="menu menu-box-modal menu-box-detached" style={{padding: "15px", maxHeight: '100000px'}}>
    <div className="menu-title"><h1>Nueva publicación</h1><a href="#" className="close-menu"><i className="fa fa-times" /></a></div>
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
        <input id="msg"placeholder="Tu mensaje..." className="form-control validate-text"/>
        <label htmlFor="msg" className="color-highlight">Texto para tu publicación</label>
        <em className="mt-n3">(obligatorio)</em>
      </div>
      <div className="input-style has-borders no-icon validate-field mb-4">
      <div>
        <h4>Subir una imagen o un video</h4>
        <p>
          <p>Selecciona una opción</p>
          <select onChange={(e) => setFileType(e.target.value)}>
            <option value={"video"} >Video</option>
            <option value={"img"} >Imagen</option>
          </select>
        </p>
        {fileType == 'img' ? 
        <div className="file-data pb-5" style={{paddingBottom: '0', marginBottom: "-14%"}}>
          <img id="file-chosen" src={preview} style={{width: "100px", padding: "10px",marginTop: '5%'}}></img>
          <p id="img-error"></p>
          <input type="file" id="postImage" className="upload-file bg-highlight shadow-s rounded-s " onChange={onSelectFile} accept="image/*" />
          <p className="upload-file-text color-white" style={{cursor: "pointer"}}>Subir imagen</p>
        </div>
        : null}
        {fileType == 'video' ? 
        <div className="file-data pb-5" style={{paddingBottom: '0', marginBottom: "-14%"}}>
          <p id="vid-error"></p>
          <input type="file" id="postVid" className="upload-file bg-highlight shadow-s rounded-s " onChange={onSelectFile} accept="video/*" />
          <p className="upload-file-text color-white" style={{cursor: "pointer"}}>Subir video</p>
        </div>
        : null}
      </div>
      </div>
      <a href="#" onClick={newPost} className="close-menu btn btn-m rounded-sm mt-4 mb-4 btn-full bg-green-dark text-uppercase font-900" style={{height: '53px'}}>Crear Publicación</a>
    </div>
            <script type="text/javascript" src="https://mioes.app/scripts/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://mioes.app/styles/bootstrap.css" />

    <link rel="stylesheet" type="text/css" href="https://mioes.app/styles/style.css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i|Source+Sans+Pro:300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet" />
    <script type="text/javascript" src="https://mioes.app/scripts/custom.js"></script>

    <div className="app-container">
      <div className="app-header">
        <div className="app-header-left">
          <span><img src="/app/icons/icon-128x128.png" style={{width: '30px', height: '30px'}}/></span>
          <p className="app-name">{name}</p>
          <div className="search-wrapper">
            <input className="search-input" type="text" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="feather feather-search" viewBox="0 0 24 24">
              <defs />
              <circle cx={11} cy={11} r={8} />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
        <div className="app-header-right">
        <button className="add-btn" title="Adquirir pegatinas" style={{borderRadius: '10px', width: '150px', fontWeight: '750'}} onClick={() => {window.open("https://forms.gle/njVBVjHSThnmgGxG7",'_blank').focus();}}>
        Adquirir pegatinas
        </button>
          <button className="add-btn" title="New post" data-menu="menu-modal-newpost">
          <i class="fas fa-plus"></i>
          </button>
          <button className="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          </button>
          <button className="profile-btn">
            <img src={img} />
            <span>{user}</span>
          </button>
          <button className="logout" title="Cerrar sesión">
            <i class="fas fa-sign-out"></i>
          </button>
        </div>
        <button className="messages-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        </button>
      </div>
      <div className="app-content">
        <div className="app-sidebar">
          <Link to="/admin/" className="app-sidebar-link active" id="home" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" /></svg>
          </Link>
          <Link to="/admin/profile" className="app-sidebar-link" id="profile" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")

          }}>
            <i class="fas fa-digital-tachograph" style={{fontSize: "18px"}}></i>
          </Link>
          <Link to="/admin/manage" className="app-sidebar-link" id="menu" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
              <rect x={3} y={4} width={18} height={18} rx={2} ry={2} />
              <line x1={16} y1={2} x2={16} y2={6} />
              <line x1={8} y1={2} x2={8} y2={6} />
              <line x1={3} y1={10} x2={21} y2={10} /></svg>
          </Link>
          <Link to="/admin/config" className="app-sidebar-link" id="settings" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")
          }}>
            <svg className="link-icon" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24">
              <defs />
              <circle cx={12} cy={12} r={3} />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>
          <Link to="/admin/qrcode" className="app-sidebar-link" id="qrcode" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")
          }}>
            <i class="fas fa-qrcode" style={{fontSize: '18px'}}></i>
          </Link>
          <Link to="/admin/premium" className="app-sidebar-link" id="premium" onClick={(e) => {
            var links = document.querySelectorAll(".app-sidebar-link")
            links.forEach((lik) => {
              lik.classList.remove("active")
            })
            var id = e.currentTarget.id
            document.getElementById(id).classList.add("active")
          }}>
            <i class="fas fa-gem" style={{fontSize: '18px'}}></i>
          </Link>
        </div>
      <div class="projects-section" style={{overflow: 'auto'}}>
        {setup != false ?<StyledEngineProvider injectFirst><Demo/></StyledEngineProvider>: element}
      </div>
      </div>
    </div>
    </div>
    </SocketContext.Provider>
  );
};

export default Sidebar;