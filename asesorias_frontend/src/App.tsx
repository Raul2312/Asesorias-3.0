import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import CatalogoMaterias from "./views/CatalogosMaterias";
import Temas from "./views/Temas";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Login */}
        <Route path="/" element={<Login />} />
       
        <Route path="/materias" element={<CatalogoMaterias />} />
        <Route path="/materia/:id" element={<Home />} />
        <Route path="/materia/:id/unidad/:unidadId" element={<Temas />} />
        <Route path="*" element={<Navigate to="/" />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;