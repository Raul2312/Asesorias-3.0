import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Check, X as CloseIcon, BookOpen, ChevronRight, Home as HomeIcon } from 'lucide-react'; 
import '../css/home.css';

// --- Interfaces ---
interface Course {
  id: number;
  nombre: string;
  titulo: string;
  numero_unidad: number;
}

export default function Home() {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  // Datos del estado de navegación
  const nombreMateria = location.state?.nombreMateria || "Detalles de Materia";
  const unidadSeleccionada = location.state?.unidadSeleccionada || null; // Para nivel "Temas"

  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState('Unidades ');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    titulo: '', 
    numero_unidad: 1 
  });

  const [descripcion, setDescripcion] = useState<string>('Cargando descripción...');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescValue, setEditDescValue] = useState('');

  const userNivel = localStorage.getItem("user_nivel") || "alumno"; 
  const token = localStorage.getItem("token");

  // --- Lógica de Carga ---
  const fetchData = async () => {
    try {
      const resDesc = await axios.get(`http://127.0.0.1:8000/api/descripcion-materia/${id}`);
      if (resDesc.data.success) {
        setDescripcion(resDesc.data.data.descripcion);
        setEditDescValue(resDesc.data.data.descripcion);
      }

      const resUnidades = await axios.get(`http://127.0.0.1:8000/api/unidades/materia/${id}`);
      const unidadesData = resUnidades.data.success ? resUnidades.data.data : resUnidades.data;
      setCourses(Array.isArray(unidadesData) ? unidadesData : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setDescripcion("Materia sin descripción técnica.");
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/unidades/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCourses([...courses, response.data.data]);
        setShowModal(false);
        setFormData({ nombre: '', titulo: '', numero_unidad: courses.length + 2 });
      }
    } catch (error) {
      alert("Error al guardar la unidad");
    }
  };

  const saveDescription = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/descripcion-materia', {
        id_materia: id,
        descripcion: editDescValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDescripcion(editDescValue);
      setIsEditingDesc(false);
    } catch (error) {
      alert("Error al actualizar la descripción");
    }
  };

  return (
    <div className="app">
      <header>
        <div className="header-container">
          <div className="header-top">
            <div className="header-content">
              <div className="header-badge">
                <div className="header-badge-icon">📚</div>
                <span className="header-badge-text">ID: {id}</span>
              </div>
              <h1 className="subject-name">{nombreMateria}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                {isEditingDesc ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      className="form-input" 
                      style={{ margin: 0, padding: '5px 12px', background: 'white', color: 'black', width: '300px' }} 
                      value={editDescValue} 
                      onChange={(e) => setEditDescValue(e.target.value)}
                    />
                    <button onClick={saveDescription} style={{ background: '#22c55e', border: 'none', borderRadius: '8px', padding: '5px 10px', color: 'white', cursor: 'pointer' }}><Check size={16}/></button>
                    <button onClick={() => setIsEditingDesc(false)} style={{ background: '#ef4444', border: 'none', borderRadius: '8px', padding: '5px 10px', color: 'white', cursor: 'pointer' }}><CloseIcon size={16}/></button>
                  </div>
                ) : (
                  <>
                    <p className="page-subtitle" style={{ margin: 0 }}>{descripcion}</p>
                    {userNivel === "docente" && <Pencil size={14} style={{ cursor: 'pointer', color: 'white', opacity: 0.7 }} onClick={() => setIsEditingDesc(true)} />}
                  </>
                )}
              </div>
            </div>
            {userNivel === "docente" && (
              <button className="btn-add" onClick={() => setShowModal(true)}>+ Agregar Unidad</button>
            )}
          </div>
          <div className="stats-bar">
            <div className="stat-item">📊 {courses.length} Unidades registradas</div>
            <div className="stat-item">📅 Ciclo Escolar 2026</div>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" className="wave-divider">
          <path fill="#ffffff" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </header>

      <div className="tabs-container">
        <div className="tabs-wrapper">
          {['Unidades ', 'ejercicios', 'proyectos', 'recursos'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <nav aria-label="breadcrumb" style={{ maxWidth: '1200px', margin: '20px auto 0', padding: '0 24px' }}>
        <ol className="breadcrumb" style={{ 
          background: '#f8f9fa', 
          padding: '12px 20px', 
          borderRadius: '12px', 
          display: 'flex', 
          listStyle: 'none',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          border: '1px solid #e9ecef'
        }}>
          <li className="breadcrumb-item">
            <button 
              onClick={() => navigate('/materias')} 
              style={{ background: 'none', border: 'none', color: '#1e1e4a', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <HomeIcon size={14} /> Materias
            </button>
          </li>
          
          <li className="breadcrumb-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
            <ChevronRight size={14} />
            <button 
               onClick={() => navigate(`/materia/${id}`, { state: { nombreMateria } })}
               style={{ background: 'none', border: 'none', color: unidadSeleccionada ? '#1e1e4a' : '#6c757d', fontWeight: unidadSeleccionada ? '600' : '400', cursor: 'pointer' }}
            >
              {nombreMateria}
            </button>
          </li>

          {activeTab === 'Unidades ' && (
             <li className="breadcrumb-item active" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
              <ChevronRight size={14} />
              <span>Unidades</span>
            </li>
          )}
        </ol>
      </nav>

      <main>
        {activeTab === 'Unidades ' && (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course, i) => (
                <div key={course.id} className="course-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="course-img" style={{ background: 'linear-gradient(135deg, #1e1e4a, #3b3b8c)' }}>
                    <span><BookOpen size={32} color="white" /></span>
                  </div>
                  <div className="course-content">
                    <div className="course-header">
                      <span className="course-level">Unidad {course.numero_unidad}</span>
                    </div>
                    <h3 className="course-title">{course.nombre}</h3>
                    <p className="course-desc">{course.titulo || 'Sin descripción adicional'}</p>
                    <button className="course-link" onClick={() => {
                        navigate(`/materia/${id}/unidad/${course.id}`, { 
                          state: { nombreMateria, nombreUnidad: course.nombre, numeroUnidad: course.numero_unidad } 
                        });
                    }}>
                      Explorar Unidad →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#666' }}>
                No hay unidades registradas para esta materia.
              </div>
            )}
          </div>
        )}
        {activeTab !== 'Unidades ' && <EmptyState icon="✏️" title={activeTab} />}
      </main>

      {showModal && (
        <div className="modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', position: 'fixed', top:0, left:0, width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '40px', 
            width: '100%', 
            maxWidth: '550px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)} 
              style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', cursor: 'pointer', color: '#1e1e4a' }}
            >
              <CloseIcon size={24} />
            </button>

            <h2 style={{ color: '#1e1e4a', fontSize: '28px', fontWeight: '800', marginBottom: '32px', marginTop: 0 }}>
              Nueva Unidad
            </h2>
            
            <form onSubmit={handleAddCourse}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ color: '#1e1e4a', display: 'block', marginBottom: '12px', fontWeight: '700' }}>
                  Nombre de la unidad
                </label>
                <input 
                  required 
                  placeholder="Ej. Estructura de Datos"
                  className="form-input" 
                  style={{ 
                    background: 'white', 
                    border: '1px solid #d1d5db', 
                    color: '#374151', 
                    width: '100%', 
                    borderRadius: '12px',
                    padding: '14px 20px',
                    fontSize: '16px'
                  }}
                  value={formData.nombre} 
                  onChange={e => setFormData({...formData, nombre: e.target.value})} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ color: '#1e1e4a', display: 'block', marginBottom: '12px', fontWeight: '700' }}>
                    Descripción corta
                  </label>
                  <input 
                    placeholder="Ej. Conceptos básicos"
                    className="form-input" 
                    style={{ 
                      background: 'white', 
                      border: '1px solid #d1d5db', 
                      color: '#374151', 
                      width: '100%', 
                      borderRadius: '12px',
                      padding: '14px 20px'
                    }}
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                  />
                </div>
                <div>
                  <label style={{ color: '#1e1e4a', display: 'block', marginBottom: '12px', fontWeight: '700' }}>
                    Nº Unidad
                  </label>
                  <input 
                    type="number"
                    required 
                    className="form-input" 
                    style={{ 
                      background: 'white', 
                      border: '1px solid #d1d5db', 
                      color: '#374151', 
                      width: '100%', 
                      borderRadius: '12px',
                      padding: '14px 20px'
                    }}
                    value={formData.numero_unidad} 
                    onChange={e => setFormData({...formData, numero_unidad: parseInt(e.target.value) || 1})} 
                  />
                </div>
              </div>

              <button type="submit" style={{ 
                background: '#1e1e4a', 
                color: 'white', 
                border: 'none', 
                padding: '16px', 
                borderRadius: '16px', 
                cursor: 'pointer', 
                width: '100%', 
                fontWeight: '700',
                fontSize: '18px',
                transition: 'transform 0.2s'
              }}>
                Registrar Unidad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title }: { icon: string; title: string }) {
  return <div style={{ textAlign: 'center', padding: '80px 24px' }}>
    <div style={{ fontSize: '50px', marginBottom: '15px' }}>{icon}</div>
    <h2 style={{ color: '#1e1e4a', marginBottom: '10px' }}>{title}</h2>
    <p style={{ color: '#666' }}>El material para esta sección aún no ha sido cargado.</p>
  </div>;
}