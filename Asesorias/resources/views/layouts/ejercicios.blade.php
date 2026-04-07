<div id="ejerciciosApp"
    data-materia-id="{{ $materia?->id ?? 0 }}"
    class="card shadow-sm mt-4 rounded-lg"
    style="background-color:#711092; color:white;">

    <div class="card-body">
        <h5 class="card-title text-center">Ejercicios</h5>

        @if($usuario_nivel === 'docente')
        <button class="btn btn-primary w-100 mb-3" onclick="abrirModalEjeUnidad()">
            + Nueva Unidad
        </button>
        @endif

        <div id="unidadesContainerEjercicios">

            @foreach($materia->ejeunidades ?? [] as $unidad)

            <div class="btn-group dropend mt-3 w-100" data-unidad-id="{{ $unidad->id }}">

                {{-- BOTÓN UNIDAD --}}
                <button type="button"
                    class="btn btn-light w-100 text-start dropdown-toggle rounded"
                    data-bs-toggle="dropdown">
                    {{ $unidad->nombre }}
                </button>

                {{-- BOTONES EDITAR / ELIMINAR --}}
                @if($usuario_nivel === 'docente')
                <button class="btn btn-outline-warning btn-sm ms-2"
                    style="width:45px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                    onclick="abrirModalEditarEjeUnidad({{ $unidad->id }}, '{{ $unidad->nombre }}', '{{ $unidad->titulo }}', {{ $unidad->numero_unidad }})">
                    ✏️
                </button>

                <button class="btn btn-outline-danger btn-sm ms-2"
                    style="width:45px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                    onclick="eliminarEjeUnidad({{ $unidad->id }})">
                    🗑️
                </button>
                @endif

                {{-- DROPDOWN --}}
                <ul class="dropdown-menu dropdown-menu-dark" style="min-width: 250px;">
                    
                    <li>
                        <h6 class="dropdown-header">{{ $unidad->titulo }}</h6>
                    </li>

                    @forelse($unidad->ejercicios ?? [] as $ejercicio)
                    <li>
                        <div class="d-flex justify-content-between align-items-center px-2">

                            <a class="dropdown-item mb-0 p-0"
                               href="/ejercicio/{{ $ejercicio->id }}">
                                {{ $ejercicio->nombre }}
                            </a>

                            @if($usuario_nivel === 'docente')
                            <div class="btn-group btn-sm ms-2">

                                <button class="btn btn-outline-warning btn-sm"
                                    style="width:30px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                    onclick="abrirModalEjercicio({{ $ejercicio->id }}, '{{ addslashes($ejercicio->nombre) }}', {{ $unidad->id }})">
                                    ✏️
                                </button>

                                <button class="btn btn-outline-danger btn-sm ms-2"
                                    style="width:30px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                    onclick="eliminarEjercicio({{ $ejercicio->id }})">
                                    🗑️
                                </button>

                            </div>
                            @endif

                        </div>
                    </li>
                    @empty
                    <li>
                        <span class="dropdown-item text-muted">No hay ejercicios</span>
                    </li>
                    @endforelse

                    @if($usuario_nivel === 'docente')
                    <li>
                        <button class="btn btn-sm btn-success w-100 mt-2"
                            onclick="abrirModalEjercicioNueva({{ $unidad->id }})">
                            + Nuevo Ejercicio
                        </button>
                    </li>
                    @endif

                </ul>

            </div>
            @endforeach

        </div>
    </div>
</div>


<!-- ================= MODAL UNIDAD ================= -->
<div class="modal fade" id="modalEjeUnidad" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">

            <div class="modal-header">
                <h5 class="modal-title">Unidad</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="formNuevaEjeUnidad">
                <input type="hidden" id="ejeUnidadId">

                <input type="text" id="nombreEjeUnidad"
                    class="form-control mb-2"
                    placeholder="Unidad 1" required>

                <input type="text" id="tituloEjeUnidad"
                    class="form-control mb-2"
                    placeholder="Título">

                <input type="number" id="numeroEjeUnidad"
                    class="form-control mb-2"
                    value="1">

                <button class="btn btn-primary w-100">Guardar</button>
            </form>

        </div>
    </div>
</div>


<!-- ================= MODAL EJERCICIO ================= -->
<div class="modal fade" id="modalEjercicio" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">

            <div class="modal-header">
                <h5 class="modal-title">Ejercicio</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form id="formNuevoEjercicio">
                <input type="hidden" id="ejercicioId">
                <input type="hidden" id="ejercicioUnidadId">

                <input type="text" id="nombreEjercicio"
                    class="form-control mb-2"
                    placeholder="Ej: 1.1 Números reales" required>

                <button class="btn btn-success w-100">Guardar</button>
            </form>

        </div>
    </div>
</div>