import { useState } from "react";
import axios from "axios";
import "../css/login.css";

const Login = () => {

  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    email: "",
    password: "",
    nivel: "alumno",
    pin_docente: ""
  });

  const [materias, setMaterias] = useState<any[]>([]);
  const [isLogged, setIsLogged] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<any>(null); // 👈 usuario

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔐 LOGIN
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.data.token);
      setUser(res.data.data.user); // 👈 guardamos usuario
      setIsLogged(true);

    } catch {
      alert("Credenciales incorrectas");
    }
  };

  // 📝 REGISTRO
  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/api/register", form);
      alert("Usuario registrado correctamente");
      setIsRegister(false);
    } catch (err: any) {
      console.log(err.response?.data);
      alert("Error al registrar");
    }
  };

  // 📚 OBTENER MATERIAS
  const getMaterias = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://127.0.0.1:8000/api/materias", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMaterias(res.data.data);

    } catch {
      console.log("Error cargando materias");
    }
  };

  // ➕ AGREGAR
  const agregarMateria = async () => {
    const nombre = prompt("Nombre de la materia");
    if (!nombre) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://127.0.0.1:8000/api/materias", {
        nombre
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      getMaterias();

    } catch {
      alert("Error al crear materia");
    }
  };

  // ✏️ EDITAR
  const editarMateria = async (materia: any) => {
    const nombre = prompt("Nuevo nombre", materia.nombre);
    if (!nombre) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://127.0.0.1:8000/api/materias/${materia.id}`, {
        nombre
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      getMaterias();

    } catch {
      alert("Error al editar");
    }
  };

  // 🗑️ ELIMINAR
  const eliminarMateria = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://127.0.0.1:8000/api/materias/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      getMaterias();

    } catch {
      alert("Error al eliminar");
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    setMaterias([]);
    setShowMenu(false);
    setUser(null);
  };

  return (
    <div className="container">

      {/* VIDEO */}
      <video autoPlay muted loop className="video-bg">
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo-box">
          <h1>ITS</h1>
          <span>NCG</span>
        </div>

        <h2 className="title">Asesorías Académicas</h2>

        <div className="nav-right">

          <button onClick={() => {
            getMaterias();
            setShowMenu(!showMenu);
          }}>
            Materias ▾
          </button>

          {/* 📚 DROPDOWN */}
          {showMenu && (
            <div className="dropdown">

              {/* SOLO DOCENTE */}
              {user?.nivel === "docente" && (
                <div className="dropdown-item add" onClick={agregarMateria}>
                  ➕ Agregar materia
                </div>
              )}

              {materias.map((m) => (
                <div key={m.id} className="dropdown-item">

                  <span>{m.nombre}</span>

                  {user?.nivel === "docente" && (
                    <div className="acciones">
                      <button onClick={() => editarMateria(m)}>✏️</button>
                      <button onClick={() => eliminarMateria(m.id)}>🗑️</button>
                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

          {isLogged && (
            <button className="logout" onClick={logout}>
              ⎋ Salir
            </button>
          )}
        </div>
      </div>

      {/* LOGIN / REGISTER */}
      {!isLogged && (
        <div className="auth-box">

          <h3>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h3>

          <form onSubmit={isRegister ? handleRegister : handleLogin}>

            {isRegister && (
              <>
                <input name="nombre" placeholder="Nombre" onChange={handleChange} />
                <input name="ap_paterno" placeholder="Apellido paterno" onChange={handleChange} />
                <input name="ap_materno" placeholder="Apellido materno" onChange={handleChange} />
              </>
            )}

            <input type="email" name="email" placeholder="Correo" onChange={handleChange} />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />

            {isRegister && (
              <>
                <select name="nivel" onChange={handleChange}>
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                </select>

                {form.nivel === "docente" && (
                  <input name="pin_docente" placeholder="PIN docente" onChange={handleChange} />
                )}
              </>
            )}

            <button type="submit">
              {isRegister ? "Registrarse" : "Entrar"}
            </button>

          </form>

          <div className="links">
            {!isRegister && (
              <span className="link">¿Olvidaste tu contraseña?</span>
            )}

            <span className="link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </span>
          </div>

        </div>
      )}

    </div>
  );
};

export default Login;