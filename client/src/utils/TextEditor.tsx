"use client";

import React from "react";
import Underline from "@tiptap/extension-underline";
import { Focus, Placeholder } from "@tiptap/extensions";
import { BackgroundColor, TextStyle } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import TextAlign from "@tiptap/extension-text-align";
import Code from "@tiptap/extension-code";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

interface TipTapProps {
  onChange: (content: string) => void;
  content?: string;
  description?: string;
}

const lowlight = createLowlight(all);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("css", css);
lowlight.register("html", html);

export default function TextEditor({
  onChange,
  content,
  description,
}: TipTapProps) {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Paragraph,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      TextStyle,
      BackgroundColor,
      Image.configure({ inline: true, allowBase64: true }),
      CodeBlock,
      CodeBlockLowlight.configure({ lowlight }),
      Youtube.configure({ inline: false, controls: true, nocookie: true }),
      Placeholder.configure({ placeholder: "Start typing ..." }),
      Focus.configure({ className: "has-focus", mode: "all" }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
    ],
    autofocus: true,
    content: content || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start min-h-80 border border-gray-300 text-gray-200 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-br-md rounded-bl-md outline-none",
        style: "caret-color: white; min-height: 80px;",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full mt-6">
      <Toolbar
        editor={editor as Editor}
        content={content}
        description={description}
      />
      <EditorContent
        style={{ whiteSpace: "normal", caretColor: "white", minHeight: "80px" }}
        editor={editor}
        className="prose max-w-full [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a:hover]:text-blue-800"
      />
    </div>
  );
}
