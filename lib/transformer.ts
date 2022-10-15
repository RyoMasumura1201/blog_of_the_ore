import unified from 'unified';
import { Node, Parent } from 'unist';
import { VFileCompatible } from 'vfile';
import { Code } from 'mdast';
import { visit } from 'unist-util-visit';
import { H, all } from 'mdast-util-to-hast';
import { MdastNode } from 'mdast-util-to-hast/lib/traverse';

export const plugin: unified.Plugin = () => {
  return (tree: Node, _file: VFileCompatible) => {
    visit(tree, isCode, visitor);
  };
};

function isCode(node: unknown): node is Code {
  return isNode(node) && node.type === 'code';
}

function isObject(target: unknown): target is { [key: string]: unknown } {
  return typeof target === 'object' && target !== null;
}
function isNode(node: unknown): node is Node {
  return isObject(node) && 'type' in node;
}

const visitor = (node: Code, index: number, parent: Parent | undefined) => {
  if (!node.lang) {
    node.lang = 'sh';
    return;
  }
  const langAndName = node.lang.split(':');
  const lang = langAndName[0];
  node.lang = lang;
  const name = langAndName.length > 1 ? langAndName[1] : undefined;
  const fileName = { type: 'fileName', value: name };
  const codeBlock = name
    ? { type: 'codeBlock', children: [fileName, node] }
    : { type: 'codeBlock', children: [node] };
  if (name) {
    node.value = '\n' + node.value;
  }

  parent.children.splice(index, 1, codeBlock);
};

export const fileNamehandler = (_h: H, node) => {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['fileName'],
    },
    children: [{ type: 'text', value: node.value }],
  };
};

export const codeBlockHandler = (h: H, node: MdastNode) => {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['parentCodeBlock'],
    },
    children: all(h, node),
  };
};
