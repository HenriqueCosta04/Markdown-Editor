import { Remirror, useRemirror } from "@remirror/react"
import { MarkdownToolbar } from "@remirror/react-ui";
import { extensions } from "./extensions";
import React, { createContext, useContext, useState } from "react";
import "@remirror/styles/all.css";

const EditorContext = createContext<{
  editorManager: any;
  previewManager: any;
  currentMarkdown: string;
  setCurrentMarkdown: (value: string) => void;
} | null>(null);

const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMarkdown, setCurrentMarkdown] = useState("**Markdown** content is the _best_");
  
  const editorManager = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: currentMarkdown,
  });

  const previewManager = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: currentMarkdown,
  });

  return (
    <EditorContext.Provider value={{
      editorManager: editorManager.manager,
      previewManager: previewManager.manager,
      currentMarkdown,
      setCurrentMarkdown
    }}>
      {children}
    </EditorContext.Provider>
  );
};

const Editor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Editor must be used within EditorProvider");
  
  const { editorManager, setCurrentMarkdown } = context;

  return (
    <Remirror
      manager={editorManager}
      onChange={({ helpers, state }) => {
        const text = helpers.getText({ state });
        setCurrentMarkdown(text);
      }}
    />
  );
};

const Preview = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Preview must be used within EditorProvider");
  
  const { previewManager } = context;

  return (
    <Remirror
      manager={previewManager}
    />
  );
};

const Toolbar = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Toolbar must be used within EditorProvider");
  
  const { editorManager } = context;

  return (
    <Remirror manager={editorManager}>
      <MarkdownToolbar />
    </Remirror>
  );
};
// ...existing code...

const MarkdownTextEditor = {
  Provider: EditorProvider,
  Editor: Editor,
  Preview: Preview,
  Toolbar: Toolbar
};

export default MarkdownTextEditor;

/* Example

    <MarkdownTextEditor.Provider>
          <MarkdownTextEditor.Toolbar />
          <MarkdownTextEditor.Preview />
          <MarkdownTextEditor.Editor />
    </MarkdownTextEditor.Provider>
*/