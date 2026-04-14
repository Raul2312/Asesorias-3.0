import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
  Layers, Plus, Trash2, BookOpen, Minimize2,
  GraduationCap, Calendar, ImageIcon, List, LinkIcon,
  Eye, Maximize2, Palette, Type
} from 'lucide-react';
import '../css/temas_tecnologico.css';

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
  const { unidadId } = useParams();
  const location = useLocation();

  const nombreMateria = location.state?.nombreMateria || "Arquitectura de Computadoras";

  const [topics, setTopics] = useState<Topic[]>([
    { 
      title: "Unidad Central de Proceso", 
      subs: [
        { 
          name: "Registros y ALU", 
          desc: "Componentes fundamentales del procesador.", 
          content: [
            { id: '1', type: 'text', value: "Registros: Memoria ultrarrápida dentro del procesador" },
            { id: '2', type: 'text', value: "ALU: Unidad que realiza operaciones aritméticas y lógicas" }
          ] 
        },
        { name: "Unidad de Control", desc: "Coordina todas las operaciones del procesador.", content: [] },
        { name: "Pipeline", desc: "Técnica de paralelismo para ejecución rápida.", content: [] }
      ] 
    }
  ]);

  const [currentTopicIdx, setCurrentTopicIdx] = useState<number | null>(0);
  const [editingSub, setEditingSub] = useState<{t: number, s: number} | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const openEditor = (t: number, s: number, preview: boolean = false) => {
    setEditingSub({ t, s });
    setIsPreview(preview);
  };

  const deleteSubtopic = (topicIdx: number, subIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTopics = [...topics];
    newTopics[topicIdx].subs.splice(subIdx, 1);
    setTopics(newTopics);
  };

  const renderHeader = () => (
    <header className="main-header">
      <div className="deco-circle-1"></div>
      <div className="deco-polygon"></div>
      <div className="deco-circle-2"></div>
      <div className="header-container-safe">
        <div className="header-flex">
          <div className="header-left-content">
            <div className="badge-group">
              <div className="badge-icon-box"><GraduationCap size={28} color="white" /></div>
              <div className="badge-text-box">
                <span>Educación de Clase</span>
                <span>Nivel Avanzado</span>
              </div>
            </div>
            <h1 className="main-title-text">Instituto Tecnológico</h1>
            <p className="subtitle-text">{nombreMateria}</p>
          </div>
          <div className="header-stats-group">
            <div className="stat-pill">
              <div className="stat-pill-icon"><Layers size={16} /></div>
              <div className="stat-pill-text"><span>{topics.length} temas</span></div>
            </div>
            <div className="stat-pill">
              <div className="stat-pill-icon"><Calendar size={16} /></div>
              <div className="stat-pill-text"><span>2026-A</span></div>
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
          <aside className="sidebar-col">
            <div className="sidebar-card">
              <div className="sidebar-header-gradient">
                <h2><Layers size={22} /> Temas</h2>
              </div>
              <div className="topic-list-container">
                {topics.map((topic, ti) => (
                  <div key={ti} className={`topic-item ${currentTopicIdx === ti ? 'active' : ''}`} onClick={() => setCurrentTopicIdx(ti)}>
                    <div className="topic-item-title">{topic.title}</div>
                    <div className="topic-item-subtitle">{topic.subs.length} temas</div>
                  </div>
                ))}
              </div>
              <div className="sidebar-footer-action">
                <button className="btn-add-main-topic"><Plus size={18} /> Agregar Tema</button>
              </div>
            </div>
          </aside>

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
                    <div key={si} className="subtopic-card" onClick={() => openEditor(currentTopicIdx, si, false)}>
                      <div className="subtopic-card-header">
                        <span className="subtopic-number-badge">{si + 1}</span>
                        <div className="subtopic-controls">
                          <button className="btn-card-control" onClick={(e) => {e.stopPropagation(); openEditor(currentTopicIdx, si, true)}} title="Vista Previa">
                            <Eye size={16}/>
                          </button>
                          <button className="btn-card-control" onClick={(e) => {e.stopPropagation(); openEditor(currentTopicIdx, si, false)}} title="Editar Pantalla Completa">
                            <Maximize2 size={16}/>
                          </button>
                          <button className="btn-card-control btn-danger" onClick={(e) => deleteSubtopic(currentTopicIdx, si, e)} title="Eliminar Subtema">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                      <h3 className="subtopic-title-text">{sub.name}</h3>
                      <p className="subtopic-desc-text">{sub.desc}</p>
                      <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-purple-400 font-medium">Editar contenido →</div>
                    </div>
                  ))}
                  
                  <div className="subtopic-card flex flex-col items-center justify-center text-center text-purple-200 border-2 border-dashed border-purple-100 hover:border-purple-300">
                    <Plus size={40} />
                    <span className="font-bold text-sm mt-2">Nuevo Subtema</span>
                  </div>
                </div>

                <div className="action-buttons-group">
                  <button className="btn-add-subtopic">+ Agregar Subtema</button>
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

      {editingSub && (
        <div className="modal-overlay active">
          <div className="fullscreen-editor-modal">
            <header className="editor-header-full">
              <div className="editor-header-top-row">
                <div>
                  <h2 className="editor-header-title-text">
                    {isPreview ? 'Vista Previa' : 'Editor'}: {topics[editingSub.t].subs[editingSub.s].name}
                  </h2>
                  <p className="editor-header-subtitle-text">
                    {isPreview ? 'Visualización final del contenido' : 'Gestión de bloques de contenido'}
                  </p>
                </div>
                <button className="btn-editor-close" onClick={() => setEditingSub(null)}>
                  <Minimize2 size={20} /> Cerrar
                </button>
              </div>
              
              {!isPreview && (
                <div className="editor-toolbar-full">
                  <button className="btn-toolbar-item"><Plus size={16}/> Párrafo</button>
                  <button className="btn-toolbar-item"><ImageIcon size={16}/> Imagen</button>
                  <button className="btn-toolbar-item"><List size={16}/> Lista</button>
                  <button className="btn-toolbar-item"><LinkIcon size={16}/> Enlace</button>
                </div>
              )}
            </header>

            <div className="editor-content-canvas">
              <div className="editor-paper-sheet">
                {topics[editingSub.t].subs[editingSub.s].content.length > 0 ? (
                  topics[editingSub.t].subs[editingSub.s].content.map((block) => (
                    <div key={block.id} className="edit-block-container">
                      {!isPreview && <span className="edit-block-label">Párrafo</span>}
                      <div className="edit-block-main" style={isPreview ? {border: 'none', boxShadow: 'none', padding: '10px 0'} : {}}>
                        <p className="edit-block-content">{block.value}</p>
                        {!isPreview && (
                          <div className="edit-block-actions">
                            <button className="btn-block-tool"><Palette size={14}/> Color</button>
                            <button className="btn-block-tool"><Type size={14}/> Tamaño</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 text-gray-300">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay contenido registrado en este bloque.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}