"use client";
import React, {
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ChangeEvent,
  FocusEvent,
  ReactNode,
} from "react";
import { MinusCircle } from "react-feather";

interface TagsInputProps {
  name: string;
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ name, value, onChange }: TagsInputProps) {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>(value || []);

  const input = useRef<HTMLInputElement | null>(null);
  const tagsInput = useRef<HTMLDivElement | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value !== ",") setTag(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;

    if (key === "," || key === "Enter") {
      e.preventDefault();
      if (!tag.trim()) return;

      if (tags.includes(tag)) return setTag("");

      const newTags = [...tags, tag.trim()];
      setTags(newTags);
      setTag("");
      onChange(newTags);
    }

    if (key === "Backspace" && !tag && tags.length) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onChange(newTags);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    onChange(newTags);
  };

  const handleOnFocus = (_e: FocusEvent<HTMLInputElement>) => {
    tagsInput.current?.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current?.classList.add("dark:border-white", "border-primary");
  };

  const handleOnBlur = (_e: FocusEvent<HTMLInputElement>) => {
    tagsInput.current?.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current?.classList.remove("dark:border-white", "border-primary");
  };

  useEffect(() => {
    if (value?.length) setTags(value);
  }, [value]);

  useEffect(() => {
    input.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "end",
    });
  }, [tag]);

  return (
    <div>
      <div
        ref={tagsInput}
        onKeyDown={handleKeyDown}
        className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      >
        {tags.map((t) => (
          <Tag key={t} onClick={() => removeTag(t)}>
            {t}
          </Tag>
        ))}
        <input
          ref={input}
          type="text"
          id={name}
          className="h-full flex-grow bg-transparent outline-none dark:text-white"
          placeholder="Tag one, Tag two"
          value={tag}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
}

interface TagProps {
  children: ReactNode;
  onClick: () => void;
}

const Tag = ({ children, onClick }: TagProps) => {
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {children}
      <button onClick={onClick} type="button">
        <MinusCircle size={12} />
      </button>
    </span>
  );
};
