import {React, useEffect, useState} from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import useInterval from './useInterval';
import { io } from 'socket.io-client'
import Demo from './SetUpAccount';
import { StyledEngineProvider } from '@mui/material/styles';

const Sidebar = ({element}) => {
  const [setup, setupIsPending] = useState(false)
  useEffect(() => {
    if (localStorage.getItem("hasToCompleteSetUp") == "true"){setupIsPending(true)}
  }, [])
    useInterval(() => { 
        fetch("/session", {credentials: 'include'}).then(response => response.json()).then((data) => {
            if(data.loggedin != true){
                window.location = "/admin"
              return
            }
            return  
        })
    }, 30000);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <script type="text/javascript" src="https://mioes.app/scripts/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://mioes.app/styles/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="https://mioes.app/styles/style.css" />
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i,900,900i|Source+Sans+Pro:300,300i,400,400i,600,600i,700,700i,900,900i&display=swap" rel="stylesheet" />
    <script type="text/javascript" src="https://mioes.app/scripts/custom.js"></script>

      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            MIOES
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/admin/dashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Tablero</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/social" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Social</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/config" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="cog">Configuración</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/manage" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="list">Gestionar menú</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/admin/profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="pager">Gestionar perfil</CDBSidebarMenuItem>
            </NavLink>

          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
      {setup != false ?<StyledEngineProvider injectFirst><Demo/></StyledEngineProvider>: element}
    </div>
  );
};

export default Sidebar;