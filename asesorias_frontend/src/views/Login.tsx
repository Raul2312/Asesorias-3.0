import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, ChevronDown, LogOut, Plus, 
  Edit3, Trash2, GraduationCap, ShieldCheck 
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [materias, setMaterias] = useState<any[]>([]);

  // Estado con todos los campos necesarios para evitar el error 422
  const [form, setForm] = useState({
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    email: "",
    password: "",
    nivel: "alumno",
    pin_docente: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- LÓGICA DE AUTENTICACIÓN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email: form.email,
        password: form.password
      });
      
      // GUARDADO DE DATOS CRUCIALES
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user_nivel", res.data.data.user.nivel); // <-- Esto activa las funciones de docente
      localStorage.setItem("user_id", res.data.data.user.id);
      setUser(res.data.data.user);
      setIsLogged(true);
      navigate("/materias");
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register", form);
      alert("Usuario registrado correctamente");
      setIsRegister(false);
    } catch (err: any) {
      console.error("Detalle del error:", err.response?.data);
      alert("Error al registrar. Revisa la consola para más detalles.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_nivel"); // <-- Limpiamos el nivel al salir
    setIsLogged(false);
    setUser(null);
    setMaterias([]);
    navigate("/");
  };

  const getMaterias = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/materias", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterias(res.data.data);
    } catch { console.log("Error cargando materias"); }
  };

  return (
    <div className="auth-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .auth-wrapper {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: #0f172a;
        }

        .video-bg {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 0.5;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(0,0,0,0.8));
          z-index: 1;
        }

        .navbar-modern {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .brand { display: flex; align-items: center; gap: 10px; }
        .brand .logo-tag {
          background: #FACC15;
          color: #000;
          padding: 4px 8px;
          font-weight: 800;
          border-radius: 6px;
        }
        .brand h1 { color: white; font-size: 1.2rem; font-weight: 800; margin: 0; }

        .btn-dropdown {
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid #7C3AED;
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
        }

        .auth-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          padding: 20px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 30px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
        }

        .glass-card h3 {
          font-size: 1.8rem;
          color: white;
          margin-bottom: 25px;
          font-weight: 800;
          text-align: center;
        }

        .input-group {
          position: relative;
          margin-bottom: 15px;
        }

        .input-group input, .input-group select {
          width: 100%;
          padding: 12px 12px 12px 42px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          outline: none;
          transition: 0.3s;
        }

        .input-group input:focus {
          border-color: #FACC15;
          background: rgba(255, 255, 255, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #A78BFA;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: #7C3AED;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 15px;
          transition: 0.3s;
        }

        .btn-primary:hover {
          background: #6D28D9;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
        }

        .toggle-text {
          margin-top: 20px;
          color: #94a3b8;
          font-size: 0.85rem;
          text-align: center;
        }

        .toggle-text span {
          color: #FACC15;
          cursor: pointer;
          font-weight: 700;
          margin-left: 5px;
        }

        .materia-dropdown {
          position: absolute;
          top: 75px; right: 40px;
          width: 260px;
          background: white;
          border-radius: 15px;
          padding: 8px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
          z-index: 100;
        }

        .dropdown-item {
          padding: 10px 12px;
          border-radius: 8px;
          color: #334155;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .dropdown-item:hover { background: #f1f5f9; }
      `}</style>

      <video autoPlay muted loop className="video-bg">
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div className="overlay" />

      <nav className="navbar-modern">
        <div className="brand">
          <div className="logo-tag">ITS</div>
          <h1>NCG</h1>
        </div>
        <div className="nav-actions">
          <button className="btn-dropdown" onClick={() => { getMaterias(); setShowMenu(!showMenu); }}>
            <GraduationCap size={18} />
            Materias
            <ChevronDown size={16} />
          </button>
          {isLogged && (
            <button className="btn-dropdown" style={{borderColor: '#ef4444', color: '#ef4444'}} onClick={logout}>
              <LogOut size={16} /> Salir
            </button>
          )}
        </div>
      </nav>

      {showMenu && (
        <div className="materia-dropdown">
          {user?.nivel === "docente" && (
            <div className="dropdown-item" style={{color: '#7C3AED', fontWeight: 'bold'}} onClick={() => {}}>
              <Plus size={16} /> Nueva Materia
            </div>
          )}
          {materias.map((m) => (
            <div key={m.id} className="dropdown-item" onClick={() => navigate(`/home/${m.id}`)}>
              <span>{m.nombre}</span>
              {user?.nivel === "docente" && <div style={{display:'flex', gap: '8px'}}><Edit3 size={14}/><Trash2 size={14}/></div>}
            </div>
          ))}
        </div>
      )}

      {!isLogged && (
        <main className="auth-center">
          <div className="glass-card">
            <h3>{isRegister ? "Registro" : "Acceso"}</h3>
            
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <>
                  <div className="input-group">
                    <User className="input-icon" size={18} />
                    <input name="nombre" placeholder="Nombre(s)" onChange={handleChange} required />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="input-group">
                      <User className="input-icon" size={18} />
                      <input name="ap_paterno" placeholder="Ap. Paterno" onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                      <User className="input-icon" size={18} />
                      <input name="ap_materno" placeholder="Ap. Materno" onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="input-group">
                    <ShieldCheck className="input-icon" size={18} />
                    <select name="nivel" onChange={handleChange} style={{paddingLeft: '42px'}}>
                      <option value="alumno">Alumno</option>
                      <option value="docente">Docente</option>
                    </select>
                  </div>
                  {form.nivel === "docente" && (
                    <div className="input-group">
                      <Lock className="input-icon" size={18} />
                      <input name="pin_docente" placeholder="PIN Docente" onChange={handleChange} />
                    </div>
                  )}
                </>
              )}

              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required />
              </div>

              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
              </div>

              <button type="submit" className="btn-primary">
                {isRegister ? "Crear Cuenta" : "Entrar al Sistema"}
              </button>
            </form>

            <p className="toggle-text">
              {isRegister ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Inicia sesión" : "Regístrate"}
              </span>
            </p>
          </div>
        </main>
      )}
    </div>
  );
};

export default Login;