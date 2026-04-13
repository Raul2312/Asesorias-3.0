import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, Database, Globe, Sigma, Grid3X3, BarChart3, 
  Network, Server, Zap, Cpu, Briefcase, Atom,
  Plus, X, Search, Layers, Pencil, Trash2 
} from 'lucide-react';

// --- TIPOS ---
type CategoryType = 'programacion' | 'matematicas' | 'redes' | 'electronica' | 'gestion' | 'ciencias';

interface Materia {
  id: number;
  nombre: string;
  codigo_materia: string;
  cat: CategoryType;
  sem: number;
  iconName: string;
  id_users: number;
}

const catColors: Record<CategoryType, { bg: string; text: string; light: string }> = {
  programacion: { bg: "#7C3AED", text: "#7C3AED", light: "#F3E8FF" },
  matematicas:  { bg: "#EAB308", text: "#A16207", light: "#FEF9C3" },
  redes:         { bg: "#4338CA", text: "#4338CA", light: "#E0E7FF" },
  electronica:  { bg: "#15803D", text: "#15803D", light: "#DCFCE7" },
  gestion:      { bg: "#BE123C", text: "#BE123C", light: "#FFE4E6" },
  ciencias:     { bg: "#0369A1", text: "#0369A1", light: "#E0F2FE" },
};

const catLabels: Record<CategoryType, string> = { 
  programacion: "Programación", 
  matematicas: "Matemáticas", 
  redes: "Redes", 
  electronica: "Electrónica", 
  gestion: "Gestión", 
  ciencias: "Ciencias" 
};

const iconMap: Record<string, any> = {
  'code-2': Code2, 'database': Database, 'globe': Globe, 'sigma': Sigma,
  'grid-3x3': Grid3X3, 'bar-chart-3': BarChart3, 'network': Network,
  'server': Server, 'zap': Zap, 'cpu': Cpu, 'briefcase': Briefcase, 'atom': Atom
};

