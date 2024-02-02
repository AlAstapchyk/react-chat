import "./App.css";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ChatApp from "./pages/ChatApp/ChatApp";

function App() {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
