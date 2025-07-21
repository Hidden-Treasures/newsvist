"use client";

import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";

interface TipTapProps {
  onChange: (content: string) => void;
  content?: string;
  description?: string;
}

export default function TextEditor({
  onChange,
  content,
  description,
}: TipTapProps) {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start min-h-80 border border-gray-300 text-gray-800 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-br-md rounded-bl-md outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    content: content || "",
    immediatelyRender: false,
  });

  return (
    <div className="w-full mt-6">
      <Toolbar
        editor={editor as Editor}
        content={content}
        description={description}
      />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
}
