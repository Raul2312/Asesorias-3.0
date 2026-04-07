document.addEventListener("DOMContentLoaded", () => {

    const app = document.getElementById("ejerciciosApp");
    if (!app) return;

    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    const materiaId = app.dataset.materiaId;

    const modalUnidad = new bootstrap.Modal(document.getElementById("modalEjeUnidad"));
    const modalEjercicio = new bootstrap.Modal(document.getElementById("modalEjercicio"));

    /* ================= UNIDADES ================= */

    window.abrirModalEjeUnidad = () => {
        document.getElementById("formNuevaEjeUnidad").reset();
        document.getElementById("ejeUnidadId").value = "";
        modalUnidad.show();
    };

    window.abrirModalEditarEjeUnidad = (id, nombre, titulo, numero) => {
        document.getElementById("ejeUnidadId").value = id;
        document.getElementById("nombreEjeUnidad").value = nombre;
        document.getElementById("tituloEjeUnidad").value = titulo;
        document.getElementById("numeroEjeUnidad").value = numero;
        modalUnidad.show();
    };

    document.getElementById("formNuevaEjeUnidad").addEventListener("submit", async (e) => {
        e.preventDefault();

        let id = document.getElementById("ejeUnidadId").value;

        let data = new FormData();
        data.append("nombre", document.getElementById("nombreEjeUnidad").value);
        data.append("titulo", document.getElementById("tituloEjeUnidad").value);
        data.append("numero_unidad", document.getElementById("numeroEjeUnidad").value);

        let url = `/materia/${materiaId}/eje-unidad`;

        if (id) {
            url = `/eje-unidad/${id}`;
            data.append("_method", "PUT");
        }

        await fetch(url, {
            method: "POST",
            headers: { "X-CSRF-TOKEN": csrf },
            body: data
        });

        location.reload();
    });

    window.eliminarEjeUnidad = async (id) => {
        if (!confirm("¿Eliminar unidad?")) return;

        await fetch(`/eje-unidad/${id}`, {
            method: "DELETE",
            headers: { "X-CSRF-TOKEN": csrf }
        });

        location.reload();
    };

    /* ================= EJERCICIOS ================= */

    window.abrirModalEjercicioNueva = (unidadId) => {
        document.getElementById("formNuevoEjercicio").reset();
        document.getElementById("ejercicioId").value = "";
        document.getElementById("ejercicioUnidadId").value = unidadId;
        modalEjercicio.show();
    };

    window.abrirModalEjercicio = (id, nombre, unidadId) => {
        document.getElementById("ejercicioId").value = id;
        document.getElementById("nombreEjercicio").value = nombre;
        document.getElementById("ejercicioUnidadId").value = unidadId;
        modalEjercicio.show();
    };

    document.getElementById("formNuevoEjercicio").addEventListener("submit", async (e) => {
        e.preventDefault();

        let id = document.getElementById("ejercicioId").value;

        let data = new FormData();
        data.append("nombre", document.getElementById("nombreEjercicio").value);
        data.append("unidadId", document.getElementById("ejercicioUnidadId").value);

        let url = "/ejercicios";

        if (id) {
            url = `/ejercicios/${id}`;
            data.append("_method", "PUT");
        }

        await fetch(url, {
            method: "POST",
            headers: { "X-CSRF-TOKEN": csrf },
            body: data
        });

        location.reload();
    });

    window.eliminarEjercicio = async (id) => {
        if (!confirm("¿Eliminar ejercicio?")) return;

        await fetch(`/ejercicios/${id}`, {
            method: "DELETE",
            headers: { "X-CSRF-TOKEN": csrf }
        });

        location.reload();
    };

});