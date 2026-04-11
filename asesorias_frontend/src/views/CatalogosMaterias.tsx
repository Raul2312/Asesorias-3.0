import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Code2, Database, Globe, Sigma, Grid3X3, BarChart3, 
  Network, Server, Zap, Cpu, Briefcase, Atom, GraduationCap,
  Plus, Edit3, Trash2, X,
  type LucideIcon 
} from 'lucide-react';

// --- INTERFACES ---
type CategoryType = 'programacion' | 'matematicas' | 'redes' | 'electronica' | 'gestion' | 'ciencias';

interface Materia {
  id: number;
  nombre: string;
  codigo_materia: string;
  cat: CategoryType;
  sem: number;
  credits: number;
  iconName: string;
  user_id: number;
}

const catColors: Record<CategoryType, { bg: string; text: string }> = {
  programacion: { bg: "#F3E8FF", text: "#7C3AED" },
  matematicas:  { bg: "#FEF9C3", text: "#A16207" },
  redes:         { bg: "#E0E7FF", text: "#4338CA" },
  electronica:  { bg: "#DCFCE7", text: "#15803D" },
  gestion:      { bg: "#FFE4E6", text: "#BE123C" },
  ciencias:     { bg: "#E0F2FE", text: "#0369A1" },
};

const catLabels: Record<CategoryType, string> = { 
  programacion: "Programación", matematicas: "Matemáticas", 
  redes: "Redes", electronica: "Electrónica", 
  gestion: "Gestión", ciencias: "Ciencias" 
};

const iconMap: Record<string, LucideIcon> = {
  'code-2': Code2, 'database': Database, 'globe': Globe, 'sigma': Sigma,
  'grid-3x3': Grid3X3, 'bar-chart-3': BarChart3, 'network': Network,
  'server': Server, 'zap': Zap, 'cpu': Cpu, 'briefcase': Briefcase, 'atom': Atom
};

