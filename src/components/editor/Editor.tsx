
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onSave?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function Editor({
  value,
  onChange,
  onBlur,
  onSave,
  placeholder = "Enter content...",
  readOnly = false,
}: EditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && onSave) {
      e.preventDefault();
      onSave(value);
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
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
    </div>
  );
}
