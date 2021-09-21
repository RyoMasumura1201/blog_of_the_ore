import { CodeComponent } from 'react-markdown/lib/ast-to-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { sunburst } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CodeBlock: CodeComponent = ({ inline, className, children }) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : '';
  return (
    <SyntaxHighlighter
      style={sunburst}
      language={lang}
      children={String(children).replace(/\n$/, '')}
    />
  );
};

export default CodeBlock;