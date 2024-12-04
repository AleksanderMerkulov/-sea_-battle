import './App.css';
import {useSocket} from "./context/SocketContext";
import Login from "./pages/Login";
import SetShips from "./pages/SetShips";

function App() {

    const {currentPage} = useSocket()

    if (currentPage === 'login') return <Login/>
    if (currentPage === 'home') return <Login/>
    if (currentPage === 'set_ships') return <SetShips/>

}

export default App;
