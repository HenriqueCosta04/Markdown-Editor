import styled from "styled-components";
import { MarkdownTextEditorComponent } from "./components/MarkdownTextEditor.simplified";
import { useState } from "react";


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


function App() {
  const [markdown, setMarkdown] = useState("**Markdown** content is the _best_");

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };
  
  return (
    <Container>
      <h1>Markdown Text Editor</h1>
      <p>Edit your markdown content below:</p>
      <MarkdownTextEditorComponent
        markdown={markdown}
        onMarkdownChange={handleMarkdownChange}
        showPreview
      />
      {/* <DualEditor /> */}
    </Container>
  );
}

export default App;