"use client";

import React from "react";
import Underline from "@tiptap/extension-underline";
import { Focus, Placeholder } from "@tiptap/extensions";
import {
  BackgroundColor,
  TextStyle,
  TextStyleKit,
} from "@tiptap/extension-text-style";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import TextAlign from "@tiptap/extension-text-align";
import Code from "@tiptap/extension-code";
import { BulletList, ListItem } from "@tiptap/extension-list";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";

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
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Underline,
      Document,
      TextStyle,
      TextStyleKit,
      BackgroundColor,
      Paragraph,
      Text,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Code,
      BulletList,
      ListItem,
      Youtube.configure({
        inline: false,
        controls: true,
        nocookie: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing ...",
      }),
      Focus.configure({
        className: "has-focus",
        mode: "all",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    autofocus: true,
    content: content || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start min-h-80 border border-gray-300 text-gray-800 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-br-md rounded-bl-md outline-none",
        style: "caret-color: black; min-height: 80px;",
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
        style={{ whiteSpace: "normal", caretColor: "black", minHeight: "80px" }}
        editor={editor}
        className="prose max-w-full [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a:hover]:text-blue-800"
      />
    </div>
  );
}
