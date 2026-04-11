import React, { useState } from 'react';
import '../css/home.css';

interface Course {
  id: number;
  name: string;
  desc: string;
  hours: number;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  icon: string;
  gradient: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'HTML5 y CSS3 Moderno', desc: 'Aprende a construir sitios web semánticos y responsivos...', hours: 40, level: 'Básico', icon: 'code-2', gradient: 'linear-gradient(135deg, #7B1FA2, #E040FB)' },
    { id: 2, name: 'JavaScript ES6+', desc: 'Domina el lenguaje de la web con funciones avanzadas...', hours: 60, level: 'Intermedio', icon: 'terminal', gradient: 'linear-gradient(135deg, #4A148C, #7B1FA2)' },
    { id: 3, name: 'React.js Fundamentos', desc: 'Construye interfaces de usuario dinámicas...', hours: 50, level: 'Intermedio', icon: 'atom', gradient: 'linear-gradient(135deg, #9C27B0, #CE93D8)' },
    { id: 4, name: 'Node.js y Express', desc: 'Desarrolla APIs RESTful robustas y escalables...', hours: 55, level: 'Avanzado', icon: 'server', gradient: 'linear-gradient(135deg, #4A148C, #9C27B0)' },
    { id: 5, name: 'Bases de Datos SQL', desc: 'Diseña y gestiona bases de datos relacionales...', hours: 45, level: 'Básico', icon: 'database', gradient: 'linear-gradient(135deg, #7B1FA2, #4A148C)' },
    { id: 6, name: 'Git y DevOps', desc: 'Control de versiones, CI/CD, contenedores Docker...', hours: 35, level: 'Intermedio', icon: 'git-branch', gradient: 'linear-gradient(135deg, #9C27B0, #E040FB)' }
  ]);

  const [activeTab, setActiveTab] = useState('cursos');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', desc: '', hours: 40, level: 'Básico' });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setCourses([...courses, {
  id: courses.length + 1,
  name: formData.name,
  desc: formData.desc,
  hours: formData.hours,
  level: formData.level as 'Básico' | 'Intermedio' | 'Avanzado',
  icon: ['book-open', 'cpu', 'monitor'][Math.floor(Math.random() * 3)],
  gradient: ['linear-gradient(135deg, #7B1FA2, #E040FB)', 'linear-gradient(135deg, #4A148C, #7B1FA2)'][Math.floor(Math.random() * 2)]
}]);
    setShowModal(false);
    setFormData({ name: '', desc: '', hours: 40, level: 'Básico' });
  };

  return (
    <div className="app">
      <header>
        <div className="header-container">
          <div className="header-top">
            <div className="header-content">
              <div className="header-badge">
                <div className="header-badge-icon">📚</div>
                <span className="header-badge-text">Tecnológico</span>
              </div>
              <h1 className="subject-name">Desarrollo Web</h1>
              <p className="page-subtitle">Cursos disponibles para esta materia</p>
            </div>
            <button className="btn-add" onClick={() => setShowModal(true)}>+ Agregar Curso</button>
          </div>
          <div className="stats-bar">
            <div className="stat-item">📊 {courses.length} cursos</div>
            <div className="stat-item">📅 Semestre 2025-A</div>
          </div>
        </div>
        <svg viewBox="0 0 1440 60" className="wave-divider">
          <path fill="#ffffff" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </header>

      <div className="tabs-container">
        <div className="tabs-wrapper">
          {['cursos', 'ejercicios', 'proyectos', 'recursos'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main>
        {activeTab === 'cursos' && (
          <div className="courses-grid">
            {courses.map((course, i) => (
              <div key={course.id} className="course-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="course-img" style={{ background: course.gradient }}>
                  <span>{course.icon}</span>
                </div>
                <div className="course-content">
                  <div className="course-header">
                    <span className="course-level">{course.level}</span>
                    <span className="course-hours">⏱️ {course.hours}h</span>
                  </div>
                  <h3 className="course-title">{course.name}</h3>
                  <p className="course-desc">{course.desc}</p>
                  <button className="course-link">Ver detalles →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ejercicios' && <EmptyState icon="✏️" title="Ejercicios Prácticos" />}
        {activeTab === 'proyectos' && <EmptyState icon="📁" title="Proyectos" />}
        {activeTab === 'recursos' && <EmptyState icon="⬇️" title="Recursos de Apoyo" />}
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Curso</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCourse}>
              <div className="form-group">
                <label>Nombre del curso</label>
                <input required placeholder="Ej: React Avanzado" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea required rows={3} placeholder="Breve descripción..." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
              </div>
              <div className="form-group two-col">
                <input type="number" min="1" value={formData.hours} onChange={e => setFormData({...formData, hours: parseInt(e.target.value)})} />
                <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value as any})}>
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
              <button type="submit" className="form-submit">Agregar Curso</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title }: { icon: string; title: string }) {
  return <div style={{ textAlign: 'center', padding: '60px 24px' }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
    <h2 style={{ fontSize: '24px', color: '#4A148C', marginBottom: '8px' }}>{title}</h2>
    <p style={{ color: '#999' }}>Contenido próximamente...</p>
  </div>;
}