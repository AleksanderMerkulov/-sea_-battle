import React, {useState} from 'react';
import './SetShips.css';
import {useSocket} from "../context/SocketContext";
import styled from "styled-components"; // Импортируем стили для игрового поля

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: url('/29119091_Comic.jpg') no-repeat;
  background-size: cover;
`

const Container = styled.section`
  width: 50%;
  margin: 0 auto;

  padding: 30px;
  background: rgba(255, 255, 255, 0.7);

`

const Button = styled.button`
  font-size: 24px;
  width: 50%;
  background: white;
  font-weight: bold;
  
`

const Title = styled.h1`
  color: #282c34;
  font-size: 36px;
`

const ControlContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`

const ControlButton = styled.button`
  border: 3px solid #282c34;
  border-radius: 4px;
  background: white;

  &.active {
    background: #4caf50;
    border-color: #0f7013;
  }
  
  &.switcher{
    background: #a4d0a7;
  }
`

const SetShips = () => {
    const {sendMessage, waitMessage, setCurrentPage, setGameCardContext} = useSocket()
    const [gameCard, setGameCard] = useState({
        4: [],
        3: [],
        2: [],
        1: [],
    });
    const [selectedShipLength, setSelectedShipLength] = useState(null);
    const [isPlacing, setIsPlacing] = useState(false);
    const [isVertical, setIsVertical] = useState(true); // Состояние для направления
    const [activeBtn, setActiveBtn] = useState(0); // Состояние для направления
    const [waiting, setWaiting] = useState(false); // Состояние для направления

    // Определяем доступные корабли
    const availableShips = {
        4: 1,
        3: 2,
        2: 3,
        1: 4,
    };

    const handlePlaceShip = (length, start, end) => {
        if (isPlacementValid(length, start, end)) {
            setGameCard((prev) => ({
                ...prev,
                [length]: [...prev[length], {start, end}],
            }));
            setIsPlacing(false);
            setSelectedShipLength(null);
        } else {
            alert('Invalid placement!');
        }
        setActiveBtn(0)
    };

    const isPlacementValid = (length, start, end) => {
        // Проверка, что количество размещенных кораблей не превышает доступное
        if (gameCard[length].length >= availableShips[length]) {
            alert(`You can only place ${availableShips[length]} ships of length ${length}.`);
            return false;
        }

        // Логика проверки допустимости размещения корабля
        if (isVertical) {
            if (end.y >= 10) {
                return false; // Корабль выходит за границы поля
            }
        } else {
            if (end.x >= 10) {
                return false; // Корабль выходит за границы поля
            }
        }

        // Проверка на пересечение с другими кораблями
        for (const l in gameCard) {
            for (const ship of gameCard[l]) {
                const shipStart = ship.start;
                const shipEnd = ship.end;

                // Проверка на вертикальное размещение
                if (isVertical) {
                    // Если корабли в одной колонне
                    if (shipStart.x === start.x) {
                        // Проверка пересечения по вертикали
                        if (start.y <= shipEnd.y && end.y >= shipStart.y) {
                            return false; // Пересечение с другим вертикальным кораблем
                        }
                    }
                } else { // Проверка на горизонтальное размещение
                    // Если корабли в одной строке
                    if (shipStart.y === start.y) {
                        // Проверка пересечения по горизонтали
                        if (start.x <= shipEnd.x && end.x >= shipStart.x) {
                            return false; // Пересечение с другим горизонтальным кораблем
                        }
                    }
                }

                // Проверка пересечения вертикального и горизонтального корабля
                if (isVertical) {
                    // Если текущий корабль вертикальный и проверяемый горизонтальный
                    if (shipStart.x <= start.x && shipEnd.x >= start.x && // Проверка по x
                        start.y <= shipEnd.y && end.y >= shipStart.y) { // Проверка по y
                        return false; // Пересечение
                    }
                } else {
                    // Если текущий корабль горизонтальный и проверяемый вертикальный
                    if (shipStart.y <= start.y && shipEnd.y >= start.y && // Проверка по y
                        start.x <= shipEnd.x && end.x >= shipStart.x) { // Проверка по x
                        return false; // Пересечение
                    }
                }
            }
        }

        return true; // Размещение допустимо
    };


    const handleCellClick = (x, y) => {
        if (isPlacing && selectedShipLength) {
            const start = {x, y};
            const end = isVertical
                ? {x, y: y + selectedShipLength - 1} // Вертикальное размещение
                : {x: x + selectedShipLength - 1, y}; // Горизонтальное размещение
            handlePlaceShip(selectedShipLength, start, end);
        }
    };

    const handleShipSelect = (length) => {
        setSelectedShipLength(length);
        setIsPlacing(true);
    };

    const toggleDirection = () => {
        setIsVertical((prev) => !prev); // Переключаем направление
    };

    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < 10; y++) {
            const row = [];
            for (let x = 0; x < 10; x++) {
                row.push(
                    <div
                        key={`${x}-${y}`}
                        className="cell"
                        onClick={() => handleCellClick(x, y)}
                    >
                        {renderCellContent(x, y)}
                    </div>
                );
            }
            grid.push(<div key={y} className="row">{row}</div>);
        }
        return grid;
    };

    const renderCellContent = (x, y) => {
        // Проверяем, есть ли корабль в данной клетке
        for (const length in gameCard) {
            for (const ship of gameCard[length]) {
                if (
                    (ship.start.x === x && ship.start.y <= y && ship.end.y >= y) ||
                    (ship.start.y === y && ship.start.x <= x && ship.end.x >= x)
                ) {
                    return <div className="cell ship">🚢</div>; // Отображаем корабль
                }
            }
        }
        return '';
    };

    // Функция ожидания ответа от сервера, что соперник готов
    function handleWaitMessage() {
        // setWaiting(false)
        setGameCardContext(gameCard)
        alert('Opponent is ready! Lets was')
        setCurrentPage('game')
    }

    // Функция отправки готовности на сервер
    function handleReady() {
        setWaiting(true)
        console.dir(gameCard)
        sendMessage('Ready', gameCard)
        waitMessage('OpponentIsReady', handleWaitMessage)
    }

    return (
        <Wrapper>
            <Container>
                {!waiting ? <>
                        <Title>Расставь свои корабли</Title>
                        <ControlContainer>
                            <ControlButton className={activeBtn === 4 ? 'active' : ''} onClick={() => {
                                setActiveBtn(4)
                                handleShipSelect(4);
                            }}>Четырёхпалубный корабль
                            </ControlButton>
                            <ControlButton className={activeBtn === 3 ? 'active' : ''} onClick={() => {
                                setActiveBtn(3)
                                handleShipSelect(3);
                            }}>Трёхпалубный корабль
                            </ControlButton>
                            <ControlButton className={activeBtn === 2 ? 'active' : ''} onClick={() => {
                                setActiveBtn(2)
                                handleShipSelect(2);
                            }}>Двухпалубный корабль
                            </ControlButton>
                            <ControlButton className={activeBtn === 1 ? 'active' : ''} onClick={() => {
                                setActiveBtn(1)
                                handleShipSelect(1);
                            }}>Однопалубный корабль
                            </ControlButton>
                            <ControlButton onClick={toggleDirection} className={'switcher'}>
                                {isVertical ? 'Поставить горизонтально' : 'Поставить вертикально'}
                                {isVertical ? <span>&rarr;</span> : <span>&darr;</span>}
                            </ControlButton>
                        </ControlContainer>
                    </>
                    :
                    <h1>Ожидание соперника</h1>}
                <div className="grid">
                    {renderGrid()}
                </div>
                <div>

                    {(gameCard[1].length + gameCard[2].length + gameCard[3].length + gameCard[4].length === 10 && !waiting) ?
                        <Button className={'ready'} onClick={handleReady}>I'm ready</Button> : null
                    }
                </div>
            </Container>
        </Wrapper>
    );
};

export default SetShips;

