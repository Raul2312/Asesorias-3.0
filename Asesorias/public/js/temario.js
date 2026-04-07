document.addEventListener("DOMContentLoaded", () => {

    
    // ---------------------- VARIABLES ----------------------
    const modalUnidad = new bootstrap.Modal(document.getElementById("modalUnidad"));
    const modalSubtema = new bootstrap.Modal(document.getElementById("modalSubtema"));
    const unidadesContainer = document.getElementById("unidadesContainer");
    const usuarioNivel = document.querySelector('meta[name="usuario-nivel"]')?.content || 'estudiante';
    const temarioApp = document.getElementById("temarioApp");
    const materiaId = temarioApp?.dataset.materiaId;

    const chatbotUrl = document.querySelector('meta[name="chatbot-url"]')?.content;
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    const openBtn = document.getElementById('openChatbot');
    const closeBtn = document.getElementById('closeChatbot');
    const sidebar = document.getElementById('chatbotSidebar');
    const chatbotContent = document.getElementById('chatbotContent');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotForm = document.getElementById('chatbotForm');

    
    // ---------------------- COLA DE MENSAJES ----------------------
    const messageQueue = [];
    let processingQueue = false;

    async function processQueue() {
        if (processingQueue || messageQueue.length === 0) return;

        processingQueue = true;
        const { message, typingElem } = messageQueue.shift();

        try {
            const res = await fetch(chatbotUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json' // Forzamos a Laravel a responder en JSON
                },
                body: JSON.stringify({ message })
            });

            // Verificamos si la respuesta es exitosa antes de intentar convertir a JSON
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({})); 
                throw new Error(errorData.error_detail || errorData.reply || `Error del servidor (${res.status})`);
            }

            const data = await res.json();
            typingElem.remove();

            if (data && data.reply) {
                addMessage(data.reply, 'bot');
            } else {
                addMessage('Lo siento, recibí una respuesta vacía.', 'bot');
            }

        } catch (err) {
            if (typingElem) typingElem.remove();
            // Mostramos el mensaje de error real para saber qué está pasando
            addMessage('Error: ' + err.message, 'bot');
            console.error("Detalle del error:", err);
        } finally {
            processingQueue = false;
            // Pequeño delay para no saturar
            setTimeout(() => processQueue(), 100);
        }
    }

    // ---------------------- MODALES ----------------------
    window.abrirModalUnidad = () => {
        document.getElementById("formNuevaUnidad").reset();
        document.getElementById("unidadId").value = "";
        document.getElementById("btnGuardarUnidad").textContent = "Guardar";
        modalUnidad.show();
    }

    window.abrirModalSubtema = (unidadId) => {
        document.getElementById("subtemaUnidadId").value = unidadId;
        modalSubtema.show();
    };

    // ---------------------- NUEVA / EDITAR UNIDAD ----------------------
    window.abrirModalEditarUnidad = (id, nombre, titulo, numero) => {
        document.getElementById("unidadId").value = id;
        document.getElementById("nombreUnidad").value = nombre;
        document.getElementById("tituloUnidad").value = titulo;
        document.getElementById("numeroUnidad").value = numero;
        document.getElementById("btnGuardarUnidad").textContent = "Actualizar";
        modalUnidad.show();
    }

    document.getElementById("formNuevaUnidad")?.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const unidadId = document.getElementById("unidadId").value;

        let url = unidadId ? `/unidad/${unidadId}` : `/materia/${materiaId}/unidad`;
        if (unidadId) formData.append('_method', 'PUT');

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { 'X-CSRF-TOKEN': csrfToken },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.reset();
                modalUnidad.hide();
                document.getElementById("unidadId").value = "";
                document.getElementById("btnGuardarUnidad").textContent = "Guardar";

                // Actualizar en pantalla sin duplicar
                const unidadHTML = unidadesContainer.querySelector(`[data-unidad-id="${data.unidad.id}"] button.btn-light`);
                if (unidadHTML) {
                    unidadHTML.textContent = data.unidad.nombre;
                } else {
                    const unidad = data.unidad;
                    const unidadHTMLNew = `
                        <div class="btn-group dropend mt-3 w-100" data-unidad-id="${unidad.id}">
                            <button type="button" class="btn btn-light w-100 text-start dropdown-toggle rounded" data-bs-toggle="dropdown">
                                ${unidad.nombre}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-dark w-100%">
                                <li><h6 class="dropdown-header">${unidad.titulo || ''}</h6></li>
                                <li><span class="dropdown-item text-muted">No hay subtemas aún</span></li>
                                ${usuarioNivel === 'docente' ? `
                                <li>
                                    <button class="btn btn-sm btn-success w-100 mt-2" onclick="abrirModalSubtema(${unidad.id})">+ Nuevo Subtema</button>
                                </li>` : ''}
                            </ul>
                        </div>
                    `;
                    unidadesContainer.insertAdjacentHTML("beforeend", unidadHTMLNew);
                }
            } else {
                document.getElementById("mensajeUnidad").innerText = data.mensaje || 'Error al guardar unidad.';
            }
        } catch (error) {
            console.error(error);
            document.getElementById("mensajeUnidad").innerText = 'Error al guardar unidad.';
        }
    });

    // ---------------------- NUEVO / EDITAR SUBTEMA ----------------------
    document.getElementById("formNuevoSubtema")?.addEventListener("submit", async function(e){
        e.preventDefault();
        const formData = new FormData(this);
        const subtemaId = this.dataset.subtemaId; // viene si es edición
        if(subtemaId) formData.append('_method', 'PUT');

        try {
            const response = await fetch(subtemaId ? `/subtemas/${subtemaId}` : "/subtemas", {
                method: "POST",
                headers: { 'X-CSRF-TOKEN': csrfToken },
                body: formData
            });

            const data = await response.json();

            if(data.success){
                this.reset();
                modalSubtema.hide();
                this.dataset.subtemaId = ''; // limpiar modo edición
                this.querySelector('button[type="submit"]').textContent = "Guardar";

                const subtema = data.subtema;
                const dropdownMenu = document.querySelector(`.btn-group[data-unidad-id="${subtema.id_unidad}"] .dropdown-menu`);

                if(dropdownMenu){
                    let subtemaElem = dropdownMenu.querySelector(`.dropdown-item[data-subtema-id='${subtema.id}']`);
                    if(subtemaElem){
                        // Actualizar nombre existente
                        subtemaElem.textContent = subtema.nombre;
                    } else {
                        // Agregar nuevo subtema
                        dropdownMenu.insertAdjacentHTML("beforeend",
                            `<li>
                                <a class="dropdown-item" href="#" data-subtema-id="${subtema.id}">${subtema.nombre}</a>
                                ${usuarioNivel === 'docente' ? `
                                <button class="btn btn-outline-warning btn-sm ms-2" style="width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                    onclick="abrirModalEditarSubtema(${subtema.id}, '${subtema.nombre}', ${subtema.id_unidad})">✏️</button>
                                <button class="btn btn-outline-danger btn-sm ms-2" style="width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                    onclick="eliminarSubtema(${subtema.id})">🗑️</button>` : ''}
                            </li>`
                        );
                    }
                }

            } else {
                document.getElementById("mensajeSubtema").innerText = data.mensaje || 'Error';
            }

        } catch(err){
            console.error(err);
            document.getElementById("mensajeSubtema").innerText = 'Error al guardar subtema';
        }
    });

    // ---------------------- EDITAR SUBTEMA ----------------------
    window.abrirModalEditarSubtema = (subtemaId, nombre, id_unidad) => {
        document.getElementById("subtemaUnidadId").value = id_unidad;
        const form = document.getElementById("formNuevoSubtema");
        form.dataset.subtemaId = subtemaId;
        form.querySelector('input[name="nombre"]').value = nombre;
        form.querySelector('button[type="submit"]').textContent = "Actualizar";
        modalSubtema.show();
    };

    // ---------------------- ELIMINAR UNIDAD ----------------------
    window.eliminarUnidad = async (unidadId) => {
        if(!confirm("¿Estás seguro de eliminar esta unidad?")) return;

        try {
            const res = await fetch(`/unidad/${unidadId}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });

            const data = await res.json();

            if(data.success){
                const unidadElem = document.querySelector(`.btn-group[data-unidad-id="${unidadId}"]`);
                if(unidadElem) unidadElem.remove();
            } else {
                alert(data.mensaje || 'Error al eliminar la unidad.');
            }

        } catch(err){
            console.error(err);
            alert('Error al eliminar la unidad.');
        }
    }

    // ---------------------- ELIMINAR SUBTEMA ----------------------
    window.eliminarSubtema = async (subtemaId) => {
        if(!confirm("¿Estás seguro de eliminar este subtema?")) return;

        try {
            const res = await fetch(`/subtemas/${subtemaId}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrfToken }
            });

            const data = await res.json();

            if(data.success){
                const subtemaElem = document.querySelector(`.dropdown-item[data-subtema-id='${subtemaId}']`)?.closest('li');
                if(subtemaElem) subtemaElem.remove();
            } else {
                alert(data.mensaje || 'Error al eliminar el subtema.');
            }

        } catch(err){
            console.error(err);
            alert('Error al eliminar el subtema.');
        }
    }

   // ---------------------- DESCRIPCIÓN ----------------------
if(usuarioNivel === 'docente' && typeof $ !== 'undefined'){
    $('#descripcionMateria').summernote({
        height: 250,
        placeholder: 'Escribe la descripción de la materia aquí...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });

   $('#guardarDescripcion').click(async function(){
    const contenido = $('#descripcionMateria').summernote('code');
    const formData = new FormData();
    formData.append('id_materia', "{{ $materia->id }}");
    formData.append('descripcion', contenido);
    formData.append('_token', csrfToken);

    try {
        const res = await fetch(urlDescripcionStore, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // importante
            },
            body: formData
        });

        const data = await res.json();
        $('#mensajeDescripcion').text(data.success ? 'Descripción guardada correctamente' : data.mensaje || 'Error al guardar');

    } catch(e){
        console.error(e);
        $('#mensajeDescripcion').text('Error en la petición');
    }
});

}


    // ---------------------- CHATBOT ----------------------
    function addMessage(text, sender){
        const p = document.createElement('p');
        p.textContent = text;
        p.classList.add(sender==='user'?'user-message':'bot-message');
        chatbotContent.appendChild(p);
        chatbotContent.scrollTop = chatbotContent.scrollHeight;
    }

    function addTyping(){
        const p = document.createElement('p');
        p.textContent='Escribiendo...';
        p.classList.add('typing');
        chatbotContent.appendChild(p);
        chatbotContent.scrollTop = chatbotContent.scrollHeight;
        return p;
    }

    openBtn?.addEventListener('click', e => { e.preventDefault(); sidebar.style.right='0'; chatbotInput.focus(); });
    closeBtn?.addEventListener('click', () => sidebar.style.right='-350px');
    document.addEventListener('keydown', e => { if(e.key==='Escape') sidebar.style.right='-350px'; });

    chatbotForm?.addEventListener('submit', e=>{
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if(!message) return;

        addMessage(message,'user');
        chatbotInput.value='';
        chatbotInput.focus();
        const typingElem = addTyping();

        messageQueue.push({ message, typingElem });
        processQueue();
    });

});
