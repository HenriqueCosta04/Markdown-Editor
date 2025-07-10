import jsx from "refractor/lang/jsx";
import markdown from "refractor/lang/markdown";
import { ExtensionPriority } from "remirror";
import { LinkExtension, BoldExtension, StrikeExtension, ItalicExtension, HeadingExtension, BlockquoteExtension, BulletListExtension, OrderedListExtension, ListItemExtension, CodeExtension, CodeBlockExtension, TrailingNodeExtension, TableExtension, MarkdownExtension, HardBreakExtension } from "remirror/extensions";

export const extensions = () => [
  new LinkExtension({ autoLink: true }),
  new BoldExtension({}),
  new StrikeExtension(),
  new ItalicExtension(),
  new HeadingExtension({}),
  new BlockquoteExtension(),
  new BulletListExtension({ enableSpine: true }),
  new OrderedListExtension(),
  new ListItemExtension({
    priority: ExtensionPriority.High,
    enableCollapsible: true,
  }),
  new CodeExtension(),
  new CodeBlockExtension({ supportedLanguages: [jsx, markdown] }),
  new TrailingNodeExtension({}),
  new TableExtension({}),
  new MarkdownExtension({ copyAsMarkdown: false }),
  /**
   * `HardBreakExtension` allows us to create a newline inside paragraphs.
   * e.g. in a list item
   */
  new HardBreakExtension(),
];
