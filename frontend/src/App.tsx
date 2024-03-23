import {HashRouter, Route, Routes} from "react-router-dom";
import './App.css'
import Home from "pages/Student/Home/Home.tsx";
import Layout from "layouts/Layout.tsx";
import Login from "pages/Login/Login.tsx";
import Reset from "pages/Login/Reset.tsx";
import Configuration from "pages/Configuration/Configuration.tsx";

function App() {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Login/>}></Route>
                    <Route path="/reset" element={<Reset/>}></Route>
                    <Route element={<Layout/>}>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/config" element={<Configuration/>}/>
                    </Route>
                </Routes>
            </HashRouter>
        </>

    )
}

export default App
