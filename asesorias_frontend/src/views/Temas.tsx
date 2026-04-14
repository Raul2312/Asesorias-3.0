import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios'; // Importamos axios
import { 
  Layers, Plus, Trash2, BookOpen, Minimize2,
  GraduationCap, Calendar, ImageIcon, List, LinkIcon,
  Eye, Maximize2, Palette, Type, MoreVertical, Edit2, ArrowRight
} from 'lucide-react';
import '../css/temas_tecnologico.css';

// --- INTERFACES ---
interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'list' | 'link';
  value: string;
  color?: string;
  fontSize?: string;
}

interface Subtopic {
  id?: number; // Agregamos ID para DB
  name: string;
  desc: string;
  content: ContentBlock[];
}

interface Topic {
  id?: number; // Agregamos ID para DB
  title: string;
  subs: Subtopic[];
}

export default function Temas() {
  const { unidadId } = useParams();
  const location = useLocation();
  const nombreMateria = location.state?.nombreMateria || "Arquitectura de Computadoras";

  // --- ESTADOS ---
  const [topics, setTopics] = useState<Topic[]>([]); // Inicializamos vacío para cargar de DB
  const [loading, setLoading] = useState(true);
  const [currentTopicIdx, setCurrentTopicIdx] = useState<number | null>(0);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopicIdx, setEditingTopicIdx] = useState<number | null>(null);
  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState(false);
  const [editingSubtopicIdx, setEditingSubtopicIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', desc: '' });
  const [editingSub, setEditingSub] = useState<{t: number, s: number} | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  // Configuración de API
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  // --- CARGA DE DATOS DESDE LARAVEL ---
  useEffect(() => {
    const fetchTemas = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/unidades/${unidadId}/temas`);
        if (res.data.success) {
          const transformado = res.data.data.map((t: any) => ({
            id: t.id,
            title: t.nombre,
            subs: t.subtemas?.map((s: any) => ({
              id: s.id,
              name: s.nombre,
              desc: s.descripcion || "",
              content: s.contenido ? JSON.parse(s.contenido) : []
            })) || []
          }));
          setTopics(transformado);
        }
      } catch (err) {
        console.error("Error al cargar datos", err);
      } finally {
        setLoading(false);
      }
    };
    if (unidadId) fetchTemas();
  }, [unidadId]);

  // --- MANEJO DE TEMAS ---
  const handleOpenTopicModal = (idx: number | null = null) => {
    if (idx !== null) {
      setFormData({ title: topics[idx].title, desc: '' });
      setEditingTopicIdx(idx);
    } else {
      setFormData({ title: '', desc: '' });
      setEditingTopicIdx(null);
    }
    setIsTopicModalOpen(true);
    setActiveDropdown(null);
  };

  const handleSaveTopic = async () => {
    if (!formData.title.trim()) return;
    try {
      if (editingTopicIdx !== null) {
        const id = topics[editingTopicIdx].id;
        await api.put(`/temas/${id}`, { nombre: formData.title });
        const newTopics = [...topics];
        newTopics[editingTopicIdx].title = formData.title;
        setTopics(newTopics);
      } else {
        const res = await api.post('/temas', { nombre: formData.title, unidad_id: unidadId });
        setTopics([...topics, { id: res.data.data.id, title: formData.title, subs: [] }]);
        setCurrentTopicIdx(topics.length);
      }
      setIsTopicModalOpen(false);
    } catch (err) { alert("Error al guardar tema"); }
  };

  const deleteTopic = async (idx: number) => {
    if(!window.confirm("¿Eliminar tema?")) return;
    try {
      await api.delete(`/temas/${topics[idx].id}`);
      const newTopics = topics.filter((_, i) => i !== idx);
      setTopics(newTopics);
      if (currentTopicIdx === idx) setCurrentTopicIdx(newTopics.length > 0 ? 0 : null);
      setActiveDropdown(null);
    } catch (err) { alert("Error al eliminar"); }
  };

  // --- MANEJO DE SUBTEMAS ---
  const handleOpenSubtopicModal = (subIdx: number | null = null) => {
    if (currentTopicIdx === null) return;
    if (subIdx !== null) {
      const sub = topics[currentTopicIdx].subs[subIdx];
      setFormData({ title: sub.name, desc: sub.desc });
      setEditingSubtopicIdx(subIdx);
    } else {
      setFormData({ title: '', desc: '' });
      setEditingSubtopicIdx(null);
    }
    setIsSubtopicModalOpen(true);
  };

  const handleSaveSubtopic = async () => {
    if (!formData.title.trim() || currentTopicIdx === null) return;
    const topicId = topics[currentTopicIdx].id;
    try {
      if (editingSubtopicIdx !== null) {
        const subId = topics[currentTopicIdx].subs[editingSubtopicIdx].id;
        await api.put(`/subtemas/${subId}`, { nombre: formData.title, descripcion: formData.desc });
        const newTopics = [...topics];
        newTopics[currentTopicIdx].subs[editingSubtopicIdx].name = formData.title;
        newTopics[currentTopicIdx].subs[editingSubtopicIdx].desc = formData.desc;
        setTopics(newTopics);
      } else {
        const res = await api.post('/subtemas', { nombre: formData.title, descripcion: formData.desc, tema_id: topicId });
        const newTopics = [...topics];
        newTopics[currentTopicIdx].subs.push({
          id: res.data.data.id, name: formData.title, desc: formData.desc, content: []
        });
        setTopics(newTopics);
      }
      setIsSubtopicModalOpen(false);
    } catch (err) { alert("Error al guardar subtema"); }
  };

  const deleteSubtopic = async (subIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTopicIdx === null || !window.confirm("¿Eliminar subtema?")) return;
    try {
      await api.delete(`/subtemas/${topics[currentTopicIdx].subs[subIdx].id}`);
      const newTopics = [...topics];
      newTopics[currentTopicIdx].subs.splice(subIdx, 1);
      setTopics(newTopics);
    } catch (err) { alert("Error al eliminar"); }
  };

  // --- EDITOR FULLSCREEN Y PERSISTENCIA DE CONTENIDO ---
  const openEditor = (t: number, s: number, preview: boolean = false) => {
    setEditingSub({ t, s });
    setIsPreview(preview);
  };

  const closeAndSaveEditor = async () => {
    if (!editingSub) return;
    const sub = topics[editingSub.t].subs[editingSub.s];
    try {
      await api.put(`/subtemas/${sub.id}`, { contenido: JSON.stringify(sub.content) });
      setEditingSub(null);
    } catch (err) { console.error("Error al guardar contenido"); }
  };

  const addParagraphBlock = () => {
    if (!editingSub) return;
    const newTopics = [...topics];
    newTopics[editingSub.t].subs[editingSub.s].content.push({
      id: Date.now().toString(),
      type: 'text',
      value: '',
      color: '#4B5563',
      fontSize: '16'
    });
    setTopics(newTopics);
  };

  const updateBlock = (blockId: string, field: 'value' | 'color' | 'fontSize', val: string) => {
    if (!editingSub) return;
    const newTopics = [...topics];
    const block = newTopics[editingSub.t].subs[editingSub.s].content.find(b => b.id === blockId);
    if (block) {
      block[field] = val;
      setTopics(newTopics);
    }
  };

  const promptFontSize = (blockId: string) => {
    const size = prompt("Tamaño de fuente:", "16");
    if (size && !isNaN(Number(size))) updateBlock(blockId, 'fontSize', size);
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

  if (loading) return <div className="temas-v2-wrapper p-20 text-center">Cargando...</div>;

  return (
    <div className="temas-v2-wrapper" onClick={() => setActiveDropdown(null)}>
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
                  <div key={ti} className="topic-item-wrapper">
                    <div 
                      className={`topic-item ${currentTopicIdx === ti ? 'active' : ''}`} 
                      onClick={() => setCurrentTopicIdx(ti)}
                    >
                      <div className="topic-item-content">
                        <div className="topic-item-title">{topic.title}</div>
                        <div className="topic-item-subtitle">{topic.subs.length} temas</div>
                      </div>
                    </div>
                    
                    <button 
                      className={`topic-menu-btn ${activeDropdown === ti ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === ti ? null : ti);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeDropdown === ti && (
                      <div className="topic-dropdown-menu">
                        <button className="topic-dropdown-item" onClick={() => handleOpenTopicModal(ti)}>
                          <Edit2 size={14} /> Editar
                        </button>
                        <button className="topic-dropdown-item danger" onClick={() => deleteTopic(ti)}>
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="sidebar-footer-action">
                <button className="btn-add-main-topic" onClick={() => handleOpenTopicModal()}>
                  <Plus size={18} /> Agregar Tema
                </button>
              </div>
            </div>
          </aside>

          <section className="main-col main-col-content">
            {currentTopicIdx !== null && topics[currentTopicIdx] ? (
              <>
                <div className="info-header-card">
                  <div className="info-header-content">
                    <h2 className="info-header-title">{topics[currentTopicIdx].title}</h2>
                    <p className="info-header-subtitle">{topics[currentTopicIdx].subs.length} subtema(s)</p>
                  </div>
                </div>

                <div className="subtopics-grid">
                  {topics[currentTopicIdx].subs.map((sub, si) => (
                    <div key={si} className="subtopic-card">
                      <div className="subtopic-card-header">
                        <span className="subtopic-number-badge">{si + 1}</span>
                        <div className="subtopic-controls">
                          <button className="btn-card-control" onClick={(e) => {e.stopPropagation(); openEditor(currentTopicIdx, si, true)}} title="Vista Previa">
                            <Eye size={16}/>
                          </button>
                          <button className="btn-card-control" onClick={(e) => {e.stopPropagation(); openEditor(currentTopicIdx, si, false)}} title="Editar Pantalla Completa">
                            <Maximize2 size={16}/>
                          </button>
                          <button className="btn-card-control" onClick={(e) => {e.stopPropagation(); handleOpenSubtopicModal(si)}} title="Editar Meta">
                            <Edit2 size={16}/>
                          </button>
                          <button className="btn-card-control btn-danger" onClick={(e) => deleteSubtopic(si, e)} title="Eliminar Subtema">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                      <h3 className="subtopic-title-text">{sub.name}</h3>
                      <p className="subtopic-desc-text">{sub.desc}</p>
                      <div className="subtopic-footer-link" onClick={() => openEditor(currentTopicIdx, si, false)}>
                        Editar contenido <ArrowRight size={14} />
                      </div>
                    </div>
                  ))}
                  <div className="subtopic-card-add" onClick={() => handleOpenSubtopicModal()}>
                    <Plus size={48} className="card-add-icon" />
                    <span className="card-add-text">Agregar Subtema</span>
                  </div>
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

      {/* MODAL TEMA */}
      {isTopicModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsTopicModalOpen(false)}>
          <div className="topic-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="topic-modal-title">{editingTopicIdx !== null ? 'Editar Tema' : 'Nuevo Tema'}</h3>
            <input 
              className="modal-input" 
              placeholder="Ej. Modelos de Arquitectura" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
            <div className="modal-action-btns">
              <button className="btn-modal-cancel" onClick={() => setIsTopicModalOpen(false)}>Cancelar</button>
              <button className="btn-modal-submit" onClick={handleSaveTopic}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUBTEMA */}
      {isSubtopicModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsSubtopicModalOpen(false)}>
          <div className="topic-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="topic-modal-title">{editingSubtopicIdx !== null ? 'Editar Subtema' : 'Nuevo Subtema'}</h3>
            <input 
              className="modal-input" 
              placeholder="Nombre del subtema" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
            <textarea 
              className="modal-textarea" 
              placeholder="Descripción..." 
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
            />
            <div className="modal-action-btns">
              <button className="btn-modal-cancel" onClick={() => setIsSubtopicModalOpen(false)}>Cancelar</button>
              <button className="btn-modal-submit" onClick={handleSaveSubtopic}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* EDITOR FULLSCREEN */}
      {editingSub && topics[editingSub.t] && topics[editingSub.t].subs[editingSub.s] && (
        <div className="modal-overlay active" style={{padding: 0}}>
          <div className="fullscreen-editor-modal">
            <header className="editor-header-full">
              <div className="editor-header-top-row">
                <div>
                  <h2 className="editor-header-title-text">
                    {isPreview ? 'Vista Previa' : 'Editor'}: {topics[editingSub.t].subs[editingSub.s].name}
                  </h2>
                </div>
                <button className="btn-editor-close" onClick={closeAndSaveEditor}>
                  <Minimize2 size={20} /> Guardar y Cerrar
                </button>
              </div>
              {!isPreview && (
                <div className="editor-toolbar-full">
                  <button className="btn-toolbar-item" onClick={addParagraphBlock}><Plus size={16}/> Párrafo</button>
                  <button className="btn-toolbar-item" onClick={() => alert("Función en desarrollo")}><ImageIcon size={16}/> Imagen</button>
                  <button className="btn-toolbar-item" onClick={() => alert("Función en desarrollo")}><List size={16}/> Lista</button>
                </div>
              )}
            </header>
            <div className="editor-content-canvas">
              <div className="editor-paper-sheet">
                {topics[editingSub.t].subs[editingSub.s].content.map((block) => (
                  <div key={block.id} className="edit-block-container">
                    <div className="edit-block-main" style={isPreview ? {border: 'none', padding: '10px 0', background: 'transparent'} : {}}>
                      {isPreview ? (
                        <p style={{ color: block.color || '#374151', fontSize: `${block.fontSize || '16'}px` }}>
                          {block.value || "Texto vacío..."}
                        </p>
                      ) : (
                        <>
                          <textarea
                            className="edit-block-input"
                            value={block.value}
                            onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                            style={{ color: block.color || '#374151', fontSize: `${block.fontSize || '16'}px` }}
                          />
                          <div className="edit-block-actions">
                            <div className="btn-block-tool">
                              <Palette size={14}/> Color
                              <input type="color" className="color-picker-hidden" value={block.color} onChange={(e) => updateBlock(block.id, 'color', e.target.value)} />
                            </div>
                            <button className="btn-block-tool" onClick={() => promptFontSize(block.id)}><Type size={14}/> Tamaño</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}