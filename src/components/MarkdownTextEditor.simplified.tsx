import { Remirror, useRemirror, useRemirrorContext } from "@remirror/react"
import { extensions } from "./extensions";
import React, { createContext, useContext, useEffect, useCallback, useMemo, memo } from "react";
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
import DataObjectIcon from '@mui/icons-material/DataObject';
import InsertPageBreakIcon from '@mui/icons-material/InsertPageBreak';
import 'remirror/styles/all.css';

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

const EditorProvider: React.FC<EditorProviderProps> = memo(({ children, onMarkdownChange, markdown }) => {
  const visualManager = useRemirror({
    extensions,
    stringHandler: "markdown",
    content: markdown,
    selection: "end",
  });

  const markdownManager = useRemirror({
    extensions: extensions,
    stringHandler: "markdown",
  });

   useEffect(() => {
    if (markdown && visualManager.manager && visualManager.manager.view) {
      const state = visualManager.manager.createState({
        content: markdown,
        stringHandler: "markdown",
      });
      visualManager.manager.view.updateState(state);
    }
  }, [markdown, visualManager.manager]);


  const contextValue = useMemo(() => ({
    visualManager: visualManager.manager,
    markdownManager: markdownManager.manager,
    currentMarkdown: markdown || "",
    setCurrentMarkdown: (value: string) => {
      if (onMarkdownChange) {
        onMarkdownChange(value);
      }
    }
  }), [visualManager.manager, markdownManager.manager, markdown, onMarkdownChange]);

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
});

const StyledEditor = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;

  *:focus {
    outline: none;
  }

  /* Table styling */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
    border: 1px solid #ddd;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f0f0f0;
  }

  .ProseMirror-selectednode {
    background-color: #e3f2fd !important;
  }

  /* Table controls */
  .tableWrapper {
    overflow-x: auto;
  }
`;

const Editor = memo(() => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Editor must be used within EditorProvider");

  const { visualManager, setCurrentMarkdown } = context;
  
  const handleChange = useCallback(({ helpers, state }) => {
    const markdown = helpers.getMarkdown(state);
    setCurrentMarkdown(markdown);
  }, [setCurrentMarkdown]);

  return (
    <StyledEditor>
      <Remirror
        manager={visualManager}
        autoFocus
        onChange={handleChange}
      />
    </StyledEditor>
  );
});

const StyledPreview = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #1f1f1f;
  color: #f8f8f2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow-x: auto;

  pre {
    margin: 0;
    padding: 0;
    font-family: monospace;
  }
`;

const Preview = memo(() => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("Preview must be used within EditorProvider");

  const { markdownManager, currentMarkdown } = context;

  const createMarkdownContent = useCallback(() => {
    if (!markdownManager || !markdownManager.view) return;
    
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
  }, [currentMarkdown, markdownManager]);

  useEffect(() => {
    createMarkdownContent();
  }, [createMarkdownContent]);

  return (
    <StyledPreview>
      <Remirror
        manager={markdownManager}
        autoFocus={false}
      />
    </StyledPreview>
  );
});


const StyledToolbar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
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

const StyledIconButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  & > button {
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
  };
