import styled from "styled-components";
import { DualEditor } from "./components/MarkdownTextEditor";
import { MarkdownTextEditorComponent } from "./components/MarkdownTextEditor.simplified";
import { useState } from "react";


const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
`;

const ContentBlock = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;

  h3 {
    margin-top: 0;
    color: #555;
  }
`;

function App() {
  const [markdown, setMarkdown] = useState("**Markdown** content is the _best_");

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };
  return (
    <Container>
      <MarkdownTextEditorComponent
        markdown={markdown}
        onMarkdownChange={handleMarkdownChange}
      />
      {/* <DualEditor /> */}
    </Container>
  );
}

export default App;