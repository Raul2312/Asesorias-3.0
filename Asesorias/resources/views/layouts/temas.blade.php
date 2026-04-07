<div id="temarioApp" data-materia-id="{{ $materia?->id ?? 0 }}" class="card shadow-sm mt-4 rounded-lg"
    style="background-color:#711092; color:white;">
    <div class="card-body">
        <h5 class="card-title text-center">Temario</h5>

        @if($usuario_nivel === 'docente')
        <button class="btn btn-primary w-100 mb-3" onclick="abrirModalUnidad()">+ Nueva Unidad</button>
        @endif

        <div id="unidadesContainer">
            @foreach($materia->unidades ?? [] as $unidad)
            <div class="btn-group dropend mt-3 w-100" data-unidad-id="{{ $unidad?->id ?? 0 }}">
                <button type="button" class="btn btn-light w-100 text-start dropdown-toggle rounded"
                    data-bs-toggle="dropdown">
                    {{ $unidad?->nombre ?? 'Unidad sin nombre' }}
                </button>
                @if($usuario_nivel === 'docente')
                <button class="btn btn-outline-warning btn-sm ms-2" 
                        style="width:45px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;" 
                        onclick="abrirModalEditarUnidad({{ $unidad->id }}, '{{ $unidad->nombre }}', '{{ $unidad->titulo }}', {{ $unidad->numero_unidad }})">
                    ✏️
                </button>
                <button class="btn btn-outline-danger btn-sm ms-2" 
                        style="width:45px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;" 
                        onclick="eliminarUnidad({{ $unidad->id }})">
                    🗑️
                </button>
                @endif
                <ul class="dropdown-menu dropdown-menu-dark" style="min-width: 250px;">
                    <li>
                        <h6 class="dropdown-header">{{ $unidad?->titulo ?? '' }}</h6>
                    </li>

                   @forelse($unidad->subtemas ?? [] as $subtema)
                        <li>
                            <div class="d-flex justify-content-between align-items-center px-2">
                                <a class="dropdown-item mb-0 p-0" href="{{ route('subtemas.show', $subtema?->id ?? 0) }}" data-subtema-id="{{ $subtema->id }}">
                                    {{ $subtema?->nombre ?? 'Subtema sin nombre' }}
                                </a>
                                @if($usuario_nivel === 'docente')
                                <div class="btn-group btn-sm ms-2">
                                    <button class="btn btn-outline-warning btn-sm" 
                                            style="width:30px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                            onclick="abrirModalEditarSubtema({{ $subtema->id }}, '{{ $subtema->nombre }}', {{ $unidad->id }})">
                                        ✏️
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm ms-2" 
                                            style="width:30px; height:30px; padding:0; display:flex; align-items:center; justify-content:center; border-radius: 10px;"
                                            onclick="eliminarSubtema({{ $subtema->id }})">
                                        🗑️
                                    </button>
                                </div>
                                @endif
                            </div>
                        </li>
                        @empty
                        <li><span class="dropdown-item text-muted">No hay subtemas aún</span></li>
                    @endforelse

                    @if($usuario_nivel === 'docente')
                    <li>
                        <button class="btn btn-sm btn-success w-100 mt-2"
                            onclick="abrirModalSubtema({{ $unidad?->id ?? 0 }})">+ Nuevo Subtema</button>
                    </li>
                    @endif
                </ul>
            </div>
            @endforeach
        </div>
    </div>
</div>

{{-- Modal Unidad --}}
<div class="modal fade" id="modalUnidad" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h5 class="modal-title">Nueva Unidad</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevaUnidad">
                    @csrf
                    <input type="hidden" id="unidadId" name="unidadId" />
                    <input type="text" name="nombre" id="nombreUnidad" placeholder="Unidad(1,2,3....etc)" class="form-control mb-2"
                        required />
                    <input type="text" name="titulo" id="tituloUnidad" placeholder="Título" class="form-control mb-2" />
                    <input type="number" name="numero_unidad" id="numeroUnidad" placeholder="Número de unidad" class="form-control mb-2"
                        min="1" value="1" required />
                    <button type="submit" id="btnGuardarUnidad" class="btn btn-primary w-100">Guardar</button>
                </form>
                <div id="mensajeUnidad" class="mt-2 text-success"></div>
            </div>
        </div>
    </div>
</div>

{{-- Modal Subtema --}}
<div class="modal fade" id="modalSubtema" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Subtema</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formNuevoSubtema">
                    @csrf
                    <input type="hidden" name="id_unidad" id="subtemaUnidadId">
                    <input type="text" name="nombre" placeholder="Numero y Nombre del subtema" class="form-control mb-2"
                        required />
                    <button type="submit" class="btn btn-success w-100">Guardar</button>
                </form>
                <div id="mensajeSubtema" class="mt-2 text-success"></div>
            </div>
        </div>
    </div>
</div>
