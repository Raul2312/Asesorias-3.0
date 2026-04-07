<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ $subtema->nombre ?? 'Subtema' }}</title>

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
      @include('layouts.temas', ['usuario_nivel' => $usuario_nivel, 'materia' => $materia ?? null])
      @include('layouts.ejercicios', ['usuario_nivel' => $usuario_nivel,'materia' => $materia])
    </aside>

    {{-- Contenido principal --}}
    <main class="col-md-9 col-lg-10 mt-2">
      <h1 class="fw-bold text-center">{{ $subtema->nombre }}</h1>

      @php
          $contenido = $subtema->contenidos->first();
      @endphp

      {{-- Descripción editable para docentes --}}
      @if($usuario_nivel === 'docente')
          <textarea id="descripcionSubtema">{!! $contenido?->contenido ?? 'Aquí puedes poner la descripción del subtema.' !!}</textarea>
          <button id="guardarDescripcionSubtema" class="btn btn-primary mt-2">
            Guardar
        </button>
          <div id="mensajeDescripcion" class="mt-2 text-success"></div>
      @else
          <div class="border p-3 rounded mb-4 text-center">
              {!! $contenido?->contenido ?? 'Aquí puedes poner la descripción del subtema.' !!}
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
    // Inicializar Summernote
    $('#descripcionSubtema').summernote({
        height: 250,
        placeholder: 'Escribe la descripción del subtema aquí...',
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ]
    });

    // Guardar descripción
    $('#guardarDescripcionSubtema').click(async function() {
        const descripcion = $('#descripcionSubtema').summernote('code');
        const token = $('meta[name="csrf-token"]').attr('content');
        const id_subtema = "{{ $subtema->id }}";

        try {
            const res = await fetch("{{ route('subtemas.descripcion.store') }}", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token 
                },
                body: JSON.stringify({ id_subtema, descripcion })
            });

            const data = await res.json();
            $('#mensajeDescripcion').text(data.success ? 'Descripción guardada correctamente' : data.mensaje || 'Error al guardar');
        } catch(e) {
            console.error(e);
            $('#mensajeDescripcion').text('Error en la petición');
        }
    });
});
@endif
</script>

</body>
</html>
