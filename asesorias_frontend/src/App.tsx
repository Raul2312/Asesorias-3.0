import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Login */}
        <Route path="/" element={<Login />} />

        {/* 🔁 Redirección por si entran a otra ruta */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;