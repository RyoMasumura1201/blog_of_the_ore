import { CodeComponent } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Box } from '@chakra-ui/layout';

const CodeBlock: CodeComponent = ({ inline, className, children }) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }

  const langMatch = /language-(\w+)/.exec(className || '');
  const nameMatch = /language-(\w+)(:.+)/.exec(className || '');
  const lang = langMatch && langMatch[1] ? langMatch[1] : '';
  const name = nameMatch && nameMatch[2] ? nameMatch[2].slice(1) : '';

  return (
    <>
      {name ? (
        <Box position='relative' zIndex='-10'>
          <Box display='inline-block' position='absolute' bg='gray.100'>
            {name}
          </Box>

          <SyntaxHighlighter
            style={tomorrow}
            language={lang}
            lineProps={{ style: { whiteSpace: 'pre-wrap' } }}
            wrapLines={true}
          >
            {'\n' + String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </Box>
      ) : (
        <SyntaxHighlighter
          style={tomorrow}
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
