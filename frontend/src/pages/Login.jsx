import React, {useState} from 'react';
import {useSocket} from "../context/SocketContext";

function Login(props) {

    const [username, setUsername] = useState('')
    const {sendMessage} = useSocket()

    function handleSubmit(e){
        e.preventDefault()
        sendMessage('Login', {name:username})
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Авторизация</h1>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <button type={"submit"}>Войти</button>
        </form>
    );
}

export default Login;