const CatalogoMaterias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [filtro, setFiltro] = useState<CategoryType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal y Formulario
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo_materia: '', 
    cat: 'programacion' as CategoryType,
    sem: 1,
    iconName: 'code-2'
  });

  const navigate = useNavigate();
  const userNivel = localStorage.getItem("user_nivel") || "alumno"; 
  const userStorageId = Number(localStorage.getItem("user_id"));

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/materias');
      setMaterias(response.data.data);
    } catch (error) {
      console.error("Error al cargar materias", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Abrir modal para crear
  const handleCreateNew = () => {
    setIsEditing(false);
    setFormData({ nombre: '', codigo_materia: '', cat: 'programacion', sem: 1, iconName: 'code-2' });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (e: React.MouseEvent, materia: Materia) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentId(materia.id);
    setFormData({
      nombre: materia.nombre,
      codigo_materia: materia.codigo_materia,
      cat: materia.cat,
      sem: materia.sem,
      iconName: materia.iconName
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const dataToSend = { ...formData, id_users: userStorageId, estatus: 1 };

      if (isEditing && currentId) {
        await axios.put(`http://127.0.0.1:8000/api/materias/${currentId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("¡Materia actualizada!");
      } else {
        await axios.post('http://127.0.0.1:8000/api/materias', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("¡Materia registrada!");
      }
      
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      alert("Error en la operación: " + (error.response?.data?.message || "Error desconocido"));
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de que quieres eliminar esta materia?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://127.0.0.1:8000/api/materias/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id_users: userStorageId }
        });
        alert("Materia eliminada");
        fetchData();
      } catch (error) {
        alert("No tienes permiso o hubo un error");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const materiasFiltradas = materias.filter(m => {
    const cumpleFiltro = filtro === 'all' || m.cat === filtro;
    const cumpleSearch = m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.codigo_materia.toLowerCase().includes(searchTerm.toLowerCase());
    return cumpleFiltro && cumpleSearch;
  });

  return (
    <div className="catalogo-wrapper">
      <style>{`
        .catalogo-wrapper { font-family: 'Inter', sans-serif; background: #f0f2f9; min-height: 100vh; color: #1a1c2e; }
        .top-banner { background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 60px 20px; text-align: center; color: white; }
        .top-banner h1 { font-size: 38px; font-weight: 800; margin-bottom: 10px; }
        .container-main { max-width: 1200px; margin: -30px auto 0; padding: 0 20px 60px; }
        .tools-card { background: white; border-radius: 20px; padding: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .search-box { position: relative; flex: 1; margin-bottom: 20px; }
        .search-box input { width: 100%; padding: 15px 45px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; background: white; color: black; }
        .search-icon { position: absolute; left: 15px; top: 15px; color: #94a3b8; }
        .filters-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .btn-filter { padding: 8px 18px; border-radius: 10px; border: none; background: #f1f5f9; color: #64748b; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-filter.active { background: #7C3AED; color: white; }
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
        .card-materia { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #eef2f6; position: relative; transition: 0.3s; cursor: pointer; }
        .card-materia:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.08); }
        .card-visual { height: 120px; display: flex; align-items: center; justify-content: center; color: white; }
        .card-body { padding: 20px; }
        .materia-title { font-size: 19px; font-weight: 700; color: #1e293b; margin: 12px 0; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-content { background: white; width: 95%; max-width: 500px; border-radius: 24px; padding: 30px; animation: scaleIn 0.3s ease; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .form-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; margin-top: 5px; outline: none; background: white; color: black; }
        .btn-primary { background: #1e1b4b; color: white; padding: 14px 28px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; width: 100%; margin-top: 20px; }
        .card-actions { display: flex; gap: 8px; margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
        .btn-action { flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 8px; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; }
        .btn-edit { background: #eef2ff; color: #4338ca; }
        .btn-delete { background: #fee2e2; color: #b91c1c; }
        .btn-action:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }
      `}</style>

      <div className="top-banner"><h1>Catálogo Académico</h1></div>
      <div className="container-main">
        <div className="tools-card">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Buscar materia..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
            <div className="filters-row">
              <button className={`btn-filter ${filtro === 'all' ? 'active' : ''}`} onClick={() => setFiltro('all')}>Todas</button>
              {(Object.keys(catLabels) as CategoryType[]).map(cat => (
                <button key={cat} className={`btn-filter ${filtro === cat ? 'active' : ''}`} onClick={() => setFiltro(cat)}>{catLabels[cat]}</button>
              ))}
            </div>
            {userNivel === "docente" && (
              <button className="btn-filter active" style={{background: '#FACC15', color: '#000'}} onClick={handleCreateNew}>
                <Plus size={18} /> Nueva Materia
              </button>
            )}
          </div>
        </div>

        <div className="grid-layout">
          {materiasFiltradas.map(m => {
            const Icon = iconMap[m.iconName] || Code2;
            const theme = catColors[m.cat] || catColors.programacion;
            const isOwner = userNivel === "docente" && userStorageId === m.id_users;

            return (
              <div key={m.id} className="card-materia" onClick={() => navigate(`/materia/${m.id}`, { state: { nombreMateria: m.nombre } })}>
                <div className="card-visual" style={{background: theme.bg}}><Icon size={45} /></div>
                <div className="card-body">
                  <span style={{fontSize: '11px', fontWeight: 800, color: theme.text, background: theme.light, padding: '4px 10px', borderRadius: '6px'}}>{m.codigo_materia}</span>
                  <h3 className="materia-title">{m.nombre}</h3>
                  <span style={{fontSize: '13px', color: '#64748b'}}><Layers size={14}/> Semestre {m.sem}</span>

                  {userNivel === "docente" && (
                    <div className="card-actions">
                      <button className="btn-action btn-edit" disabled={!isOwner} onClick={(e) => handleEdit(e, m)}>
                        <Pencil size={12} /> Editar
                      </button>
                      <button className="btn-action btn-delete" disabled={!isOwner} onClick={(e) => handleDelete(e, m.id)}>
                        <Trash2 size={12} /> Borrar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
              <h2 style={{fontWeight: 800, color: '#1e1b4b'}}>{isEditing ? 'Editar Asignatura' : 'Nueva Asignatura'}</h2>
              <X onClick={() => setShowModal(false)} style={{cursor: 'pointer', color: '#1e1b4b'}} />
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{fontSize: '13px', fontWeight: 600, color: '#1e1b4b'}}>Nombre de la materia</label>
                <input required name="nombre" value={formData.nombre} onChange={handleInputChange} className="form-input" placeholder="Ej. Estructura de Datos" />
              </div>
              
              <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', fontWeight: 600, color: '#1e1b4b'}}>Código</label>
                  <input required name="codigo_materia" value={formData.codigo_materia} onChange={handleInputChange} className="form-input" placeholder="ED-101" />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', fontWeight: 600, color: '#1e1b4b'}}>Semestre</label>
                  <input type="number" name="sem" min="1" value={formData.sem} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', fontWeight: 600, color: '#1e1b4b'}}>Categoría</label>
                  <select name="cat" value={formData.cat} onChange={handleInputChange} className="form-input">
                    {(Object.keys(catLabels) as CategoryType[]).map(k => (
                      <option key={k} value={k}>{catLabels[k]}</option>
                    ))}
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '13px', fontWeight: 600, color: '#1e1b4b'}}>Ícono</label>
                  <select name="iconName" value={formData.iconName} onChange={handleInputChange} className="form-input">
                    <option value="code-2">💻 Código</option>
                    <option value="cpu">🔌 Hardware</option>
                    <option value="database">🗄️ Datos</option>
                    <option value="network">🌐 Redes</option>
                    <option value="sigma">🧮 Matemáticas</option>
                    <option value="zap">⚡ Energía</option>
                    <option value="globe">🌍 Web</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                {isEditing ? 'Guardar Cambios' : 'Registrar Materia'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoMaterias;