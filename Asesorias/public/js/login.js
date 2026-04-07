document.addEventListener("DOMContentLoaded", function() {
    const fondo = document.querySelector(".fondo");
    const loginlink = document.querySelector(".login-link");
    const registrarlink = document.querySelector(".registrar-link");

    // Mostrar registro
    registrarlink.addEventListener("click", (e) => {
        e.preventDefault();
        fondo.classList.add('active'); // muestra formulario registro
    });

    // Mostrar login
    loginlink.addEventListener("click", (e) => {
        e.preventDefault();
        fondo.classList.remove('active'); // muestra formulario login
    });

    // Mantener login visible al cargar
    fondo.classList.remove('active');
});
