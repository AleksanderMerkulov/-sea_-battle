import './App.css';
import {useSocket} from "./context/SocketContext";
import Login from "./pages/Login";

function App() {

    const {connected} = useSocket()

    return (
        <>
            <h1>hello</h1>
            <Login/>
        </>
    );
}

export default App;
