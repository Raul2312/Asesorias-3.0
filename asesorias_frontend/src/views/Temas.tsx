import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Layers, Plus, Trash2, BookOpen, Save, X, Minimize2,
  GraduationCap, Palette, Calendar, Inbox, ChevronLeft, Type,
  ImageIcon, List, LinkIcon
} from 'lucide-react';
import '../css/temas_tecnologico.css'; // Importa el CSS que acabamos de crear

// --- Interfaces ---
interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'list' | 'link';
  value: string;
}

interface Subtopic {
  name: string;
  desc: string;
  content: ContentBlock[];
}

interface Topic {
  title: string;
  subs: Subtopic[];
}

export default function Temas() {
  const { id, unidadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recuperados de la URL/Estado
  const nombreMateria = location.state?.nombreMateria || "Arquitectura de Computadoras";
  const nombreUnidad = location.state?.nombreUnidad || `Unidad ${unidadId}`;

  // Estados
  const [topics, setTopics] = useState<Topic[]>([
    { 
      title: "Modelos de Arquitectura", 
      subs: [
        { 
          name: "Modelo Von Neumann", 
          desc: "Arquitectura clásica con una única línea de almacenamiento.", 
          content: [
            { id: '1', type: 'text', value: "Basada en la propuesta de John von Neumann en 1945." }
          ] 
        }
      ] 
    }
  ]);
  const [currentTopicIdx, setCurrentTopicIdx] = useState<number | null>(null);
  const [editingSub, setEditingSub] = useState<{t: number, s: number} | null>(null);

  // --- Renderizado del Header idéntico ---
  const renderHeader = () => (
    <header className="main-header" id="headerElement">
      <div className="deco-circle-1"></div>
      <div className="deco-polygon"></div>
      <div className="deco-circle-2"></div>
      
      <div className="header-container-safe">
        <div className="header-flex">
          <div className="header-left-content">
            <div className="badge-group">
              <div className="badge-icon-box">
                <GraduationCap size={28} color="white" />
              </div>
              <div className="badge-text-box">
                <span>Educación de Clase</span>
                <span>Nivel Avanzado</span>
              </div>
            </div>
            <h1 className="main-title-text" id="mainTitle">Instituto Tecnológico</h1>
            <p className="subtitle-text" id="subtitle">{nombreMateria}</p>
          </div>
          
          <div className="header-stats-group">
            <div className="stat-pill">
              <div className="stat-pill-icon"><Layers size={16} /></div>
              <div className="stat-pill-text">
                <span id="topicCount">{topics.length} temas</span>
              </div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-icon"><Calendar size={16} /></div>
              <div className="stat-pill-text"><span>2025-A</span></div>
            </div>
          </div>
        </div>
      </div>
      
      <svg viewBox="0 0 1440 100" className="wave-divider-svg">
        <path fill="#F9F8FB" d="M0,50 Q360,10 720,50 T1440,50 L1440,100 L0,100 Z" />
      </svg>
    </header>
  );

  return (
    <div className="temas-v2-wrapper">
      {renderHeader()}

      <main className="main-content-area">
        <div className="content-grid-layout">
          
          {/* SIDEBAR DE TEMAS */}
          <aside className="sidebar-col">
            <div className="sidebar-card">
              <div className="sidebar-header-gradient">
                <h2><Layers size={22} /> Temas</h2>
              </div>
              <div className="topic-list-container" id="topicList">
                {topics.map((topic, ti) => (
                  <div 
                    key={ti} 
                    className={`topic-item ${currentTopicIdx === ti ? 'active' : ''}`}
                    onClick={() => setCurrentTopicIdx(ti)}
                  >
                    <div className="topic-item-title">{topic.title}</div>
                    <div className="topic-item-subtitle">{topic.subs.length} temas</div>
                  </div>
                ))}
              </div>
              <div className="sidebar-footer-action">
                <button className="btn-add-main-topic" onClick={() => {/* Agregar Tema */}}>
                  <Plus size={18} /> Agregar Tema
                </button>
              </div>
            </div>
          </aside>

          {/* COLUMNA PRINCIPAL */}
          <section className="main-col main-col-content">
            {currentTopicIdx !== null ? (
              <>
                <div className="info-header-card">
                  <div className="info-header-content">
                    <h2 className="info-header-title">{topics[currentTopicIdx].title}</h2>
                    <p className="info-header-subtitle">{topics[currentTopicIdx].subs.length} subtema(s)</p>
                  </div>
                </div>

                <div className="subtopics-grid">
                  {topics[currentTopicIdx].subs.map((sub, si) => (
                    <div key={si} className="subtopic-card" onClick={() => setEditingSub({t: currentTopicIdx, s: si})}>
                      <div className="subtopic-card-header">
                        <span className="subtopic-number-badge">{si + 1}</span>
                      </div>
                      <h3 className="subtopic-title-text">{sub.name}</h3>
                      <p className="subtopic-desc-text">{sub.desc}</p>
                    </div>
                  ))}
                  
                  {/* Botón Nuevo Subtema (Estilo idéntico) */}
                  <div className="subtopic-card flex flex-col items-center justify-center text-center text-purple-200 border-2 border-dashed border-purple-100 hover:border-purple-300 hover:text-purple-400" onClick={() => {/* Agregar Subtema */}}>
                    <Plus size={40} />
                    <span className="font-bold text-sm mt-2">Nuevo Subtema</span>
                  </div>
                </div>

                <div className="action-buttons-group">
                  <button className="btn-add-subtopic">+ Agregar Subtema</button>
                  <button className="btn-delete-topic"><Trash2 size={18} /> Eliminar Tema</button>
                </div>
              </>
            ) : (
              <div className="empty-state-card">
                <BookOpen className="empty-state-icon" />
                <p className="empty-state-text">Selecciona un tema para comenzar</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* EDITOR ESTILO WORD (MODAL FULLSCREEN) */}
      {editingSub && (
        <div className="modal-overlay active" style={{overflowY: 'auto'}}>
          <div className="fullscreen-editor-modal">
            <header className="editor-header-full sticky top-0 z-10">
              <div className="editor-header-top-row">
                <div>
                  <h2 className="editor-header-title-text">Editor: {topics[editingSub.t].subs[editingSub.s].name}</h2>
                  <p className="editor-header-subtitle-text">Editor de contenido estilo Word</p>
                </div>
                <button className="btn-editor-close" onClick={() => setEditingSub(null)}>
                  <Minimize2 size={20} /> Cerrar
                </button>
              </div>
              
              <div className="editor-toolbar-full">
                <button className="btn-toolbar-item"><Plus size={16}/>Párrafo</button>
                <button className="btn-toolbar-item"><ImageIcon size={16}/>Imagen</button>
                <button className="btn-toolbar-item"><List size={16}/>Lista</button>
                <button className="btn-toolbar-item"><LinkIcon size={16}/>Enlace</button>
              </div>
            </header>

            <div className="editor-content-canvas">
              {/* Aquí renderizarías los bloques de contenido reales */}
              <p style={{color: '#666', textAlign: 'center'}}>Zona de edición para la unidad {unidadId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}