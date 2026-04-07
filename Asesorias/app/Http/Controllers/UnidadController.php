<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Unidad;

class UnidadController extends Controller
{
    public function store(Request $request, $materiaId)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'titulo' => 'nullable|string|max:255',
            'numero_unidad' => 'required|integer|min:1',
        ]);

        try {
            $unidad = Unidad::create([
                'nombre' => $request->nombre,
                'titulo' => $request->titulo,
                'id_materia' => $materiaId,
                'numero_unidad' => $request->numero_unidad,
                'orden' => $request->numero_unidad,
            ]);

            // ⚠️ Siempre devolver JSON
            return response()->json([
                'success' => true,
                'mensaje' => 'Unidad creada correctamente',
                'unidad' => $unidad
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'mensaje' => 'Error al guardar unidad: '.$e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request, $unidadId)
{
    $request->validate([
        'nombre' => 'required|string|max:150',
        'titulo' => 'nullable|string|max:255',
        'numero_unidad' => 'required|integer|min:1',
    ]);

    try {
        $unidad = Unidad::findOrFail($unidadId);

        $unidad->update([
            'nombre' => $request->nombre,
            'titulo' => $request->titulo,
            'numero_unidad' => $request->numero_unidad,
            'orden' => $request->numero_unidad,
        ]);

        return response()->json([
            'success' => true,
            'mensaje' => 'Unidad actualizada correctamente',
            'unidad' => $unidad
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'mensaje' => 'Error al actualizar unidad: '.$e->getMessage()
        ], 500);
    }
}
public function destroy($unidadId)
{
    try {
        $unidad = Unidad::findOrFail($unidadId);
        $unidad->delete();

        return response()->json([
            'success' => true,
            'mensaje' => 'Unidad eliminada correctamente'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'mensaje' => 'Error al eliminar unidad: '.$e->getMessage()
        ], 500);
    }
}

}