const CatalogoMaterias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [filtro, setFiltro] = useState<CategoryType | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- ESTADOS PARA EL MODAL Y FORMULARIO ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_materia: '',
    cat: 'programacion' as CategoryType,
    sem: 1,
    credits: 5,
    iconName: 'code-2'
  });
  
  const userNivel = localStorage.getItem("user_nivel") || "alumno"; 
  const currentUserId = Number(localStorage.getItem("user_id"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/materias');
      
      const materiasFormateadas = response.data.data.map((m: any) => ({
        ...m,
        cat: m.cat || 'programacion',
        sem: m.sem || 1,
        credits: m.credits || 5,
        iconName: m.iconName || 'database',
        user_id: m.user_id 
      }));

      setMaterias(materiasFormateadas);
    } catch (error) {
      console.error("Error al conectar con la base de datos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FUNCIÓN PARA GUARDAR LA NUEVA MATERIA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post('http://127.0.0.1:8000/api/materias', {
        ...formData,
        user_id: currentUserId // Mandamos quién la está creando
      }, {
        headers: { Authorization: `Bearer ${token}` } // Necesario si tu ruta en Laravel está protegida
      });
      
      alert("Materia agregada correctamente");
      setShowModal(false); // Cerramos el modal
      fetchData(); // Recargamos la lista de materias para que aparezca la nueva
      
      // Limpiamos el formulario
      setFormData({ nombre: '', codigo_materia: '', cat: 'programacion', sem: 1, credits: 5, iconName: 'code-2' });
    } catch (error) {
      console.error("Error guardando la materia", error);
      alert("Hubo un error al guardar la materia");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const materiasFiltradas = filtro === 'all' ? materias : materias.filter(m => m.cat === filtro);

  return (
    <>
      <style>{`
        .catalogo-container {
          font-family: 'Inter', sans-serif;
          background: #f8f9ff;
          min-height: 100vh;
          padding: 40px 20px;
        }
        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }
        .header-section h1 {
          font-size: 32px;
          font-weight: 800;
          color: #1E1B2E;
        }
        .filter-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .btn-filter {
          padding: 10px 20px;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          background: #f1f1f1;
          color: #666;
          transition: 0.3s;
        }
        .btn-filter.active {
          background: #7C3AED;
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }
        .grid-materias {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .card-materia {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          transition: 0.3s;
          border: 1px solid #eee;
          position: relative;
        }
        .card-materia:hover { transform: translateY(-10px); }
        .card-top {
          height: 140px;
          background: #7C3AED;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .card-body { padding: 20px; }
        .tag-cat {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .materia-title {
          font-size: 18px;
          font-weight: 700;
          margin: 15px 0;
          color: #1E1B2E;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #f5f5f5;
          padding-top: 15px;
          color: #999;
          font-size: 13px;
        }
        .creditos-badge {
          background: #7C3AED;
          color: white;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: bold;
        }
        .btn-add-materia {
          background: #FACC15;
          color: #000;
          padding: 12px 24px;
          border-radius: 15px;
          border: none;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto 30px auto;
          transition: 0.3s;
        }
        .btn-add-materia:hover { transform: scale(1.05); background: #eab308; }
        
        .admin-icons {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 8px;
          z-index: 5;
        }
        .icon-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 6px;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }
        .icon-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.4); }
        .icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* --- ESTILOS DEL MODAL --- */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
          position: relative;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        .modal-header h2 { margin: 0; font-size: 20px; color: #1E1B2E; }
        .close-btn { background: none; border: none; cursor: pointer; color: #999; }
        .close-btn:hover { color: #ef4444; }
        
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-size: 14px; font-weight: 600; color: #334155; }
        .form-input {
          width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px;
          font-family: inherit; font-size: 14px; outline: none; transition: 0.2s;
        }
        .form-input:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1); }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
        .btn-cancel { padding: 10px 20px; border-radius: 10px; border: none; background: #f1f5f9; color: #64748b; font-weight: 600; cursor: pointer; }
        .btn-cancel:hover { background: #e2e8f0; }
        .btn-save { padding: 10px 20px; border-radius: 10px; border: none; background: #7C3AED; color: white; font-weight: 600; cursor: pointer; }
        .btn-save:hover { background: #6D28D9; }
      `}</style>

      {/* --- MODAL PARA AGREGAR MATERIA --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Nueva Materia</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de la Materia</label>
                <input required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-input" placeholder="Ej. Programación Orientada a Objetos" />
              </div>
              
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Código</label>
                  <input required type="text" name="codigo_materia" value={formData.codigo_materia} onChange={handleInputChange} className="form-input" placeholder="Ej. POO-101" />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Categoría</label>
                  <select name="cat" value={formData.cat} onChange={handleInputChange} className="form-input">
                    {Object.keys(catLabels).map(key => (
                      <option key={key} value={key}>{catLabels[key as CategoryType]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Semestre</label>
                  <input required type="number" min="1" max="10" name="sem" value={formData.sem} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Créditos</label>
                  <input required type="number" min="1" max="10" name="credits" value={formData.credits} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Ícono Representativo</label>
                <select name="iconName" value={formData.iconName} onChange={handleInputChange} className="form-input">
                  <option value="code-2">Código (Programación)</option>
                  <option value="database">Base de Datos</option>
                  <option value="network">Redes</option>
                  <option value="cpu">Microprocesador / Hardware</option>
                  <option value="sigma">Matemáticas (Sigma)</option>
                  <option value="briefcase">Negocios / Gestión</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar Materia</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="catalogo-container">
        <div className="header-section">
          <h1>Explorar Materias</h1>
          <p>Catálogo de la Ingeniería en Sistemas</p>
        </div>

        {/* BOTÓN CON ACCIÓN PARA ABRIR MODAL */}
        {userNivel === "docente" && (
          <button className="btn-add-materia" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Nueva Materia
          </button>
        )}

        <div className="filter-bar">
          <button 
            className={`btn-filter ${filtro === 'all' ? 'active' : ''}`}
            onClick={() => setFiltro('all')}
          >Todas</button>
          {(Object.keys(catLabels) as CategoryType[]).map(cat => (
            <button 
              key={cat}
              className={`btn-filter ${filtro === cat ? 'active' : ''}`}
              onClick={() => setFiltro(cat)}
            >
              {catLabels[cat]}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{textAlign: 'center'}}>Cargando desde la base de datos...</p>
        ) : (
          <div className="grid-materias">
            {materiasFiltradas.map(m => {
              const Icon = iconMap[m.iconName] || Code2;
              const color = catColors[m.cat] || catColors.programacion;
              
              const esMateriaPropia = m.user_id === currentUserId;

              return (
                <div key={m.id} className="card-materia">
                  {userNivel === "docente" && (
                    <div className="admin-icons">
                      <button 
                        className="icon-btn" 
                        disabled={!esMateriaPropia}
                      >
                        <Edit3 size={14}/>
                      </button>
                      <button 
                        className="icon-btn" 
                        style={{color: esMateriaPropia ? '#f87171' : 'white'}}
                        disabled={!esMateriaPropia}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  )}

                  <div className="card-top">
                    <Icon size={40} />
                  </div>
                  <div className="card-body">
                    <span className="tag-cat" style={{background: color.bg, color: color.text}}>
                      {m.codigo_materia}
                    </span>
                    <h3 className="materia-title">{m.nombre}</h3>
                    <div className="card-footer">
                      <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <GraduationCap size={16}/> Sem {m.sem}
                      </span>
                      <div className="creditos-badge">{m.credits}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CatalogoMaterias;