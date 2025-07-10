import { Remirror, useRemirror } from "@remirror/react"
import { MarkdownToolbar } from "@remirror/react-ui";
import { extensions } from "./extensions";
import React, { createContext, useContext, useEffect, useState } from "react";
import { DocExtension, CodeBlockExtension } from "remirror/extensions";

const EditorContext = createContext<{
  visualManager: any;
  markdownManager: any;
  currentMarkdown: string;
  setCurrentMarkdown: (value: string) => void;
} | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
  onMarkdownChange?: (markdown: string) => void;
  markdown?: string;
}
const EditorProvider: React.FC<EditorProviderProps> = ({ children, onMarkdownChange, markdown }) => {
  
  const visualManager = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: markdown || "**Markdown** content is the _best_",
  });

  const markdownManager = useRemirror({
    extensions: () => [
      new DocExtension({ content: "codeBlock" }),
      new CodeBlockExtension({
        defaultLanguage: "markdown",
        syntaxTheme: "base16_ateliersulphurpool_light",
        defaultWrap: true,
      }),
    ],
    builtin: {
      exitMarksOnArrowPress: false,
    },
    stringHandler: "html",
  });

  return (
    <EditorContext.Provider value={{
      visualManager: visualManager.manager,
      markdownManager: markdownManager.manager,
      currentMarkdown: markdown || "",
      setCurrentMarkdown: (value: string) => {
        if (onMarkdownChange) {
          onMarkdownChange(value);
        }
      }
    }}>
      {children}
    </EditorContext.Provider>
  );
};

const Editor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Editor must be used within EditorProvider");
  
  const { visualManager, setCurrentMarkdown } = context;

  return (
    <Remirror
      manager={visualManager}
      onChange={({ helpers, state }) => {
        const markdown = helpers.getMarkdown(state);
        setCurrentMarkdown(markdown);
      }}
    />
  );
};

const Preview = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Preview must be used within EditorProvider");
  
  const { markdownManager, currentMarkdown } = context;

  useEffect(() => {
    markdownManager.view.updateState(
      markdownManager.createState({
        content: {
          type: "doc",
          content: [
            {
              type: "codeBlock",
              attrs: { language: "markdown" },
              content: currentMarkdown ? [{ type: "text", text: currentMarkdown }] : undefined,
            },
          ],
        },
      })
    );
  }, [currentMarkdown, markdownManager]);

  return (
    <Remirror
      manager={markdownManager}
      editable={false}
    />
  );
};

const Toolbar = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Toolbar must be used within EditorProvider");
  
  const { visualManager } = context;

  return (
    <Remirror manager={visualManager}>
      <MarkdownToolbar />
      
    </Remirror>
  );
};


interface MarkdownTextEditorComponentProps {
  markdown?: string;
  onMarkdownChange?: (markdown: string) => void;
}

export const MarkdownTextEditorComponent = (Props: MarkdownTextEditorComponentProps) => {
  const { markdown, onMarkdownChange } = Props;
  return (
    <EditorProvider markdown={markdown} onMarkdownChange={onMarkdownChange}>
      <Toolbar />
      <Editor />
      <Preview />
    </EditorProvider>
  );
}

