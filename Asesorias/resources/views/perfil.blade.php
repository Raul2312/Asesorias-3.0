<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mi Perfil</title>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

<style>
body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;

    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white;
}

/* CONTENEDOR */
.perfil-container {
    max-width: 450px;
    margin: 60px auto;

    padding: 30px;
    border-radius: 20px;

    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);

    border: 1px solid rgba(255,255,255,0.1);

    box-shadow: 0 15px 40px rgba(0,0,0,0.5);

    text-align: center;

    animation: fadeIn 0.5s ease;
}

/* ANIMACIÓN */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* TÍTULO */
.perfil-container h2 {
    font-weight: bold;
    margin-bottom: 10px;
}

/* FOTO */
.foto-wrapper {
    position: relative;
    display: inline-block;
}

.foto-perfil {
    width: 140px;
    height: 140px;

    border-radius: 50%;
    object-fit: cover;

    border: 3px solid #7c3aed;

    box-shadow: 0 0 25px rgba(124,58,237,0.8),
                0 0 60px rgba(124,58,237,0.4);

    transition: 0.3s;
}

.foto-perfil:hover {
    transform: scale(1.05);
}

/* BOTÓN SUBIR FOTO */
.btn-subir-foto {
    position: absolute;
    bottom: 5px;
    right: 5px;

    background: linear-gradient(90deg, #7c3aed, #9333ea);
    border-radius: 50%;

    width: 38px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    font-size: 18px;

    cursor: pointer;

    box-shadow: 0 0 10px rgba(124,58,237,0.6);

    transition: 0.3s;
}

.btn-subir-foto:hover {
    transform: scale(1.1);
}

/* INPUT */
.form-control {
    background: rgba(2,6,23,0.8);
    border: 1px solid rgba(124,58,237,0.4);

    color: white;

    border-radius: 12px;

    padding: 10px;
}

.form-control::placeholder {
    color: rgba(255,255,255,0.6);
}

.form-control:focus {
    background: rgba(2,6,23,0.9);
    color: white;

    border-color: #a855f7;

    box-shadow: 0 0 0 0.2rem rgba(124,58,237,0.25);
}

/* BOTONES */
.btn-actualizar {
    margin-top: 15px;
    width: 100%;

    background: linear-gradient(90deg, #7c3aed, #9333ea);
    border: none;

    border-radius: 12px;

    font-weight: bold;

    transition: 0.3s;
}

.btn-actualizar:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(124,58,237,0.5);
}

/* REGRESAR */
.btn-regresar {
    margin-top: 10px;
    width: 100%;

    border-radius: 12px;
    font-weight: bold;
}

/* TEXTO */
.perfil-container p {
    color: rgba(255,255,255,0.7);
}
</style>
<meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

<div class="perfil-container">
    <h2 class="mb-3">Mi Perfil</h2>
    <p>Cambia tu foto de perfil y tu nombre.</p>

    <form id="perfilForm" enctype="multipart/form-data">
        <div class="foto-wrapper mb-3">
            <img src="{{ $usuario->foto_perfil ? asset('storage/' . $usuario->foto_perfil) : asset('img/default.jpeg') }}" 
                 alt="Foto de perfil" class="foto-perfil" id="fotoPerfilPreview">
            <label class="btn-subir-foto" title="Cambiar foto">
                &#128247;
                <input type="file" name="foto" accept="image/*" style="display:none;">
            </label>
        </div>

        <div class="mb-3 input-nombre">
            <input type="text" name="nombre" class="form-control" placeholder="Nombre" value="{{ $usuario->nombre }}" required>
        </div>

        <button type="submit" class="btn btn-primary btn-actualizar">Actualizar perfil</button>
    </form>

    <a href="{{ url()->previous() }}" class="btn btn-danger btn-regresar">Regresar</a>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script>
$('#perfilForm').on('submit', function(e){
    e.preventDefault();
    const formData = new FormData(this);
    const token = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        url: "{{ route('perfil.actualizar') }}",
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': token },
        data: formData,
        processData: false,
        contentType: false,
        success: function(res){
    Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: res.mensaje,
        confirmButtonText: 'OK'
    });

    // Actualiza la foto del perfil en la página de perfil
    if(res.foto_perfil_url){
        $('#fotoPerfilPreview').attr('src', res.foto_perfil_url + '?' + new Date().getTime());
    }

    // Actualiza la foto en el header también
    $('header img.rounded-circle').attr('src', res.foto_perfil_url + '?' + new Date().getTime());
}
,
        error: function(err){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el perfil.'
            });
        }
    });
});
</script>

</body>
</html>
