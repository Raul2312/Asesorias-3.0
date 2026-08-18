import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import { EditorContent, useEditor } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import Link from '@tiptap/extension-link';

import Image from '@tiptap/extension-image';

import { mergeAttributes } from '@tiptap/core';

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

import '../css/rich_text_editor.css';

const CustomImage = Image.extend({

  addAttributes() {

    return {

      ...this.parent?.(),

      width: {
        default: 'auto',

        parseHTML: element =>
          element.getAttribute('width') ||
          element.style.width ||
          'auto',

        renderHTML: attributes => {

          if (!attributes.width) {
            return {};
          }

          return {
            width: attributes.width,
            style:
              `width:${attributes.width};height:auto;`
          };

        },

      },

    };

  },

});

interface RichEditorProps {
  content: string;
  editable?: boolean;
  onChange?: (html: string) => void;
  subtemaId?: number;
}

export default function RichEditor({
  content,
  editable = true,
  onChange,
  subtemaId
}: RichEditorProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState(false);

  const [imageWidth, setImageWidth] = useState('100%');

  const token = localStorage.getItem('token');

  const editor = useEditor({

    editable,

    extensions: [

      StarterKit,

      Link.configure({
        openOnClick: !editable,
        autolink: true,
        linkOnPaste: true,
      }),

      CustomImage.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),

    ],

    content: content || '<p></p>',

    onUpdate: ({ editor }) => {

      if (onChange) {
        onChange(editor.getHTML());
      }

    },

    onSelectionUpdate: ({ editor }) => {

      const imageActive =
        editor.isActive('image');

      setSelectedImage(imageActive);

      if (imageActive) {

        const attrs =
          editor.getAttributes('image');

        setImageWidth(
          attrs.width || '100%'
        );

      }

    },

  });

  /*
  |--------------------------------------------------------------------------
  | Actualizar contenido cuando cambia desde fuera
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (!editor) return;

    const currentHTML = editor.getHTML();

    if (
      content &&
      content !== currentHTML
    ) {

      editor.commands.setContent(content, {
        emitUpdate: false,
    });

    }

  }, [content, editor]);


  /*
  |--------------------------------------------------------------------------
  | IMAGEN
  |--------------------------------------------------------------------------
  */

  const abrirSelectorImagen = () => {

    if (!editable) return;

    fileInputRef.current?.click();

  };


  /*
  |--------------------------------------------------------------------------
  | SUBIR IMAGEN
  |--------------------------------------------------------------------------
  */

  const subirImagen = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const archivo =
      event.target.files?.[0];

    if (!archivo || !editor || !subtemaId) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {

      alert(
        'Selecciona un archivo de imagen válido.'
      );

      return;

    }

    if (archivo.size > 5 * 1024 * 1024) {

      alert(
        'La imagen no puede superar los 5 MB.'
      );

      return;

    }

    try {

      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        'imagen',
        archivo
      );

      const response =
        await fetch(
          `http://localhost:8000/api/subtemas/${subtemaId}/imagen`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                'application/json',
            },

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Error al subir imagen'
        );

      }

      const imageUrl =
        data.data.url;

      /*
       * Insertar imagen en Tiptap
       */

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: archivo.name,
          title: archivo.name,
        })
        .run();

    } catch (error) {

      console.error(
        'ERROR SUBIENDO IMAGEN:',
        error
      );

      alert(
        'No se pudo subir la imagen.'
      );

    } finally {

      setUploadingImage(false);

      /*
       * Permitir volver a seleccionar
       * la misma imagen.
       */

      event.target.value = '';

    }

  };


  /*
  |--------------------------------------------------------------------------
  | LINK
  |--------------------------------------------------------------------------
  */

  const insertarLink = () => {

    if (!editor || !editable) return;

    const previousUrl =
      editor.getAttributes('link').href;

    const url =
      window.prompt(
        'URL del enlace:',
        previousUrl || ''
      );

    if (url === null) return;

    if (url === '') {

      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      return;

    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url
      })
      .run();

  };


  /*
  |--------------------------------------------------------------------------
  | CAMBIAR TAMAÑO DE IMAGEN
  |--------------------------------------------------------------------------
  */

  const cambiarTamanoImagen = () => {

    if (!editor || !selectedImage) {
      return;
    }

    const actual =
      editor.getAttributes('image');

    const width =
      window.prompt(
        'Ancho de imagen en px o %:',
        actual.width || '100%'
      );

    if (!width) return;

    editor
      .chain()
      .focus()
      .updateAttributes(
        'image',
        {
          width
        }
      )
      .run();

    setImageWidth(width);

  };


  /*
  |--------------------------------------------------------------------------
  | TEXTO ALTERNATIVO
  |--------------------------------------------------------------------------
  */

  const cambiarAltImagen = () => {

    if (!editor || !selectedImage) {
      return;
    }

    const actual =
      editor.getAttributes('image');

    const alt =
      window.prompt(
        'Texto alternativo:',
        actual.alt || ''
      );

    if (alt === null) return;

    editor
      .chain()
      .focus()
      .updateAttributes(
        'image',
        {
          alt
        }
      )
      .run();

  };


  /*
  |--------------------------------------------------------------------------
  | ENLACE DE IMAGEN
  |--------------------------------------------------------------------------
  */

  const agregarLinkImagen = () => {

    if (!editor || !selectedImage) {
      return;
    }

    const url =
      window.prompt(
        'URL que abrirá al hacer clic:',
        ''
      );

    if (!url) return;

    editor
      .chain()
      .focus()
      .setLink({
        href: url
      })
      .run();

  };


  /*
  |--------------------------------------------------------------------------
  | ELIMINAR IMAGEN
  |--------------------------------------------------------------------------
  */

  const eliminarImagen = () => {

    if (!editor || !selectedImage) {
      return;
    }

    editor
      .chain()
      .focus()
      .deleteSelection()
      .run();

  };


  /*
  |--------------------------------------------------------------------------
  | ALINEACIÓN
  |--------------------------------------------------------------------------
  */

  const alinearImagen = (
    alineacion:
      'left' |
      'center' |
      'right'
  ) => {

    if (!editor || !selectedImage) {
      return;
    }

    const image =
      document.querySelector(
        '.ProseMirror img.ProseMirror-selectednode'
      ) as HTMLImageElement | null;

    if (!image) return;

    if (alineacion === 'left') {

      image.style.marginLeft = '0';
      image.style.marginRight = 'auto';

    }

    if (alineacion === 'center') {

      image.style.marginLeft = 'auto';
      image.style.marginRight = 'auto';

    }

    if (alineacion === 'right') {

      image.style.marginLeft = 'auto';
      image.style.marginRight = '0';

    }

  };


  if (!editor) {

    return (
      <div className="rich-editor-loading">
        Cargando editor...
      </div>
    );

  }


  return (

    <div className="rich-editor">

      {editable && (

        <>

          {/* INPUT OCULTO */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            style={{ display: 'none' }}
            onChange={subirImagen}
          />

          {/* TOOLBAR */}

          <div className="editor-toolbar">

            {/* DESHACER */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Deshacer"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .undo()
                    .run()
                }
              >
                <Undo2 size={17} />
              </button>

              <button
                type="button"
                title="Rehacer"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .redo()
                    .run()
                }
              >
                <Redo2 size={17} />
              </button>

            </div>

            <span className="toolbar-separator" />

            {/* TÍTULOS */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Título 1"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 1
                    })
                    .run()
                }
              >
                <Heading1 size={17} />
              </button>

              <button
                type="button"
                title="Título 2"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 2
                    })
                    .run()
                }
              >
                <Heading2 size={17} />
              </button>

              <button
                type="button"
                title="Título 3"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({
                      level: 3
                    })
                    .run()
                }
              >
                <Heading3 size={17} />
              </button>

            </div>

            <span className="toolbar-separator" />

            {/* TEXTO */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Negrita"
                className={
                  editor.isActive('bold')
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBold()
                    .run()
                }
              >
                <Bold size={17} />
              </button>

              <button
                type="button"
                title="Cursiva"
                className={
                  editor.isActive('italic')
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
              >
                <Italic size={17} />
              </button>

              <button
                type="button"
                title="Tachado"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
              >
                <Strikethrough size={17} />
              </button>

            </div>

            <span className="toolbar-separator" />

            {/* LISTAS */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Lista"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleBulletList()
                    .run()
                }
              >
                <List size={17} />
              </button>

              <button
                type="button"
                title="Lista numerada"
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleOrderedList()
                    .run()
                }
              >
                <ListOrdered size={17} />
              </button>

            </div>

            <span className="toolbar-separator" />

            {/* ALINEACIÓN */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Izquierda"
                onClick={() =>
                  alinearImagen('left')
                }
                disabled={!selectedImage}
              >
                <AlignLeft size={17} />
              </button>

              <button
                type="button"
                title="Centro"
                onClick={() =>
                  alinearImagen('center')
                }
                disabled={!selectedImage}
              >
                <AlignCenter size={17} />
              </button>

              <button
                type="button"
                title="Derecha"
                onClick={() =>
                  alinearImagen('right')
                }
                disabled={!selectedImage}
              >
                <AlignRight size={17} />
              </button>

            </div>

            <span className="toolbar-separator" />

            {/* ENLACE */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Insertar enlace"
                onClick={insertarLink}
              >
                <LinkIcon size={17} />
              </button>

            </div>

            {/* IMAGEN */}

            <div className="toolbar-group">

              <button
                type="button"
                title="Insertar imagen desde computadora"
                onClick={abrirSelectorImagen}
                disabled={uploadingImage}
              >

                {uploadingImage
                  ? '...'
                  : <ImageIcon size={17} />
                }

              </button>

            </div>

            {/* HERRAMIENTAS DE IMAGEN */}

            {selectedImage && (

              <>

                <span className="toolbar-separator" />

                <div className="toolbar-group">

                  <button
                    type="button"
                    title="Cambiar tamaño"
                    onClick={cambiarTamanoImagen}
                  >
                    <Type size={17} />
                  </button>

                  <button
                    type="button"
                    title="Texto alternativo"
                    onClick={cambiarAltImagen}
                  >
                    ALT
                  </button>

                  <button
                    type="button"
                    title="Agregar enlace a imagen"
                    onClick={agregarLinkImagen}
                  >
                    <LinkIcon size={17} />
                  </button>

                  <button
                    type="button"
                    title="Eliminar imagen"
                    onClick={eliminarImagen}
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </>

            )}

          </div>

        </>

      )}

      {/* DOCUMENTO */}

      <div className="editor-scroll-area">

        <div
          className={
            `editor-document ${
              editable
                ? 'editor-document-editable'
                : 'editor-document-readonly'
            }`
          }
        >

          <EditorContent
            editor={editor}
          />

        </div>

      </div>

    </div>

  );
}