# Editor de Texto Markdown

Um editor de texto Markdown construído com React, TypeScript e Remirror.

### Exemplo de Uso

```tsx
import { MarkdownTextEditorComponent } from './components/MarkdownTextEditor.simplified';

function App() {
  const [markdown, setMarkdown] = useState("");

  return (
    <MarkdownTextEditorComponent
      markdown={markdown}
      onMarkdownChange={setMarkdown}
      showPreview={true}
      showTableUtils={true}
    />
  );
}
```

## Próximas Funcionalidades

- [ ] Implementar conversor completo de HTML para Markdown em [`tableHtmlToMD.ts`](src/helpers/tableHtmlToMD.ts)
