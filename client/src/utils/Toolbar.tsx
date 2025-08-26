"use client";

import { ComponentType, FC, useEffect, useRef, useState } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { BiBold, BiItalic } from "react-icons/bi";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaImage,
  FaLink,
  FaListUl,
  FaQuoteLeft,
  FaUnderline,
  FaUnlink,
  FaYoutube,
} from "react-icons/fa";
import { MdFormatStrikethrough, MdUndo } from "react-icons/md";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import { LiaListOlSolid } from "react-icons/lia";
import { IoMdRedo } from "react-icons/io";
import { IoCode } from "react-icons/io5";
import ColorButton from "./ColorButton";
import { RiFontColor, RiPaintFill } from "react-icons/ri";
import { COLOR_PALETTE, Colors } from "./Colors";

interface ToolbarProps {
  editor: Editor | null;
  content?: string;
  description?: string;
}

const alignments: [
  align: "left" | "center" | "right" | "justify",
  Icon: ComponentType<any>
][] = [
  ["left", FaAlignLeft],
  ["center", FaAlignCenter],
  ["right", FaAlignRight],
  ["justify", FaAlignJustify],
];

export default function Toolbar({ editor, description = "" }: ToolbarProps) {
  const [colorMode, setColorMode] = useState<"text" | "background">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(description);
    }
  }, [editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (ctx.editor) {
        return {
          textColor: ctx.editor.getAttributes("textStyle").color,
          backgroundColor:
            ctx.editor.getAttributes("textStyle").backgroundColor,
          activeColors: COLOR_PALETTE.reduce((acc, color) => {
            if (ctx.editor && colorMode === "text") {
              acc[color.value] = ctx.editor.isActive("textStyle", {
                color: color.value,
              });
            } else {
              if (ctx.editor) {
                acc[color.value] = ctx.editor.isActive("textStyle", {
                  backgroundColor: color.value,
                });
              }
            }
            return acc;
          }, {} as Record<string, boolean>),
          isLeftAligned: ctx.editor.isActive({ textAlign: "left" }),
          isCenterAligned: ctx.editor.isActive({ textAlign: "center" }),
          isRightAligned: ctx.editor.isActive({ textAlign: "right" }),
          isJustifyAligned: ctx.editor.isActive({ textAlign: "justify" }),
        };
      }
    },
  });

  if (!editor || !editorState) return null;

  const handleColorChange = (color: string) => {
    if (colorMode === "text") {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().setBackgroundColor(color).run();
    }
  };

  const handleUnsetColor = () => {
    if (colorMode === "text") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().unsetBackgroundColor().run();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          editor
            .chain()
            .focus()
            .setImage({ src: fileReader.result as string })
            .run();
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (!url) return;

    editor.commands.setYoutubeVideo({
      src: url,
      width: 640,
      height: 360,
    });
  };

  return (
    <div className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-center gap-5 w-full flex-wrap border border-gray-300">
      <div className="flex flex-wrap items-center gap-2">
        {/* Headings */}
        {([1, 2, 3] as const).map((level) => (
          <ToolbarButton
            key={level}
            isActive={editor.isActive("heading", { level: level as 1 | 2 | 3 })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run()
            }
          >
            {level === 1 ? (
              <LuHeading1 className="w-5 h-5" />
            ) : level === 2 ? (
              <LuHeading2 className="w-5 h-5" />
            ) : (
              <LuHeading3 className="w-5 h-5" />
            )}
          </ToolbarButton>
        ))}

        {/* Alignment */}
        {alignments.map(([align, Icon]) => (
          <ToolbarButton
            key={align}
            isActive={editor.isActive({ textAlign: align as any })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign(align as any)
                .run()
            }
          >
            <Icon className="w-5 h-5" />
          </ToolbarButton>
        ))}

        {/* Lists */}
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

        {/* Formatting */}
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

        {/* Code Block */}
        <ToolbarButton
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <IoCode className="w-5 h-5" />
        </ToolbarButton>

        {/* Blockquote */}
        <ToolbarButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteLeft className="w-5 h-5" />
        </ToolbarButton>

        {/* Undo / Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
        >
          <MdUndo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
        >
          <IoMdRedo className="w-5 h-5" />
        </ToolbarButton>

        {/* Links */}
        <ToolbarButton
          isActive={editor.isActive("link")}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href || "";
            const url = prompt("Enter URL", previousUrl);
            if (url === null) return;
            if (!url) editor.chain().focus().unsetLink().run();
            else
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
          }}
        >
          <FaLink className="w-5 h-5 text-blue-600" />
        </ToolbarButton>
        <ToolbarButton
          isActive={false}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <FaUnlink className="w-5 h-5 text-red-500" />
        </ToolbarButton>

        {/* Image & YouTube */}
        <ToolbarButton onClick={triggerFileInput} isActive={false}>
          <FaImage className="w-5 h-5" />
        </ToolbarButton>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <ToolbarButton onClick={addYoutubeVideo} isActive={false}>
          <FaYoutube className="w-5 h-5 text-red-600" />
        </ToolbarButton>

        {/* Color Mode */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setColorMode("text")}
            className={`p-2 rounded-lg ${
              colorMode === "text" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            title="Text color"
          >
            T
          </button>
          <button
            onClick={() => setColorMode("background")}
            className={`p-2 rounded-lg ${
              colorMode === "background" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            title="Background color"
          >
            B
          </button>
          <input
            type="color"
            value={
              colorMode === "text"
                ? editorState.textColor || "#000000"
                : editorState.backgroundColor || "#ffffff"
            }
            onInput={(e) => handleColorChange(e.currentTarget.value)}
          />
          {COLOR_PALETTE.map((color) => (
            <ColorButton
              key={color.value}
              color={color.value}
              isActive={editorState.activeColors[color.value]}
              onClick={() => handleColorChange(color.value)}
              testId={`set-${color.value.replace("#", "")}`}
            />
          ))}
          <button
            onClick={handleUnsetColor}
            className="p-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            title="Unset color"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  isActive: boolean;
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const ToolbarButton: FC<ToolbarButtonProps> = ({
  isActive,
  onClick,
  children,
  title,
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="p-2 rounded-lg hover:bg-gray-100"
    style={{
      color: isActive ? "#ffffff" : "#6a7282",
      backgroundColor: isActive ? Colors.primary : "transparent",
    }}
    title={title}
  >
    {children}
  </button>
);
