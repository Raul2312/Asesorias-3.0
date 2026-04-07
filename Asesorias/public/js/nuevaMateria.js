document.addEventListener('DOMContentLoaded', function() {

    const modalMateria = new bootstrap.Modal(document.getElementById('modalMateria'));

    function abrirModal() {
        modalMateria.show();
    }

    // Función para mostrar toast
    function mostrarToast(mensaje) {
        const toastContainer = document.getElementById('toastContainer');
        const toastEl = document.createElement('div');
        toastEl.className = 'toast align-items-center text-white bg-success border-0';
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        toastContainer.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();

        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }

    // Enviar formulario por AJAX
    document.getElementById("formNuevaMateria").addEventListener("submit", async function(e) {
        e.preventDefault();
        const formData = new FormData(this);

        try {
            const response = await fetch(urlMateriasStore, {
                method: "POST",
                headers: { 
                    "X-CSRF-TOKEN": formData.get('_token'),
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Agregar nueva materia al dropdown
                const ul = document.querySelector('.dropdown-menu');
                const li = document.createElement('li');
                li.innerHTML = `<a class="dropdown-item" href="/materia/${data.materia.codigo_materia}">${data.materia.nombre} (${data.materia.codigo_materia})</a>`;
                ul.appendChild(li);

                mostrarToast(data.mensaje);

                this.reset();
                modalMateria.hide();
            } else {
                document.getElementById("mensaje").innerText = data.mensaje || 'Error al guardar la materia.';
            }
        } catch(err) {
            console.error(err);
            alert("Error en la petición. Revisa la consola.");
        }
    });

    // Hacer la función accesible desde HTML
    window.abrirModal = abrirModal;
});
