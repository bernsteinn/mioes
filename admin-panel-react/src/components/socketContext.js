import socketio from "socket.io-client";
import React from "react";

export const socket = socketio.connect("https://api.mioes.app");
export const SocketContext = React.createContext();