"use client";

import { FC, useEffect, useRef, useState } from "react";
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

export default function Toolbar({ editor, description = "" }: ToolbarProps) {
  const [colorMode, setColorMode] = useState<"text" | "background">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(description);
    }
  }, [editor]);

  const addYoutubeVideo = () => {
    if (!editor) return;

    const url = prompt("Enter YouTube URL");
    if (!url) return;

    editor.commands.setYoutubeVideo({
      src: url,
      width: 640,
      height: 360,
    });
  };

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

  return (
    <div className="px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-center gap-5 w-full flex-wrap border border-gray-300">
      <div className="flex justify-start items-center gap-5 w-full flex-wrap">
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          <LuHeading1 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <LuHeading2 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <LuHeading3 className="w-5 h-5" />
        </ToolbarButton>
        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <FaAlignLeft className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <FaAlignCenter className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <FaAlignRight className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            isActive={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <FaAlignJustify className="w-5 h-5" />
          </ToolbarButton>
        </div>
        <ToolbarButton
          isActive={false}
          onClick={addYoutubeVideo}
          title="Insert YouTube video"
        >
          <FaYoutube className="w-5 h-5 text-red-600" />
        </ToolbarButton>
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
          isActive={false}
          onClick={triggerFileInput}
          title="Insert image"
        >
          <FaImage className="w-5 h-5" />
        </ToolbarButton>
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
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
        <ToolbarButton
          isActive={editor.isActive("link")}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href || "";
            const url = prompt("Enter URL", previousUrl);
            if (url === null) return; // cancel
            if (url === "") {
              editor.chain().focus().unsetLink().run(); // remove link
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          title="Insert link"
        >
          <FaLink className="w-5 h-5 text-blue-600" />
        </ToolbarButton>

        <ToolbarButton
          isActive={false}
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove link"
        >
          <FaUnlink className="w-5 h-5 text-red-500" />
        </ToolbarButton>
        {/* Color mode toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setColorMode("text")}
            className={`p-2 rounded-lg ${
              colorMode === "text" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            title="Text color"
          >
            <RiFontColor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setColorMode("background")}
            className={`p-2 rounded-lg ${
              colorMode === "background" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            title="Background color"
          >
            <RiPaintFill className="w-5 h-5" />
          </button>
          {/* Background Color Controls */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              onInput={(event) =>
                editor
                  .chain()
                  .focus()
                  .setBackgroundColor(event.currentTarget.value)
                  .run()
              }
              value={
                colorMode === "text"
                  ? editorState.textColor || "#000000"
                  : editorState.backgroundColor || "#FFFFFF"
              }
              data-testid={`set${
                colorMode === "text" ? "Text" : "Background"
              }Color`}
            />
            {COLOR_PALETTE.map((color) => (
              <ColorButton
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                isActive={editorState.activeColors[color.value]}
                color={color.value}
                testId={`set${color.name}`}
                borderColor={color.value === "#FFFFFF" ? "#cccccc" : undefined}
              />
            ))}
            <button
              onClick={handleUnsetColor}
              data-testid={`unset${
                colorMode === "text" ? "Text" : "Background"
              }Color`}
              className="p-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              title={`Unset ${colorMode} color`}
            >
              ×
            </button>
          </div>
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
      color: isActive ? "#ffffff" : "#374151",
      backgroundColor: isActive ? Colors.primary : "transparent",
    }}
    title={title}
  >
    {children}
  </button>
);
