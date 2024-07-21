import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Main from "./components/main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProtect } from "./AuthProtect";
import Home from "./components/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthProtect element={<Login />} />} />
        <Route path="/signup" element={<AuthProtect element={<Signup />} />} />

        <Route path="/home" element={<Main />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
