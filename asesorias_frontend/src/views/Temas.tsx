import React, { useEffect, useState } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import axios from 'axios';

import {
  Layers,
  Plus,
  Trash2,
  BookOpen,
  Minimize2,
  GraduationCap,
  Calendar,
  Eye,
  Maximize2,
  MoreVertical,
  Edit2,
  ArrowRight,
} from 'lucide-react';

import RichEditor from '../components/RichTextEditor';

import '../css/temas_tecnologico.css';


/* ==========================================================
   INTERFACES
========================================================== */
interface Subtopic {
  id?: number;
  name: string;
  desc: string;
  content: string;
}


interface Topic {
  id?: number;

  title: string;

  subs: Subtopic[];
}


/* ==========================================================
   COMPONENTE
========================================================== */

export default function Temas() {

  const { unidadId } = useParams();

  const location = useLocation();

  const nombreMateria =
    location.state?.nombreMateria ||
    'Arquitectura de Computadoras';


  /* ==========================================================
     ESTADOS
  ========================================================== */

  const [topics, setTopics] = useState<Topic[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentTopicIdx, setCurrentTopicIdx] =
    useState<number | null>(null);

  const [activeDropdown, setActiveDropdown] =
    useState<number | null>(null);


  const [isTopicModalOpen, setIsTopicModalOpen] =
    useState(false);

  const [editingTopicIdx, setEditingTopicIdx] =
    useState<number | null>(null);


  const [isSubtopicModalOpen, setIsSubtopicModalOpen] =
    useState(false);

  const [editingSubtopicIdx, setEditingSubtopicIdx] =
    useState<number | null>(null);


  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });


  const [editingSub, setEditingSub] =
    useState<{
      t: number;
      s: number;
    } | null>(null);


  const [isPreview, setIsPreview] =
    useState(false);


  /* ==========================================================
     USUARIO / DOCENTE
  ========================================================== */

  const [isDocente, setIsDocente] =
    useState(false);

  const [checkingUser, setCheckingUser] =
    useState(true);


  /* ==========================================================
     API
  ========================================================== */

  const token = localStorage.getItem('token');

  const api = axios.create({

    baseURL: 'http://localhost:8000/api',

    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },

  });


  /* ==========================================================
     VERIFICAR USUARIO
  ========================================================== */

  useEffect(() => {

    const verificarUsuario = async () => {

      try {

        const res = await api.get('/me');

        console.log(
          'USUARIO ACTUAL:',
          res.data
        );


        const usuario = res.data?.data;

        const nivel =
          usuario?.nivel ||
          usuario?.rol ||
          usuario?.role;


        console.log(
          'NIVEL DEL USUARIO:',
          nivel
        );


        setIsDocente(
          String(nivel).toLowerCase() === 'docente'
        );


      } catch (error) {

        console.error(
          'ERROR AL OBTENER USUARIO:',
          error
        );

        setIsDocente(false);

      } finally {

        setCheckingUser(false);

      }

    };


    if (token) {

      verificarUsuario();

    } else {

      setCheckingUser(false);

    }

  }, [token]);


  /* ==========================================================
     CONVERTIR CONTENIDO ANTIGUO A HTML
  ========================================================== */

  const convertirContenido = (
    contenido: any
  ): string => {

    if (!contenido) {

      return '<p></p>';

    }


    /*
    |--------------------------------------------------------------------------
    | YA ES HTML
    |--------------------------------------------------------------------------
    */

    if (typeof contenido === 'string') {

      const texto = contenido.trim();


      if (
        texto.startsWith('<') &&
        (
          texto.includes('</') ||
          texto.includes('/>')
        )
      ) {

        return texto;

      }


      /*
      |--------------------------------------------------------------------------
      | PUEDE SER JSON GUARDADO COMO STRING
      |--------------------------------------------------------------------------
      */

      try {

        const parsed = JSON.parse(texto);

        return convertirContenido(parsed);

      } catch {

        if (texto.length > 0) {

          return `<p>${escapeHtml(texto)}</p>`;

        }

        return '<p></p>';

      }

    }


    /*
    |--------------------------------------------------------------------------
    | FORMATO ANTIGUO ContentBlock[]
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(contenido)) {

      if (contenido.length === 0) {

        return '<p></p>';

      }


      return contenido
        .map((block: any) => {

          if (!block) return '';


          const texto =
            escapeHtml(
              String(block.value || '')
            );


          switch (block.type) {

            case 'text':

              return `
                <p
                  style="
                    color:${block.color || '#374151'};
                    font-size:${block.fontSize || '16'}px;
                  "
                >
                  ${texto || '&nbsp;'}
                </p>
              `;


            case 'image':

              return block.value
                ? `
                  <img
                    src="${escapeAttribute(block.value)}"
                    alt="Imagen"
                  />
                `
                : '';


            case 'list':

              return `
                <ul>
                  <li>${texto}</li>
                </ul>
              `;


            case 'link':

              return `
                <p>
                  <a
                    href="${escapeAttribute(block.value)}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${texto || block.value}
                  </a>
                </p>
              `;


            default:

              return `<p>${texto}</p>`;

          }

        })
        .join('');

    }


    /*
    |--------------------------------------------------------------------------
    | FORMATO TIPTAP JSON
    |--------------------------------------------------------------------------
    */

    if (
      typeof contenido === 'object' &&
      contenido.type === 'doc'
    ) {

      return convertirTiptapJsonAHtml(contenido);

    }


    return '<p></p>';

  };


  /* ==========================================================
     ESCAPAR HTML
  ========================================================== */

  const escapeHtml = (
    texto: string
  ): string => {

    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  };


  const escapeAttribute = (
    texto: string
  ): string => {

    return texto
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  };


  /* ==========================================================
     TIPTAP JSON → HTML BÁSICO
  ========================================================== */

  const convertirTiptapJsonAHtml = (
    doc: any
  ): string => {

    if (!doc?.content) {

      return '<p></p>';

    }


    const renderNode = (
      node: any
    ): string => {

      if (!node) return '';


      if (node.type === 'text') {

        let texto =
          escapeHtml(
            node.text || ''
          );


        if (node.marks) {

          node.marks.forEach(
            (mark: any) => {

              if (mark.type === 'bold') {

                texto = `<strong>${texto}</strong>`;

              }

              if (mark.type === 'italic') {

                texto = `<em>${texto}</em>`;

              }

              if (mark.type === 'underline') {

                texto = `<u>${texto}</u>`;

              }

              if (mark.type === 'strike') {

                texto = `<s>${texto}</s>`;

              }

              if (mark.type === 'link') {

                texto = `
                  <a
                    href="${escapeAttribute(mark.attrs?.href || '')}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${texto}
                  </a>
                `;

              }

            }
          );

        }

        return texto;

      }


      const hijos =
        node.content
          ?.map(renderNode)
          .join('') || '';


      switch (node.type) {

        case 'paragraph':
          return `<p>${hijos}</p>`;

        case 'heading':

          return `
            <h${node.attrs?.level || 1}>
              ${hijos}
            </h${node.attrs?.level || 1}>
          `;

        case 'bulletList':
          return `<ul>${hijos}</ul>`;

        case 'orderedList':
          return `<ol>${hijos}</ol>`;

        case 'listItem':
          return `<li>${hijos}</li>`;

        case 'blockquote':
          return `<blockquote>${hijos}</blockquote>`;

        case 'codeBlock':
          return `<pre><code>${hijos}</code></pre>`;

        case 'horizontalRule':
          return '<hr />';

        case 'image':

          return `
            <img
              src="${escapeAttribute(node.attrs?.src || '')}"
              alt="${escapeAttribute(node.attrs?.alt || '')}"
            />
          `;

        default:

          return hijos;

      }

    };


    return doc.content
      .map(renderNode)
      .join('');

  };


  /* ==========================================================
     CARGAR TEMAS
  ========================================================== */

  useEffect(() => {

    const fetchTemas = async () => {

      try {

        setLoading(true);


        console.log(
          'CARGANDO TEMAS. UNIDAD:',
          unidadId
        );


        const res = await api.get(
          `/unidades/${unidadId}/temas`
        );


        console.log(
          'RESPUESTA API:',
          res.data
        );


        if (res.data.success) {

          const transformado: Topic[] =
            res.data.data.map(
              (t: any) => {

                const subs: Subtopic[] =
                  (t.subtemas || []).map(
                    (s: any) => ({

                      id: s.id,

                      name: s.nombre,

                      desc:
                        s.descripcion || '',

                      content:
                        convertirContenido(
                          s.contenido
                        ),

                    })
                  );


                return {

                  id: t.id,

                  title: t.nombre,

                  subs,

                };

              }
            );


          console.log(
            'TEMAS TRANSFORMADOS:',
            transformado
          );


          setTopics(transformado);


          if (
            transformado.length > 0
          ) {

            setCurrentTopicIdx(0);

          } else {

            setCurrentTopicIdx(null);

          }

        }

      } catch (error) {

        console.error(
          'ERROR AL CARGAR TEMAS:',
          error
        );

      } finally {

        setLoading(false);

      }

    };


    if (unidadId) {

      fetchTemas();

    }

  }, [unidadId]);


  /* ==========================================================
     TEMA - MODAL
  ========================================================== */

  const handleOpenTopicModal = (
    idx: number | null = null
  ) => {

    if (!isDocente) return;


    if (idx !== null) {

      setFormData({

        title:
          topics[idx].title,

        desc: '',

      });

      setEditingTopicIdx(idx);

    } else {

      setFormData({

        title: '',

        desc: '',

      });

      setEditingTopicIdx(null);

    }


    setIsTopicModalOpen(true);

    setActiveDropdown(null);

  };


  /* ==========================================================
     GUARDAR TEMA
  ========================================================== */

  const handleSaveTopic = async () => {

    if (!isDocente) return;


    if (!formData.title.trim()) {

      return;

    }


    try {

      if (
        editingTopicIdx !== null
      ) {

        const id =
          topics[
            editingTopicIdx
          ].id;


        await api.put(
          `/temas/${id}`,
          {
            nombre:
              formData.title,
          }
        );


        const nuevos = [
          ...topics,
        ];


        nuevos[
          editingTopicIdx
        ] = {

          ...nuevos[
            editingTopicIdx
          ],

          title:
            formData.title,

        };


        setTopics(nuevos);

      } else {

        const res =
          await api.post(
            '/temas',
            {
              nombre:
                formData.title,

              unidad_id:
                unidadId,
            }
          );


        const nuevoTema: Topic = {

          id:
            res.data.data.id,

          title:
            formData.title,

          subs: [],

        };


        setTopics([
          ...topics,
          nuevoTema,
        ]);


        setCurrentTopicIdx(
          topics.length
        );

      }


      setIsTopicModalOpen(false);

    } catch (error) {

      console.error(
        error
      );

      alert(
        'No se pudo guardar el tema.'
      );

    }

  };


  /* ==========================================================
     ELIMINAR TEMA
  ========================================================== */

  const deleteTopic = async (
    idx: number
  ) => {

    if (!isDocente) return;


    if (
      !window.confirm(
        '¿Eliminar este tema?'
      )
    ) {

      return;

    }


    try {

      await api.delete(
        `/temas/${topics[idx].id}`
      );


      const nuevos =
        topics.filter(
          (_, i) => i !== idx
        );


      setTopics(nuevos);


      if (
        nuevos.length === 0
      ) {

        setCurrentTopicIdx(null);

      } else if (
        currentTopicIdx === idx
      ) {

        setCurrentTopicIdx(0);

      } else if (
        currentTopicIdx !== null &&
        currentTopicIdx > idx
      ) {

        setCurrentTopicIdx(
          currentTopicIdx - 1
        );

      }


      setActiveDropdown(null);

    } catch (error) {

      console.error(error);

      alert(
        'No se pudo eliminar el tema.'
      );

    }

  };


  /* ==========================================================
     SUBTEMA - MODAL
  ========================================================== */

  const handleOpenSubtopicModal = (
    subIdx: number | null = null
  ) => {

    if (!isDocente) return;


    if (
      currentTopicIdx === null
    ) {

      return;

    }


    if (subIdx !== null) {

      const sub =
        topics[
          currentTopicIdx
        ].subs[subIdx];


      setFormData({

        title:
          sub.name,

        desc:
          sub.desc,

      });


      setEditingSubtopicIdx(
        subIdx
      );

    } else {

      setFormData({

        title: '',

        desc: '',

      });


      setEditingSubtopicIdx(
        null
      );

    }


    setIsSubtopicModalOpen(true);

  };


  /* ==========================================================
     GUARDAR SUBTEMA
  ========================================================== */

  const handleSaveSubtopic = async () => {

    if (!isDocente) return;


    if (
      !formData.title.trim()
    ) {

      return;

    }


    if (
      currentTopicIdx === null
    ) {

      return;

    }


    const topicId =
      topics[
        currentTopicIdx
      ].id;


    try {

      if (
        editingSubtopicIdx !== null
      ) {

        const subId =
          topics[
            currentTopicIdx
          ].subs[
            editingSubtopicIdx
          ].id;


        await api.put(
          `/subtemas/${subId}`,
          {

            nombre:
              formData.title,

            descripcion:
              formData.desc,

          }
        );


        const nuevos =
          [...topics];


        nuevos[
          currentTopicIdx
        ].subs[
          editingSubtopicIdx
        ] = {

          ...nuevos[
            currentTopicIdx
          ].subs[
            editingSubtopicIdx
          ],

          name:
            formData.title,

          desc:
            formData.desc,

        };


        setTopics(nuevos);

      } else {

        const res =
          await api.post(
            '/subtemas',
            {

              nombre:
                formData.title,

              descripcion:
                formData.desc,

              tema_id:
                topicId,

            }
          );


        const nuevoSubtema: Subtopic = {

          id:
            res.data.data.id,

          name:
            formData.title,

          desc:
            formData.desc,

          content:
            '<p></p>',

        };


        const nuevos =
          [...topics];


        nuevos[
          currentTopicIdx
        ].subs.push(
          nuevoSubtema
        );


        setTopics(nuevos);

      }


      setIsSubtopicModalOpen(false);

    } catch (error) {

      console.error(
        error
      );

      alert(
        'No se pudo guardar el subtema.'
      );

    }

  };


  /* ==========================================================
     ELIMINAR SUBTEMA
  ========================================================== */

  const deleteSubtopic = async (
    subIdx: number,
    e: React.MouseEvent
  ) => {

    e.stopPropagation();


    if (!isDocente) return;


    if (
      currentTopicIdx === null
    ) {

      return;

    }


    if (
      !window.confirm(
        '¿Eliminar este subtema?'
      )
    ) {

      return;

    }


    try {

      const id =
        topics[
          currentTopicIdx
        ].subs[subIdx].id;


      await api.delete(
        `/subtemas/${id}`
      );


      const nuevos =
        [...topics];


      nuevos[
        currentTopicIdx
      ].subs.splice(
        subIdx,
        1
      );


      setTopics(nuevos);

    } catch (error) {

      console.error(error);

      alert(
        'No se pudo eliminar el subtema.'
      );

    }

  };


  /* ==========================================================
     ABRIR EDITOR
  ========================================================== */

  const openEditor = (
    t: number,
    s: number,
    preview = false
  ) => {

    setEditingSub({

      t,

      s,

    });


    setIsPreview(
      preview
    );

  };


  /* ==========================================================
     ACTUALIZAR CONTENIDO LOCAL
  ========================================================== */

  const updateEditorContent = (
    content: string
  ) => {

    if (!editingSub) return;


    const nuevos =
      [...topics];


    nuevos[
      editingSub.t
    ].subs[
      editingSub.s
    ].content =
      content;


    setTopics(nuevos);

  };


  /* ==========================================================
     GUARDAR EDITOR
  ========================================================== */

  const closeAndSaveEditor =
    async () => {

      if (!editingSub) return;


      if (!isDocente) {

        setEditingSub(null);

        return;

      }


      const sub =
        topics[
          editingSub.t
        ].subs[
          editingSub.s
        ];


      try {

        await api.put(
          `/subtemas/${sub.id}`,
          {

            contenido:
              sub.content,

          }
        );


        console.log(
          'CONTENIDO GUARDADO'
        );


        setEditingSub(null);

      } catch (error) {

        console.error(
          'ERROR AL GUARDAR CONTENIDO:',
          error
        );


        alert(
          'No se pudo guardar el contenido.'
        );

      }

    };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    loading ||
    checkingUser
  ) {

    return (

      <div className="temas-v2-wrapper">

        <div
          style={{
            padding: '80px',
            textAlign: 'center',
            fontSize: '18px',
          }}
        >

          Cargando...

        </div>

      </div>

    );

  }


  /* ==========================================================
     RENDER
  ========================================================== */

  return (

    <div
      className="temas-v2-wrapper"
      onClick={() =>
        setActiveDropdown(null)
      }
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="main-header">

        <div className="deco-circle-1" />

        <div className="deco-polygon" />

        <div className="deco-circle-2" />


        <div className="header-container-safe">

          <div className="header-flex">

            <div className="header-left-content">

              <div className="badge-group">

                <div className="badge-icon-box">

                  <GraduationCap
                    size={28}
                    color="white"
                  />

                </div>

                <div className="badge-text-box">

                  <span>
                    Educación de Clase
                  </span>

                  <span>
                    Nivel Avanzado
                  </span>

                </div>

              </div>


              <h1 className="main-title-text">

                Instituto Tecnológico

              </h1>


              <p className="subtitle-text">

                {nombreMateria}

              </p>

            </div>


            <div className="header-stats-group">

              <div className="stat-pill">

                <div className="stat-pill-icon">

                  <Layers size={16} />

                </div>

                <div className="stat-pill-text">

                  <span>
                    {topics.length} temas
                  </span>

                </div>

              </div>


              <div className="stat-pill">

                <div className="stat-pill-icon">

                  <Calendar size={16} />

                </div>

                <div className="stat-pill-text">

                  <span>
                    2025-A
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        <svg
          viewBox="0 0 1440 100"
          className="wave-divider-svg"
        >

          <path
            fill="#F9F8FB"
            d="M0,50 Q360,10 720,50 T1440,50 L1440,100 L0,100 Z"
          />

        </svg>

      </header>


      {/* ======================================================
          CONTENIDO
      ====================================================== */}

      <main className="main-content-area">

        <div className="content-grid-layout">


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="sidebar-col">

            <div className="sidebar-card">

              <div className="sidebar-header-gradient">

                <h2>

                  <Layers size={22} />

                  Temas

                </h2>

              </div>


              <div className="topic-list-container">

                {topics.map(
                  (topic, ti) => (

                    <div
                      key={topic.id || ti}
                      className="topic-item-wrapper"
                    >

                      <div
                        className={`topic-item ${
                          currentTopicIdx === ti
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          setCurrentTopicIdx(ti)
                        }
                      >

                        <div className="topic-item-content">

                          <div className="topic-item-title">

                            {topic.title}

                          </div>

                          <div className="topic-item-subtitle">

                            {topic.subs.length}{' '}

                            subtemas

                          </div>

                        </div>

                      </div>


                      {/* SOLO DOCENTE */}

                      {isDocente && (

                        <>

                          <button
                            className={`topic-menu-btn ${
                              activeDropdown === ti
                                ? 'active'
                                : ''
                            }`}
                            onClick={(e) => {

                              e.stopPropagation();

                              setActiveDropdown(
                                activeDropdown === ti
                                  ? null
                                  : ti
                              );

                            }}
                          >

                            <MoreVertical size={16} />

                          </button>


                          {activeDropdown === ti && (

                            <div className="topic-dropdown-menu">

                              <button
                                className="topic-dropdown-item"
                                onClick={() =>
                                  handleOpenTopicModal(ti)
                                }
                              >

                                <Edit2 size={14} />

                                Editar

                              </button>


                              <button
                                className="topic-dropdown-item danger"
                                onClick={() =>
                                  deleteTopic(ti)
                                }
                              >

                                <Trash2 size={14} />

                                Eliminar

                              </button>

                            </div>

                          )}

                        </>

                      )}

                    </div>

                  )
                )}

              </div>


              {/* SOLO DOCENTE */}

              {isDocente && (

                <div className="sidebar-footer-action">

                  <button
                    className="btn-add-main-topic"
                    onClick={() =>
                      handleOpenTopicModal()
                    }
                  >

                    <Plus size={18} />

                    Agregar Tema

                  </button>

                </div>

              )}

            </div>

          </aside>


          {/* ==================================================
              CONTENIDO PRINCIPAL
          ================================================== */}

          <section
            className="main-col main-col-content"
          >

            {currentTopicIdx !== null &&
            topics[currentTopicIdx] ? (

              <>

                <div className="info-header-card">

                  <div className="info-header-content">

                    <h2 className="info-header-title">

                      {
                        topics[
                          currentTopicIdx
                        ].title
                      }

                    </h2>

                    <p className="info-header-subtitle">

                      {
                        topics[
                          currentTopicIdx
                        ].subs.length
                      }{' '}

                      subtema(s)

                    </p>

                  </div>

                </div>


                <div className="subtopics-grid">

                  {
                    topics[
                      currentTopicIdx
                    ].subs.map(
                      (sub, si) => (

                        <div
                          key={
                            sub.id ||
                            si
                          }
                          className="subtopic-card"
                        >

                          <div className="subtopic-card-header">

                            <span className="subtopic-number-badge">

                              {si + 1}

                            </span>


                            <div className="subtopic-controls">

                              {/* VISTA PREVIA */}

                              <button
                                className="btn-card-control"
                                onClick={(e) => {

                                  e.stopPropagation();

                                  openEditor(
                                    currentTopicIdx,
                                    si,
                                    true
                                  );

                                }}
                                title="Vista Previa"
                              >

                                <Eye size={16} />

                              </button>


                              {/* EDITAR CONTENIDO */}

                              {isDocente && (

                                <button
                                  className="btn-card-control"
                                  onClick={(e) => {

                                    e.stopPropagation();

                                    openEditor(
                                      currentTopicIdx,
                                      si,
                                      false
                                    );

                                  }}
                                  title="Editar contenido"
                                >

                                  <Maximize2 size={16} />

                                </button>

                              )}


                              {/* EDITAR DATOS */}

                              {isDocente && (

                                <button
                                  className="btn-card-control"
                                  onClick={(e) => {

                                    e.stopPropagation();

                                    handleOpenSubtopicModal(
                                      si
                                    );

                                  }}
                                  title="Editar información"
                                >

                                  <Edit2 size={16} />

                                </button>

                              )}


                              {/* ELIMINAR */}

                              {isDocente && (

                                <button
                                  className="btn-card-control btn-danger"
                                  onClick={(e) =>
                                    deleteSubtopic(
                                      si,
                                      e
                                    )
                                  }
                                  title="Eliminar"
                                >

                                  <Trash2 size={16} />

                                </button>

                              )}

                            </div>

                          </div>


                          <h3 className="subtopic-title-text">

                            {sub.name}

                          </h3>


                          <p className="subtopic-desc-text">

                            {sub.desc}

                          </p>


                          <div
                            className="subtopic-footer-link"
                            onClick={() =>
                              openEditor(
                                currentTopicIdx,
                                si,
                                !isDocente
                              )
                            }
                          >

                            {isDocente
                              ? 'Editar contenido'
                              : 'Ver contenido'
                            }

                            <ArrowRight
                              size={14}
                            />

                          </div>

                        </div>

                      )
                    )}


                  {/* SOLO DOCENTE */}

                  {isDocente && (

                    <div
                      className="subtopic-card-add"
                      onClick={() =>
                        handleOpenSubtopicModal()
                      }
                    >

                      <Plus
                        size={48}
                        className="card-add-icon"
                      />

                      <span className="card-add-text">

                        Agregar Subtema

                      </span>

                    </div>

                  )}

                </div>

              </>

            ) : (

              <div className="empty-state-card">

                <BookOpen
                  className="empty-state-icon"
                />

                <p className="empty-state-text">

                  No hay temas disponibles.

                </p>

              </div>

            )}

          </section>

        </div>

      </main>


      {/* ======================================================
          MODAL TEMA
      ====================================================== */}

      {isTopicModalOpen && isDocente && (

        <div
          className="modal-overlay active"
          onClick={() =>
            setIsTopicModalOpen(false)
          }
        >

          <div
            className="topic-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="topic-modal-title">

              {editingTopicIdx !== null
                ? 'Editar Tema'
                : 'Nuevo Tema'
              }

            </h3>


            <input
              className="modal-input"
              placeholder="Nombre del tema"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              autoFocus
            />


            <div className="modal-action-btns">

              <button
                className="btn-modal-cancel"
                onClick={() =>
                  setIsTopicModalOpen(false)
                }
              >

                Cancelar

              </button>


              <button
                className="btn-modal-submit"
                onClick={handleSaveTopic}
              >

                Guardar

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          MODAL SUBTEMA
      ====================================================== */}

      {isSubtopicModalOpen && isDocente && (

        <div
          className="modal-overlay active"
          onClick={() =>
            setIsSubtopicModalOpen(false)
          }
        >

          <div
            className="topic-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="topic-modal-title">

              {editingSubtopicIdx !== null
                ? 'Editar Subtema'
                : 'Nuevo Subtema'
              }

            </h3>


            <input
              className="modal-input"
              placeholder="Nombre del subtema"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title:
                    e.target.value,
                })
              }
              autoFocus
            />


            <textarea
              className="modal-textarea"
              placeholder="Descripción..."
              value={formData.desc}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  desc:
                    e.target.value,
                })
              }
            />


            <div className="modal-action-btns">

              <button
                className="btn-modal-cancel"
                onClick={() =>
                  setIsSubtopicModalOpen(false)
                }
              >

                Cancelar

              </button>


              <button
                className="btn-modal-submit"
                onClick={handleSaveSubtopic}
              >

                Guardar

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ======================================================
          EDITOR COMPLETO
      ====================================================== */}

      {editingSub &&
        topics[editingSub.t] &&
        topics[editingSub.t].subs[
          editingSub.s
        ] && (

          <div
            className="modal-overlay active"
            style={{
              padding: 0,
            }}
          >

            <div
              className="fullscreen-editor-modal"
              style={{
                width: '100%',
                height: '100vh',
                maxHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
              }}
            >

              {/* HEADER */}

              <header className="editor-header-full">

                <div className="editor-header-top-row">

                  <div>

                    <h2 className="editor-header-title-text">

                      {isPreview
                        ? 'Vista Previa'
                        : 'Editor'
                      }

                      {': '}

                      {
                        topics[
                          editingSub.t
                        ].subs[
                          editingSub.s
                        ].name
                      }

                    </h2>

                  </div>


                  <button
                    className="btn-editor-close"
                    onClick={
                      isPreview
                        ? () =>
                            setEditingSub(null)
                        : closeAndSaveEditor
                    }
                  >

                    <Minimize2 size={20} />

                    {isPreview
                      ? 'Cerrar'
                      : 'Guardar y Cerrar'
                    }

                  </button>

                </div>

              </header>


              {/* EDITOR */}

              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                }}
              >

           <RichEditor
  content={topics[editingSub.t].subs[editingSub.s].content}
  readOnly={!isDocente || isPreview}
  onChange={(html) => {
    const newTopics = [...topics];

    newTopics[editingSub.t].subs[editingSub.s].content = html;

    setTopics(newTopics);
  }}
/>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}