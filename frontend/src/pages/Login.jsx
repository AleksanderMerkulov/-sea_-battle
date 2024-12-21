import React, {useState} from 'react';
import {useSocket} from "../context/SocketContext";
import styled from "styled-components";

// import logo from '/logo192.png'

const Form = styled.form`
  width: 40%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  padding: 30px;
  background: rgba(255, 255, 255, 0.7);
`

const Title = styled.h1`
  text-align: center;
  font-size: 48px;
  color: #282c34;
`

const Input = styled.input`
  border: 3px solid #282c34;
  background: white;
  color: #282c34;
  
  font-size: 24px;
  padding: 10px;
  
`

const Button = styled.button`
  font-size: 24px;
  width: 50%;
  background: white;
  font-weight: bold;
  
`

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: url('/29119091_Comic.jpg') no-repeat;
  //background: url('/sea_battle.png') no-repeat;
  background-size: cover;
`

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
        <Container>
            <Form onSubmit={handleSubmit}>
                <Title>Авторизация</Title>
                <Input type="text"
                       placeholder={'Введите ваш ник'}
                       value={username}
                       onChange={(e)=>setUsername(e.target.value)}/>
                <Button type={"submit"}>Войти</Button>
            </Form>
        </Container>

    );
}

export default Login;