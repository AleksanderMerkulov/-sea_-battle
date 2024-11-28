import React, { createContext, useContext, useEffect, useState } from 'react';
import socketIO from 'socket.io-client';

const SocketContext = createContext();

const socket = socketIO('http://localhost:4000');

export const SocketProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [socketObj, setSocketObj] = useState({})



    useEffect(() => {

        setSocketObj(socket)

        socket.on('connect', () => {
            setConnected(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            setConnected(false);
            console.log('Disconnected from server');
        });

    }, []);

    function sendMessage(message='', body) {
        socket.emit(message, body)
    }

    return (
        <SocketContext.Provider value={{ socket, connected, sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
