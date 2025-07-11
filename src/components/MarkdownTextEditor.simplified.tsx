import { Remirror, useRemirror, useRemirrorContext } from "@remirror/react"
import { CreateTableButton, MarkdownToolbar } from "@remirror/react-ui";
import { extensions } from "./extensions";
import React, { createContext, useContext, useEffect } from "react";
import { DocExtension, CodeBlockExtension } from "remirror/extensions";
import styled from "styled-components";
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';

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
  
  const StyledToolbarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  `;

  const TableToolbarContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const TableToolbarTitle = styled.h3`
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #495057;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;

  const ButtonRow = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  `;

  const StyledButton = styled(Button)`
    &.MuiButton-root {
      min-width: 80px;
      padding: 6px 12px;
      height: 36px;
      font-size: 12px;
      font-weight: 500;
      background-color: transparent;
      color: #495057;
      border: 1px solid #ced4da;
      text-transform: none;
      
  }
  `;

  const TableToolbar = () => {
    const context = useRemirrorContext();
    if (!context) throw new Error("TableToolbar must be used within EditorProvider");
    const commands = context.commands;
    
    return (
      <TableToolbarContainer>
        <TableToolbarTitle>Ferramentas de Tabela</TableToolbarTitle>
        
        <ButtonRow>
         <StyledButton 
            variant="contained"
            className="add-button"
            onClick={() => commands.createTable()}
          >
            <AddCircleIcon fontSize="small" />
            Nova Tabela
          </StyledButton>
          <StyledButton 
            variant="contained"
            className="add-button"
            onClick={() => commands.addTableRowAfter()}
          >
            <AddIcon />
            Nova Linha
          </StyledButton>
          
          <StyledButton 
            variant="contained"
            className="add-button"
            onClick={() => commands.addTableColumnAfter()}
          >
            <AddIcon />
            Nova Coluna
          </StyledButton>
          
          <StyledButton 
            variant="contained"
            className="delete-button"
            onClick={() => commands.deleteTableRow()}
          >
            <DeleteIcon fontSize="small"/>
            Excluir Linha
          </StyledButton>
          
          <StyledButton
            variant="contained"
            className="delete-button"
            onClick={() => commands.deleteTableColumn()}
          >
            <DeleteIcon fontSize="small"/>
            Excluir Coluna
          </StyledButton>
          <StyledButton
            variant="contained"
            className="delete-button"
            onClick={() => commands.deleteTable()}
          >
            <DeleteIcon fontSize="small"/>
            Excluir Tabela
          </StyledButton>
        </ButtonRow>
      </TableToolbarContainer>
    );
  }

  if (!visualManager) {
    return null;
  }

  return (
    <Remirror manager={visualManager}>
      <StyledToolbarWrapper>
        <MarkdownToolbar />
        <TableToolbar />
      </StyledToolbarWrapper>
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
      <Toolbar />
      <Editor />
      <Preview />
    </EditorProvider>
  );
}

