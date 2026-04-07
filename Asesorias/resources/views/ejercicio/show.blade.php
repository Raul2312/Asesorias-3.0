<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $ejercicio->nombre ?? 'Ejercicio' }}</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="{{ asset('css/estilos.css') }}">
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="usuario-nivel" content="{{ $usuario_nivel ?? 'alumno' }}">

<!-- Summernote CSS -->
<link href="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs5.min.css" rel="stylesheet">
</head>
<body>

@include('layouts.header')

<div class="container-fluid">
  <div class="row">

    {{-- Aside con temas --}}
    <aside class="col-md-3 col-lg-2 mt-2">
      @include('layouts.temas', [
          'usuario_nivel' => $usuario_nivel,
          'materia' => $materia ?? null
      ])

      @include('layouts.ejercicios', ['usuario_nivel' => $usuario_nivel,'materia' => $materia])
    </aside>

    {{-- Contenido principal --}}
    <main class="col-md-9 col-lg-10 mt-2">

      <h1 class="fw-bold text-center">{{ $ejercicio->nombre }}</h1>

      {{-- CONTENIDO --}}
      @if($usuario_nivel === 'docente')

          <textarea id="descripcionEjercicio">
              {!! $ejercicio->contenido ?? 'Aquí puedes escribir el ejercicio completo...' !!}
          </textarea>

          <button id="guardarEjercicio" class="btn btn-primary mt-2">
              Guardar
          </button>

          <div id="mensajeEjercicio" class="mt-2 text-success"></div>

      @else

          <div class="border p-3 rounded mb-4 text-center">
              {!! $ejercicio->contenido ?? 'Sin contenido aún.' !!}
          </div>

      @endif

    </main>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs5.min.js"></script>

<script>
@if($usuario_nivel === 'docente')
$(document).ready(function() {

    $('#descripcionEjercicio').summernote({
        height: 300,
        placeholder: 'Escribe el ejercicio aquí...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview']]
        ]
    });

    $('#guardarEjercicio').click(async function() {

        const contenido = $('#descripcionEjercicio').summernote('code');
        const token = $('meta[name="csrf-token"]').attr('content');
        const id = "{{ $ejercicio->id }}";

        let formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('contenido', contenido);

        try {

            const res = await fetch(`/ejercicios/${id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token
                },
                body: formData
            });

            const data = await res.json();

            $('#mensajeEjercicio').text(
                data.success ? 'Guardado correctamente ✔' : data.mensaje
            );

        } catch (e) {
            console.error(e);
            $('#mensajeEjercicio').text('Error en la petición');
        }
    });

});
@endif
</script>

</body>
</html>