import React, {useState} from 'react';
import {useSocket} from "../context/SocketContext";

function Login(props) {

    const [username, setUsername] = useState('')
    const [isSuccessLogin, setIsSuccessLogin] = useState('')
    const {sendMessage, setCurrentPage, waitMessage} = useSocket(false)

    function handleLogin(){
        setIsSuccessLogin(true)
        setCurrentPage('set_ships')
        alert('success')
    }

    function handleSubmit(e){
        e.preventDefault()
        try{
            sendMessage('Login', {name:username})
            waitMessage('login response', handleLogin)
        }catch (e) {
            alert('Ошибка авторизации')
        }
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