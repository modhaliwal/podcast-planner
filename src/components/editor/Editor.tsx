
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function Editor({
  value,
  onChange,
  onBlur,
  placeholder = "Enter content...",
  readOnly = false,
}: EditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      readOnly={readOnly}
      className="min-h-[200px]"
      modules={{
        toolbar: readOnly
          ? false
          : [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
      }}
    />
  );
}
