import { CodeComponent } from 'react-markdown/lib/ast-to-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { sunburst } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Box } from '@chakra-ui/layout';

const CodeBlock: CodeComponent = ({ inline, className, children }) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }
  const match = /language-(\w+)(:.+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : '';
  const name = match && match[2] ? match[2].slice(1) : '';

  return (
    <>
      {name ? (
        <Box position='relative' zIndex='-10'>
          <Box display='inline-block' position='absolute' bg='gray.100'>
            {name}
          </Box>

          <SyntaxHighlighter
            style={sunburst}
            language={lang}
            lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            wrapLines={true}
          >
            {'\n' + String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Box>
      ) : (
        <SyntaxHighlighter
          style={sunburst}
          language={lang}
          lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
          wrapLines={true}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )}
    </>
  );
};

export default CodeBlock;
