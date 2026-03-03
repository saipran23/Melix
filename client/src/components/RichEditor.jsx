import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Focus from "@tiptap/extension-focus";
import "./styles.css";

const RichEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),

      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),

      Image,

      Table.configure({ resizable: true }),
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
    ],
    content: "<p>Hello World 🌍</p>",
  });

  if (!editor) return null;

  return <MenuBar editor={editor} />;
};

const MenuBar = ({ editor }) => {
  const [height, setHeight] = useState(480);
  const [width, setWidth] = useState(640);

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
        width,
        height,
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
      {/* BASIC TOOLBAR */}
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

        <button onClick={addImage}>Image</button>
      </div>

      {/* HEADINGS */}
      <div className="control-group">
        {[1, 2, 3, 4, 5, 6].map((level) => (
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

      {/* TABLE */}
      <div className="control-group">
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Insert Table
        </button>

        <button onClick={() => editor.chain().focus().deleteTable().run()}>
          Delete Table
        </button>
      </div>

      {/* YOUTUBE */}
      <div className="control-group">
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          placeholder="Width"
        />
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
          placeholder="Height"
        />
        <button onClick={addYoutubeVideo}>Add YouTube</button>
      </div>

      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

export default RichEditor;