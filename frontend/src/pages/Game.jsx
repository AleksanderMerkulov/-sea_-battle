import React, { useState, useEffect } from 'react';
import './Game.css'; // Добавь стили для полей и клеток
import {useSocket} from "../context/SocketContext";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: url('/29119091_Comic.jpg') no-repeat;
  background-size: cover;
`

const Container = styled.section`
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);

`

const Title = styled.h3`
  font-size: 24px;
`

const WaitOpponent = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const WaitMessage = styled.div`
  padding: 20px;
  font-size: 32px;
  color: white;
  background: #9a4c4c;
  
`

function areAllShipsSunk(gameCard, fieldHits) {
    // Перебираем все корабли в gameCard
    for (const length in gameCard) {
        for (const ship of gameCard[length]) {
            // Проверяем, покрыты ли все клетки корабля попаданиями
            for (let x = ship.start.x; x <= ship.end.x; x++) {
                for (let y = ship.start.y; y <= ship.end.y; y++) {
                    const isHit = fieldHits.some(hit => hit.x === x && hit.y === y && hit.isHit);
                    if (!isHit) {
                        // Если хотя бы одна клетка корабля не подбита
                        return false;
                    }
                }
            }
        }
    }

    // Если все клетки всех кораблей подбиты
    return true;
}

const Game = () => {
    const [myFieldHits, setMyFieldHits] = useState([]); // Удары по моему полю
    const [enemyFieldHits, setEnemyFieldHits] = useState([]); // Удары по полю соперника
    const [isMyStep, setIsMyStep] = useState(true); // Удары по полю соперника

    const {gameCardContext, sendMessage, waitMessage} = useSocket()

    const gameCard = gameCardContext

    // Слушаем события от сервера
    useEffect(() => {
        //я стреляю
        waitMessage('hit', ({ x, y, isHit }) => {
            setEnemyFieldHits(prev => [...prev, { x, y, isHit }]);

            console.log('hit', isHit)
            const result = areAllShipsSunk(gameCard, enemyFieldHits)
            console.log(result)
            if (result){
                alert('Игра окончена. Вы выиграли!')
                sendMessage('GameOver', {})
            }
        });

        //выстрел по мне
        waitMessage('enemyHit', ({ x, y }) => {
            setMyFieldHits(prev => [...prev, { x, y }]);
            console.log('shoot to me')
        });

    }, []);

    useEffect(()=>{
        setIsMyStep(true)
    }, [myFieldHits])

    // Отображение содержимого клетки
    const renderCellContent = (x, y, fieldHits, isMyField) => {
        // Проверяем, есть ли информация о попадании или выстреле
        const hitInfo = fieldHits.find(hit => hit.x === x && hit.y === y);

        // Показываем корабли только на своём поле
        if (isMyField) {
            for (const length in gameCard) {
                for (const ship of gameCard[length]) {
                    const isPartOfShip =
                        (ship.start.x === x && ship.start.y <= y && ship.end.y >= y) || // Вертикальный корабль
                        (ship.start.y === y && ship.start.x <= x && ship.end.x >= x);   // Горизонтальный корабль

                    // Если клетка является частью корабля
                    if (isPartOfShip) {
                        const wasHit = myFieldHits.some(hit => hit.x === x && hit.y === y && hit.isHit);

                        // Если корабль был атакован и повреждён
                        if (wasHit) {
                            return <div className="cell ship hit">🚢</div>;
                        }

                        // Корабль без повреждений
                        return <div className="cell ship">🚢</div>;
                    }
                }
            }
        }

        // Если попадание по клетке
        if (hitInfo && hitInfo.isHit) {
            return <div className="cell ship hit">🚢</div>;
        }

        // Если стреляли, но не попали
        if (hitInfo && !hitInfo.isHit) {
            return <div className="cell shot"></div>;
        }



        // Пустая клетка
        return '';
    };



    // Рендер игрового поля
    const renderGrid = (fieldHits, isMyField) => {
        const grid = [];
        for (let y = 0; y < 10; y++) {
            const row = [];
            for (let x = 0; x < 10; x++) {
                row.push(
                    <div
                        key={`${x}-${y}`}
                        className={`cell ${fieldHits.some(hit => hit.x === x && hit.y === y) ? 'hit' : ''}`}
                        onClick={!isMyField ? () => handleCellClick(x, y) : null}
                    >
                        {renderCellContent(x, y, fieldHits, isMyField)}
                    </div>
                );
            }
            grid.push(<div key={y} className="row">{row}</div>);
        }
        return grid;
    };

    // Обработка клика по полю соперника
    const handleCellClick = (x, y) => {
        sendMessage('shoot', {x, y});
        console.log('shoot', {x,y})// Отправка координат на сервер
        setIsMyStep(false)
    };


    return (
        <Wrapper>
            {isMyStep? null :
                <WaitOpponent>
                    <WaitMessage>Ожидайте хода противника</WaitMessage>
                </WaitOpponent>
            }
            <Container className="game">
                <div className="field">
                    <Title>Моё поле</Title>
                    {renderGrid(myFieldHits, true)}
                </div>
                <div className="field">
                    <Title>Поле соперника</Title>
                    {renderGrid(enemyFieldHits, false)}
                </div>
            </Container>
        </Wrapper>
    );
};

export default Game;