`;

const CustomToolbar = memo((Props: { showTableUtils?: boolean }) => {
  const { showTableUtils } = Props;
  const context = useContext(EditorContext);
  if (!context) throw new Error("CustomToolbar must be used within EditorProvider");
  const { visualManager } = context;

  const ToolbarContent = memo(() => {
    const { commands, active } = useRemirrorContext({ autoUpdate: true });

    return (
      <StyledToolbar>
        <StyledIconButton
          className={active.bold() ? 'active' : ''}
          onClick={() => commands.toggleBold()}
          title="Negrito"
        >
          <FormatBoldIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.italic() ? 'active' : ''}
          onClick={() => commands.toggleItalic()}
          title="Itálico"
        >
          <FormatItalicIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.strike() ? 'active' : ''}
          onClick={() => commands.toggleStrike()}
          title="Sublinhado"
        >
          <StrikethroughSIcon />
        </StyledIconButton>
        <StyledIconButtonGroup>
          <StyledIconButton
            className={active.heading({ level: 1 }) ? 'active' : ''}
            onClick={() => commands.toggleHeading({ level: 1 })}
            title="Título 1"
          >
            H1
          </StyledIconButton>
          <StyledIconButton
            className={active.heading({ level: 2 }) ? 'active' : ''}
            onClick={() => commands.toggleHeading({ level: 2 })}
            title="Título 2"
          >
            H2
          </StyledIconButton>
          <StyledIconButton
            className={active.heading({ level: 3 }) ? 'active' : ''}
            onClick={() => commands.toggleHeading({ level: 3 })}
            title="Título 3"
          >
            H3
          </StyledIconButton>
          </StyledIconButtonGroup>
        <StyledIconButton
          className={active.code() ? 'active' : ''}
          onClick={() => commands.toggleCode()}
          title="Código (inline)"
        >
          <CodeIcon />
        </StyledIconButton>
        <StyledIconButton
          onClick={() => commands.createCodeBlock({ language: 'json' })}
          title="Bloco de Código (JSON)"
        >
          <DataObjectIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.blockquote() ? 'active' : ''}
          onClick={() => commands.toggleBlockquote()}
          title="Citação"
        >
          <FormatQuoteIcon />
        </StyledIconButton>

        <StyledIconButton
          onClick={() => commands.undo()}
          title="Desfazer"
        >
          <UndoIcon />
        </StyledIconButton>

        <StyledIconButton
          onClick={() => commands.redo()}
          title="Refazer"
        >
          <RedoIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.bulletList() ? 'active' : ''}
          onClick={() => commands.toggleBulletList()}
          title="Lista com marcadores"
        >
          <FormatListBulletedIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.orderedList() ? 'active' : ''}
          onClick={() => commands.toggleOrderedList()}
          title="Lista numerada"
        >
          <FormatListNumberedIcon />
        </StyledIconButton>
        <StyledIconButton
          className={active.hardBreak() ? 'active' : ''}
          onClick={() => commands.insertHardBreak()}
          title="Quebra de linha"
        >
          <InsertPageBreakIcon />
        </StyledIconButton>
        {showTableUtils && (
          <><StyledIconButton
            onClick={() => commands.createTable()}
            title="Adicionar Tabela"
          >
            <img src="/table-add.svg" alt="Table" style={{ width: '24px', height: '30px' }} />
          </StyledIconButton><StyledIconButton
            onClick={() => commands.addTableRowAfter()}
            title="Adicionar Linha à Tabela"
          >
              <img src="/add-row.svg" alt="Add Row" style={{ width: '24px', height: '30px' }} />
            </StyledIconButton><StyledIconButton
              onClick={() => commands.addTableColumnAfter()}
              title="Adicionar Coluna à Tabela"
            >
              <img src="/add-column.svg" alt="Add Column" style={{ width: '24px', height: '30px' }} />
            </StyledIconButton><StyledIconButton
              onClick={() => commands.deleteTableRow()}
              title="Excluir Linha da Tabela"
            >
              <img src="/table-row-remove.svg" alt="Delete Row" style={{ width: '24px', height: '30px' }} />
            </StyledIconButton><StyledIconButton
              onClick={() => commands.deleteTableColumn()}
              title="Excluir Coluna da Tabela"
            >
              <img src="/table-delete-column.svg" alt="Delete Column" style={{ width: '24px', height: '30px' }} />
            </StyledIconButton></>
        )}
      </StyledToolbar>
    );
  });

  if (!visualManager) {
    return null;
  }

  return (
    <Remirror manager={visualManager}>
      <ToolbarContent />
    </Remirror>
  );
});

interface MarkdownTextEditorComponentProps {
  markdown?: string;
  onMarkdownChange?: (markdown: string) => void;
  showPreview?: boolean;
  showTableUtils?: boolean;
}

export const MarkdownTextEditorComponent = memo((Props: MarkdownTextEditorComponentProps) => {
  const { markdown, onMarkdownChange, showPreview, showTableUtils } = Props;
  return (
    <EditorProvider markdown={markdown} onMarkdownChange={onMarkdownChange}>
      <CustomToolbar showTableUtils={showTableUtils} />
      <Editor />
      {showPreview && <Preview />}
    </EditorProvider>
  );
});

