import './App.css';
import React from 'react';
import MainScreen from './components/MainScreen';
import Login from './components/LoginScreen'
import { useState, useEffect} from 'react';
import Spinner from './components/Spinner';
import { BrowserRouter as Router, createBrowserRouter, RouterProvider} from 'react-router-dom'
import ConfigPage from './components/Config';
import SocialMedia from './components/SocialMedia';
import Dashboard from './components/Dashboard';
import ManageMenu from './components/ManageMenu';
import { io } from 'socket.io-client'
import {SocketContext, socket} from "./components/socketContext"
import Error from './components/Error'
import Register from './components/Register';
import SetUpAccount from './components/SetUpAccount.js'
import CreateRestaurantProfile from './components/CreateRestaurantProfile';
function App() {
    const router = createBrowserRouter([
      {
        path: "/admin/config",
        element: <ConfigPage/>,
      },
      {
        path: "/admin/manage",
        element: <ManageMenu/>,
      },
      {
        path: "/admin/dashboard",
        element:<Dashboard/>},
      {
        path: "/admin/social",
        element: <SocialMedia/>,
      },

      {
        path: "/admin",
        element: <MainScreen/>
      },
      {
        path: "/admin/register",
        element: <Register/>
      },
      {
        path: "/admin/login",
        element: <MainScreen/>
      },
      {
        path: "/admin/setupaccount",
        element: <SetUpAccount/>
      },
      {
        path: "/admin/profile",
        element: <CreateRestaurantProfile/>
      }
    ]);
  return (
    <SocketContext.Provider value={socket}>
        <RouterProvider router={router} errorElement={Error}></RouterProvider>
    </SocketContext.Provider>
  );
}

export default App;
