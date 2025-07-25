/**
 * Light syntax highlighting theme for Claude Code
 * Uses Claude's brand colors optimized for light backgrounds
 */
export const claudeLightSyntaxTheme = {
  'pre[class*="language-"]': {
    color: '#2d3748',
    background: '#f7fafc',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'code[class*="language-"]': {
    color: '#2d3748',
    background: 'none',
    fontFamily: 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  ':not(pre) > code[class*="language-"]': {
    background: '#e2e8f0',
    padding: '.1em .3em',
    borderRadius: '.3em',
    whiteSpace: 'normal',
  },
  comment: { color: '#718096' },
  prolog: { color: '#718096' },
  doctype: { color: '#718096' },
  cdata: { color: '#718096' },
  punctuation: { color: '#4a5568' },
  '.namespace': { opacity: '0.7' },
  property: { color: '#d97706' }, // Orange
  tag: { color: '#d97706' },
  boolean: { color: '#d97706' },
  number: { color: '#d97706' },
  constant: { color: '#d97706' },
  symbol: { color: '#d97706' },
  deleted: { color: '#e53e3e' },
  selector: { color: '#7c3aed' }, // Purple
  'attr-name': { color: '#7c3aed' },
  string: { color: '#059669' }, // Green
  char: { color: '#059669' },
  builtin: { color: '#7c3aed' },
  operator: { color: '#4a5568' },
  entity: { color: '#4a5568', cursor: 'help' },
  url: { color: '#7c3aed' },
  '.language-css .token.string': { color: '#059669' },
  '.style .token.string': { color: '#059669' },
  inserted: { color: '#059669' },
  atrule: { color: '#7c3aed' },
  'attr-value': { color: '#059669' },
  keyword: { color: '#7c3aed' },
  function: { color: '#2563eb' }, // Blue
  'class-name': { color: '#7c3aed' },
  regex: { color: '#d97706' },
  important: { color: '#d97706', fontWeight: 'bold' },
  variable: { color: '#d97706' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
};