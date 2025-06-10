import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import StartScreen from "./pages/StartScreen";
import ChatScreen from "./pages/ChatScreen";
import HistorialDocumentos from "./pages/HistorialDocumentos";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/start-screen" element={<StartScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/historial" element={<HistorialDocumentos />} />

  
        {/* Aquí irán otras rutas como Login, Register, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
