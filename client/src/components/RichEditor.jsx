import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Focus from "@tiptap/extension-focus";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";

import "./styles.css";

const RichEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),

      Heading.configure({
        levels: [1, 2, 3],
      }),

      Image.configure({
        allowBase64: true,
      }),

      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      Youtube.configure({
        allowFullscreen: true,
      }),

      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
      }),

      Typography,
      TextStyle,

      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
    ],

    content: value || "",

    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
    },

    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return <MenuBar editor={editor} />;
};

const MenuBar = ({ editor }) => {
  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const setLink = () => {
    const url = window.prompt("Enter URL");

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="editor-wrapper">

      {/* TOOLBAR */}
      <div className="toolbar">

        <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>

        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "active" : ""}
        >
          Underline
        </button>

        <button onClick={setLink}>Link</button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet List
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Ordered List
        </button>

        <button onClick={addImage}>
          Image
        </button>

        <button onClick={addYoutubeVideo}>
          YouTube
        </button>

      </div>

      {/* HEADINGS */}
      <div className="control-group">
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={
              editor.isActive("heading", { level }) ? "active" : ""
            }
          >
            H{level}
          </button>
        ))}
      </div>

      {/* TEXT ALIGN */}
      <div className="control-group">
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          Left
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          Center
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          Right
        </button>

        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          Justify
        </button>
      </div>

      {/* TABLE */}
      <div className="control-group">

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        >
          Insert Table
        </button>

        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          Delete Table
        </button>

      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} className="editor-content" />

    </div>
  );
};

export default RichEditor;