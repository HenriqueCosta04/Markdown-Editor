import styled from "styled-components";
import { MarkdownTextEditorComponent } from "./components/MarkdownTextEditor.simplified";
import { useState } from "react";
import { ThemeProvider } from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';

const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const EditorStyles = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;

  strong {
    font-weight: bold;
  }
  
  em {
    font-style: italic;
  }

  pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    color: #333;
  }

  h1 {
    font-size: 24px;
    margin-top: 20px;
    font-weight: bold;
  }

  h2 {
    font-size: 20px;
    margin-top: 15px;
    font-weight: bold;
  }

  h3 {
    font-size: 18px;
    margin-top: 10px;
    font-weight: bold;
  }

  h4 {
    font-size: 16px;
    margin-top: 10px;
    font-weight: bold;
  }

  h5 {
    font-size: 14px;
    margin-top: 10px;
    font-weight: bold;
  }

  h6 {
    font-size: 12px;
    margin-top: 10px;
    font-weight: bold;
  }

  ul, ol {
    margin-left: 20px;
    margin-top: 10px;
    list-style-position: outside;
  }

  li {
    margin-bottom: 5px;
    color: #333;
  }

  blockquote {
    border-left: 4px solid #000;
    padding-left: 10px;
    color: #555;
    margin: 10px 0;
  }

  code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 4px;
  }

  pre code {
    display: block;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    color: #fff;
    background-color: transparent;
}
`;

function App() {
  const [markdown, setMarkdown] = useState("**Markdown** content is the _best_");

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };
  
  return (
    <Container>
      <h1>Markdown Text Editor</h1>
      <p>Edit your markdown content below:</p>
      <AllStyledComponent>
      <EditorStyles>
      <MarkdownTextEditorComponent
        markdown={markdown}
        onMarkdownChange={handleMarkdownChange}
        showPreview={true}
        showTableUtils={false}
      />
      </EditorStyles>
      </AllStyledComponent>
      {/* <DualEditor /> */}
    </Container>
  );
}

export default App;