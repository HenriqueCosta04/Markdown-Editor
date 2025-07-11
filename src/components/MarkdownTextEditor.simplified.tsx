import { Remirror, useRemirror, useRemirrorContext } from "@remirror/react"
import { extensions } from "./extensions";
import React, { createContext, useContext, useEffect } from "react";
import { DocExtension, CodeBlockExtension } from "remirror/extensions";
import { MarkdownToolbar } from "@remirror/react-ui";
import { IconButton } from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import styled from "styled-components";

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
    content: markdown || "",
  });

  const markdownManager = useRemirror({
    extensions: extensions,
    stringHandler: "markdown",
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
    if (markdownManager && markdownManager.view) {
      markdownManager.view.updateState(
        markdownManager.createState({
          content: {
            type: "doc",
            content: [
              {
                type: "codeBlock",
                attrs: { language: "markdown" },
                content: currentMarkdown ? [{ type: "text", text: currentMarkdown }] : [],
              },
            ],
          },
        })
      );
    }
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
  if (!context) throw new Error("CustomToolbar must be used within EditorProvider");
  const { visualManager } = context;


  if (!visualManager) {
    return null;
  }

  return (
    <Remirror manager={visualManager}>
      <MarkdownToolbar />
    </Remirror>
  );
}

const CustomToolbar = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("CustomToolbar must be used within EditorProvider");
  const { visualManager } = context;

  const StyledToolbar = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `;

  const StyledIconButton = styled(IconButton)`
    &.MuiIconButton-root {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #dee2e6;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 1);
      }

      &.active {
        background: #ff7f11;
        color: white;
        border-color: #ff7f11;
      }
    }
  `;

  const ToolbarContent = () => {
    const { commands, active } = useRemirrorContext({ autoUpdate: true });

    return (
      <StyledToolbar>
        <StyledIconButton
          className={active.bold() ? 'active' : ''}
          onClick={() => commands.toggleBold()}
          title="Bold"
        >
          <FormatBoldIcon />
        </StyledIconButton>

        <StyledIconButton
          className={active.italic() ? 'active' : ''}
          onClick={() => commands.toggleItalic()}
          title="Italic"
        >
          <FormatItalicIcon />
        </StyledIconButton>

        <StyledIconButton
          className={active.strike() ? 'active' : ''}
          onClick={() => commands.toggleStrike()}
          title="Strikethrough"
        >
          <StrikethroughSIcon />
        </StyledIconButton>

        <StyledIconButton
          className={active.code() ? 'active' : ''}
          onClick={() => commands.toggleCode()}
          title="Inline Code"
        >
          <CodeIcon />
        </StyledIconButton>

        <StyledIconButton
          className={active.blockquote() ? 'active' : ''}
          onClick={() => commands.toggleBlockquote()}
          title="Quote"
        >
          <FormatQuoteIcon />
        </StyledIconButton>

        <StyledIconButton
          onClick={() => commands.undo()}
          title="Undo"
        >
          <UndoIcon />
        </StyledIconButton>

        <StyledIconButton
          onClick={() => commands.redo()}
          title="Redo"
        >
          <RedoIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.bulletList() ? 'active' : ''}
          onClick={() => commands.toggleBulletList()}
          title="Bullet List"
        >
          <FormatListBulletedIcon />
        </StyledIconButton>

        <StyledIconButton
          className={active.orderedList() ? 'active' : ''}
          onClick={() => commands.toggleOrderedList()}
          title="Numbered List"
        >
          <FormatListNumberedIcon />
        </StyledIconButton>
        <StyledIconButton
          onClick={() => commands.createTable()}
          title="Create Table"
        >
          <img src="/table.svg" alt="Table" style={{ width: '24px', height: '30px' }} />
        </StyledIconButton>
        
      </StyledToolbar>
    );
  };

  if (!visualManager) {
    return null;
  }

  return (
    <Remirror manager={visualManager}>
      <ToolbarContent />
    </Remirror>
  );
}

interface MarkdownTextEditorComponentProps {
  markdown?: string;
  onMarkdownChange?: (markdown: string) => void;
}

export const MarkdownTextEditorComponent = (Props: MarkdownTextEditorComponentProps) => {
  const { markdown, onMarkdownChange } = Props;
  return (
    <EditorProvider markdown={markdown} onMarkdownChange={onMarkdownChange}>
      <CustomToolbar />
      <Editor />
      <Preview />
    </EditorProvider>
  );
}

