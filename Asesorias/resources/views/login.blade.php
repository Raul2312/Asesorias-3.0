<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Asesorías</title>
    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" />
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

<div class="fondo">

    <!-- Login -->
    <div class="contenedor-form login">
    <img src="img/logo.png" class="logo">
        <h1>Bienvenido</h1>
        <h5>Inicia Sesión para continuar</h5>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <div class="contenedor-input">
                <span class="icono"><i class="ri-mail-fill"></i></span>
                <input name="email" type="email" required />
                <label>Email</label>
            </div>

            <div class="contenedor-input">
                <span class="icono"><i class="ri-lock-2-fill"></i></span>
                <input name="password" type="password" required />
                <label>Contraseña</label>
            </div>

            <div class="recordar">
                <label><input type="checkbox" />Recordar sesión</label>
                <a href="#">¿Olvidaste la Contraseña?</a>
            </div>
            

            <button type="submit" class="btn">Iniciar Sesión</button>

            <div class="cambio-registro">
                <p>¿No tienes cuenta? <a href="#" class="registrar-link">Registrarse</a></p>
            </div>
            

        </form>
    </div>

    <!-- Registro -->
    <div class="contenedor-form registrar">
        <h2>Registrarse</h2>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <div class="contenedor-input">
                <span class="icono"><i class="ri-user-fill"></i></span>
                <input name="nombre" type="text" required />
                <label>Nombre</label>
            </div>

            <div class="contenedor-input">
                <span class="icono"><i class="ri-user-fill"></i></span>
                <input name="ap_paterno" type="text" required />
                <label>Apellido Paterno</label>
            </div>

            <div class="contenedor-input">
                <span class="icono"><i class="ri-user-fill"></i></span>
                <input name="ap_materno" type="text" required />
                <label>Apellido Materno</label>

            </div>

            <div class="contenedor-input">
                <span class="icono"><i class="ri-mail-fill"></i></span>
                <input name="email" type="email" required />
                <label>Email</label>
            </div>

            <div class="contenedor-input">
                <span class="icono"><i class="ri-lock-2-fill"></i></span>
                <input name="password" type="password" required />
                <label>Contraseña</label>
            </div>
            <div class="contenedor-input select-nivel">
                <!--<label>Nivel</label>-->
                <select name="nivel" id="nivel" onchange="mostrarPin()" required>
                    <option value="" disabled selected>Selecciona tu nivel</option>
                    <option value="alumno">Alumno</option>
                    <option value="docente">Docente</option>
                </select>
                <div id="pinDocente" style="display:none;">
                    <input type="password" name="pin_docente" placeholder="PIN de docente">
                </div>
            </div>

            <div class="recordar">
                <label><input type="checkbox" required />Acepto los términos y condiciones</label>
            </div>
            
            <button type="submit" class="btn">Registrarme</button>

            <div class="cambio-login">
                <p>¿Ya tienes cuenta? <a href="#" class="login-link">Iniciar Sesión</a></p>
            </div>

        </form>
    </div>

</div>

<!-- JS -->
<script src="{{ asset('js/login.js') }}"></script>

<!-- Alertas SweetAlert -->
@if(session('error'))
<script>
Swal.fire({ icon: 'error', title: 'Error', text: '{{ session("error") }}' });
</script>
@endif

@if(session('success'))
<script>
Swal.fire({ icon: 'success', title: 'Éxito', text: '{{ session("success") }}' });
</script>
@endif
<script>
function mostrarPin() {
  const nivel = document.getElementById("nivel").value;
  const pin = document.getElementById("pinDocente");

  pin.style.display = (nivel === "docente") ? "block" : "none";
}
</script>

</body>
</html>
