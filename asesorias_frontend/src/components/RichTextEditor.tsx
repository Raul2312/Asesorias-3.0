import React, { useEffect } from 'react';

import {
  EditorContent,
  useEditor,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';

import Underline from '@tiptap/extension-underline';

import Link from '@tiptap/extension-link';

import Image from '@tiptap/extension-image';

import TextAlign from '@tiptap/extension-text-align';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  ImagePlus,
  Link as LinkIcon,
  Unlink,
  Minus,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

import '../css/rich_text_editor.css';


/* =========================================================
   PROPS
========================================================= */

interface RichEditorProps {

  content: string;

  onChange: (content: string) => void;

  readOnly?: boolean;

}


/* =========================================================
   IMAGEN PERSONALIZADA
========================================================= */

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: null,

        parseHTML: element =>
          element.getAttribute('width') ||
          element.style.width ||
          null,

        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }

          return {
            width: attributes.width,
            style: `width: ${attributes.width}; height: auto;`,
          };
        },
      },
    };
  },
});


/* =========================================================
   COMPONENTE
========================================================= */

export default function RichEditor({

  content,

  onChange,

  readOnly = false,

}: RichEditorProps) {


  /* =======================================================
     EDITOR TIPTAP
  ======================================================= */

  const editor = useEditor({

    editable: !readOnly,

    extensions: [

      /*
       * Tiptap 3
       *
       * Desactivamos Link del StarterKit
       * porque lo agregamos manualmente.
       */

      StarterKit.configure({

        link: false,

      }),


      /* SUBRAYADO */

      Underline,


      /* ENLACES */

      Link.configure({

        openOnClick: false,

        autolink: true,

        defaultProtocol: 'https',

      }),


      /* IMÁGENES */

      CustomImage.configure({

        inline: false,

        allowBase64: true,

      }),


      /* ALINEACIÓN */

      TextAlign.configure({

        types: [

          'heading',

          'paragraph',

        ],

      }),

    ],


    /*
     * Contenido inicial
     */

    content,


    /*
     * CADA VEZ QUE EL USUARIO ESCRIBE
     */

    onUpdate: ({ editor }) => {

      const html = editor.getHTML();

      onChange(html);

    },

  });


  /* =======================================================
     ACTUALIZAR CONTENIDO EXTERNO
  ======================================================= */

  useEffect(() => {

    if (!editor) return;


    const currentHTML = editor.getHTML();


    if (

      content !== currentHTML &&

      !editor.isFocused

    ) {

      editor.commands.setContent(content || '', {

        emitUpdate: false,

      });

    }

  }, [content, editor]);


  /* =======================================================
     CAMBIAR MODO EDITABLE
  ======================================================= */

  useEffect(() => {

    if (!editor) return;

    editor.setEditable(!readOnly);

  }, [readOnly, editor]);


  /* =======================================================
     CARGANDO
  ======================================================= */

  if (!editor) {

    return (

      <div className="rich-editor-loading">

        Cargando editor...

      </div>

    );

  }


  /* =======================================================
     IMAGEN DESDE PC
  ======================================================= */

  const addImageFromComputer = () => {

    if (readOnly) return;


    const input = document.createElement('input');

    input.type = 'file';

    input.accept = 'image/*';


    input.onchange = event => {

      const target = event.target as HTMLInputElement;

      const file = target.files?.[0];


      if (!file) return;


      /*
       * Convertimos la imagen a Base64
       */

      const reader = new FileReader();


      reader.onload = () => {

        const src = reader.result as string;


        editor
          .chain()
          .focus()
          .setImage({

            src,

          })
          .run();

      };


      reader.readAsDataURL(file);

    };


    input.click();

  };


  /* =======================================================
     AGREGAR LINK
  ======================================================= */

  const addLink = () => {

    if (readOnly) return;


    const previousUrl = editor.getAttributes('link').href;


    const url = window.prompt(

      'Introduce el enlace:',

      previousUrl || 'https://'

    );


    if (url === null) {

      return;

    }


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

      .extendMarkRange('link')

      .setLink({

        href: url,

      })

      .run();

  };


  /* =======================================================
     BOTÓN TOOLBAR
  ======================================================= */

  const ToolbarButton = ({

    onClick,

    title,

    active = false,

    disabled = false,

    children,

  }: {

    onClick: () => void;

    title: string;

    active?: boolean;

    disabled?: boolean;

    children: React.ReactNode;

  }) => (

    <button

      type="button"

      title={title}

      onClick={onClick}

      disabled={disabled}

      className={active ? 'active' : ''}

    >

      {children}

    </button>

  );


  /* =======================================================
     RETURN
  ======================================================= */

  return (

    <div className="rich-editor">


      {/* =================================================
          BARRA DE HERRAMIENTAS
      ================================================= */}

      {!readOnly && (

        <div className="editor-toolbar">


          {/* DESHACER / REHACER */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Deshacer"

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .undo()

                  .run()

              }

              disabled={

                !editor.can()

                  .chain()

                  .focus()

                  .undo()

                  .run()

              }

            >

              <Undo2 size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Rehacer"

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .redo()

                  .run()

              }

              disabled={

                !editor.can()

                  .chain()

                  .focus()

                  .redo()

                  .run()

              }

            >

              <Redo2 size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* TÍTULOS */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Título 1"

              active={editor.isActive('heading', {

                level: 1,

              })}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleHeading({

                    level: 1,

                  })

                  .run()

              }

            >

              <Heading1 size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Título 2"

              active={editor.isActive('heading', {

                level: 2,

              })}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleHeading({

                    level: 2,

                  })

                  .run()

              }

            >

              <Heading2 size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Título 3"

              active={editor.isActive('heading', {

                level: 3,

              })}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleHeading({

                    level: 3,

                  })

                  .run()

              }

            >

              <Heading3 size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* FORMATO */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Negrita"

              active={editor.isActive('bold')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleBold()

                  .run()

              }

            >

              <Bold size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Cursiva"

              active={editor.isActive('italic')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleItalic()

                  .run()

              }

            >

              <Italic size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Subrayado"

              active={editor.isActive('underline')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleUnderline()

                  .run()

              }

            >

              <UnderlineIcon size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Tachado"

              active={editor.isActive('strike')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleStrike()

                  .run()

              }

            >

              <Strikethrough size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* ALINEACIÓN */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Alinear izquierda"

              active={

                editor.isActive({

                  textAlign: 'left',

                })

              }

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .setTextAlign('left')

                  .run()

              }

            >

              <AlignLeft size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Centrar"

              active={

                editor.isActive({

                  textAlign: 'center',

                })

              }

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .setTextAlign('center')

                  .run()

              }

            >

              <AlignCenter size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Alinear derecha"

              active={

                editor.isActive({

                  textAlign: 'right',

                })

              }

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .setTextAlign('right')

                  .run()

              }

            >

              <AlignRight size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Justificar"

              active={

                editor.isActive({

                  textAlign: 'justify',

                })

              }

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .setTextAlign('justify')

                  .run()

              }

            >

              <AlignJustify size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* LISTAS */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Lista"

              active={editor.isActive('bulletList')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleBulletList()

                  .run()

              }

            >

              <List size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Lista numerada"

              active={editor.isActive('orderedList')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleOrderedList()

                  .run()

              }

            >

              <ListOrdered size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* CITA */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Cita"

              active={editor.isActive('blockquote')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .toggleBlockquote()

                  .run()

              }

            >

              <Quote size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* IMAGEN */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Agregar imagen desde mi PC"

              onClick={addImageFromComputer}

            >

              <ImagePlus size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* LINK */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Agregar enlace"

              active={editor.isActive('link')}

              onClick={addLink}

            >

              <LinkIcon size={18} />

            </ToolbarButton>


            <ToolbarButton

              title="Quitar enlace"

              disabled={!editor.isActive('link')}

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .unsetLink()

                  .run()

              }

            >

              <Unlink size={18} />

            </ToolbarButton>

          </div>


          <div className="toolbar-separator" />


          {/* SEPARADOR */}

          <div className="toolbar-group">

            <ToolbarButton

              title="Línea horizontal"

              onClick={() =>

                editor

                  .chain()

                  .focus()

                  .setHorizontalRule()

                  .run()

              }

            >

              <Minus size={18} />

            </ToolbarButton>

          </div>


        </div>

      )}


      {/* =================================================
          ÁREA CON SCROLL
      ================================================= */}

      <div className="editor-scroll-area">


        {/* =================================================
            HOJA
        ================================================= */}

        <div

          className={`editor-document ${

            readOnly

              ? 'editor-document-readonly'

              : 'editor-document-editable'

          }`}

        >

          <EditorContent

            editor={editor}

          />

        </div>


      </div>


    </div>

  );

}