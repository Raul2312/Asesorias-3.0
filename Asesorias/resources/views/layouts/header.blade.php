@php
// Obtener datos del usuario desde la sesión
$usuario_id = session('usuario_id');
$usuario_nombre = session('usuario_nombre', 'Invitado');

// Traer la foto de perfil desde la base de datos si existe
$usuario_foto = null;
if($usuario_id){
    $usuario = \App\Models\User::find($usuario_id);
    if($usuario && $usuario->foto_perfil){
        $usuario_foto = asset('storage/' . $usuario->foto_perfil);
    }
}
$foto_usuario = $usuario_foto ?? asset('img/default.jpeg');
@endphp

<header class="header-pro">

    <!-- IZQUIERDA -->
    <div class="header-left">
        <!-- Aquí puedes poner logo si quieres -->
    </div>

    <!-- CENTRO -->
    <div class="header-center">
        <h1>{{ $materia->nombre ?? 'Materia' }}</h1>
    </div>

    <!-- DERECHA (USUARIO) -->
    <div class="header-right">
        <img src="{{ $foto_usuario }}" class="user-img">

        <div class="dropdown">
            <button class="btn btn-user dropdown-toggle" data-bs-toggle="dropdown">
                {{ $usuario_nombre }}
            </button>

            <ul class="dropdown-menu dropdown-menu-end menu-user">
                <li>
                    <a href="{{ route('perfil') }}" class="dropdown-item">
                        <i class="bi bi-person-fill"></i> Perfil
                    </a>
                </li>
                <li><hr></li>
                <li>
                    <a href="{{ route('logout') }}" class="dropdown-item text-danger">
                        <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                    </a>
                </li>
            </ul>
        </div>
    </div>

</header>

<!-- NAV -->
<nav class="nav-pro">
    <a href="#">Inicio</a>
    <a href="#">Preguntas</a>
    <a href="#" id="openChatbot">ChatBot</a>
</nav>

<!-- Chatbot Sidebar -->
<div id="chatbotSidebar" role="dialog" aria-modal="true" aria-labelledby="chatbotTitle">
    <header style="padding: 15px; background-color: #541469; color: white; font-size: 20px; font-weight: 700; display: flex; justify-content: space-between; align-items: center;">
        <span id="chatbotTitle">ChatBot</span>
        <button id="closeChatbot" aria-label="Cerrar chatbot" style="background: none; border: none; color: white; font-size: 28px; cursor: pointer; line-height: 1;">&times;</button>
    </header>
    <div id="chatbotContent" style="
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: white;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    ">
        <p style="color: #555; font-style: italic;">Hola, soy tu asistente. ¿En qué puedo ayudarte?</p>
    </div>
    <form id="chatbotForm" style="display: flex; padding: 10px; background-color: #f0f0f0;">
        <input id="chatbotInput" type="text" placeholder="Escribe tu mensaje..." autocomplete="off" aria-label="Escribe tu mensaje" required
            style="flex-grow: 1; padding: 10px 15px; border: 1px solid #ccc; border-radius: 25px; outline: none; font-size: 16px;">
        <button type="submit" style="margin-left: 10px; background-color: #541469; border: none; color: white; padding: 10px 18px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">
            Enviar
        </button>
    </form>
</div>

<style>
    #chatbotSidebar p {
        max-width: 75%;
        padding: 10px 15px;
        border-radius: 20px;
        margin: 0;
    }
    #chatbotSidebar p.user-message {
        background-color: #d1e7dd;
        color: #0f5132;
        align-self: flex-end;
        font-weight: 600;
    }
    #chatbotSidebar p.bot-message {
        background-color: #e2e3e5;
        color: #41464b;
        align-self: flex-start;
    }
    #chatbotSidebar p.typing {
        font-style: italic;
        color: #888;
        text-align: left;
        max-width: 100%;
        background: none;
        padding: 0;
    }
    #chatbotSidebar::-webkit-scrollbar {
        width: 8px;
    }
    #chatbotSidebar::-webkit-scrollbar-thumb {
        background-color: rgba(0,0,0,0.1);
        border-radius: 4px;
    }
    #chatbotSidebar::-webkit-scrollbar-track {
        background: transparent;
    }
</style>

<script>
    const openChatbot = document.getElementById('openChatbot');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotSidebar = document.getElementById('chatbotSidebar');

    openChatbot.addEventListener('click', (e) => {
        e.preventDefault();
        chatbotSidebar.style.right = '0';
    });

    closeChatbot.addEventListener('click', () => {
        chatbotSidebar.style.right = '-350px';
    });
</script>
