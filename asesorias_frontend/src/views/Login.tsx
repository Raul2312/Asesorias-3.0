import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  ShieldCheck
} from "lucide-react";

import "../css/login.css";

import bufalo from "../img/12 jun 2026, 10_31_59 p.m..png";

const Login = () => {

  const navigate = useNavigate();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login",
        {
          email: form.email,
          password: form.password
        }
      );

      localStorage.setItem(
        "token",
        res.data.data.token
      );

      localStorage.setItem(
        "user_nivel",
        res.data.data.user.nivel
      );

      localStorage.setItem(
        "user_id",
        res.data.data.user.id
      );

      navigate("/materias");

    } catch {

      alert("Credenciales incorrectas");

    }
  };

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/register",
        form
      );

      alert(
        "Usuario registrado correctamente"
      );

      setIsRegister(false);

    } catch (err: any) {

      console.error(
        err.response?.data
      );

      alert(
        "Error al registrar usuario"
      );

    }
  };

  return (

    <div className="auth-page">

      <div
        className={`container-auth ${
          isRegister ? "active" : ""
        }`}
      >

        {/* LOGIN */}

        <div className="form-panel login-panel">

          <h2>Iniciar Sesión</h2>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Correo Institucional"
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Entrar
            </button>

          </form>

        </div>

        {/* REGISTRO */}

        <div className="form-panel register-panel">

          <h2>Crear Cuenta</h2>

          <form onSubmit={handleRegister}>

            <div className="input-group">

              <User size={18} />

              <input
                name="nombre"
                placeholder="Nombre(s)"
                onChange={handleChange}
                required
              />

            </div>

            <div className="double-grid">

              <div className="input-group">

                <User size={18} />

                <input
                  name="ap_paterno"
                  placeholder="Apellido Paterno"
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="input-group">

                <User size={18} />

                <input
                  name="ap_materno"
                  placeholder="Apellido Materno"
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="input-group">

              <ShieldCheck size={18} />

              <select
                name="nivel"
                onChange={handleChange}
              >
                <option value="alumno">
                  Alumno
                </option>

                <option value="docente">
                  Docente
                </option>
              </select>

            </div>

            {form.nivel === "docente" && (

              <div className="input-group">

                <Lock size={18} />

                <input
                  name="pin_docente"
                  placeholder="PIN Docente"
                  onChange={handleChange}
                />

              </div>

            )}

            <div className="input-group">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Correo"
                onChange={handleChange}
                required
              />

            </div>

            <div className="input-group">

              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="submit"
              className="btn-primary"
            >
              Registrarme
            </button>

          </form>

        </div>

        {/* PANEL MORADO */}

        <div className="overlay-panel">

          <div className="overlay-content">

            <img
              src={bufalo}
              alt="Bufalo ITSNCG"
              className="bufalo"
            />

            {!isRegister ? (
              <>
                <h1>
                  Sistema de Asesorías
                </h1>

                <p>
                  Plataforma institucional
                  para alumnos y docentes.
                </p>

                <button
                  className="ghost-btn"
                  onClick={() =>
                    setIsRegister(true)
                  }
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <h1>
                  Bienvenido de Nuevo
                </h1>

                <p>
                  ¿Ya tienes una cuenta?
                </p>

                <button
                  className="ghost-btn"
                  onClick={() =>
                    setIsRegister(false)
                  }
                >
                  Iniciar Sesión
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default Login;