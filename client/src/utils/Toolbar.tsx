"use client";

import { useEffect } from "react";
import { Editor } from "@tiptap/react";
import { BiBold, BiItalic } from "react-icons/bi";
import { FaListUl, FaQuoteLeft, FaUnderline } from "react-icons/fa";
import { MdFormatStrikethrough, MdUndo } from "react-icons/md";
import { LuHeading2 } from "react-icons/lu";
import { LiaListOlSolid } from "react-icons/lia";
import { IoMdRedo } from "react-icons/io";
import { IoCode } from "react-icons/io5";

interface ToolbarProps {
  editor: Editor | null;
  content?: string;
  description?: string;
}

export default function Toolbar({ editor, description = "" }: ToolbarProps) {
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(description);
    }
  }, [description, editor]);

  if (!editor) return null;

  return (
    <div className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-center gap-5 w-full flex-wrap border border-gray-300">
      <div className="flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BiBold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <BiItalic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <MdFormatStrikethrough className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <LuHeading2 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <LiaListOlSolid className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteLeft className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().setCode().run()}
        >
          <IoCode className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={false}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <MdUndo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={false}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <IoMdRedo className="w-5 h-5" />
        </ToolbarButton>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  isActive,
  onClick,
  children,
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-2 rounded-lg ${
      isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);
