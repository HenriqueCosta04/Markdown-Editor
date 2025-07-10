import styled from "styled-components";
import { DualEditor } from "./components/MarkdownTextEditor";
import MarkdownTextEditor from "./components/MarkdownTextEditor.simplified";

const Container = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
`;

function App() {
  return (
    <>
      {/* <DualEditor /> */}
      <Container>
        <MarkdownTextEditor.Provider>
          <MarkdownTextEditor.Toolbar />
          <MarkdownTextEditor.Preview />
          <MarkdownTextEditor.Editor />
        </MarkdownTextEditor.Provider>
      </Container>
      <DualEditor />
    </>
  );
}

export default App;