import React, { useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';

import './editor.css';
import theme from './cobat2.json';
import editorConfig from './editorConfig';

// 定义主题
monaco.editor.defineTheme('bproxyTheme', theme as any);
// 使用定义的主题
monaco.editor.setTheme('bproxyTheme');
// 代码补全
// let keywords = [ 'class', 'new', 'string', 'number', 'boolean', 'private', 'public' ];
// monaco.languages.registerCompletionItemProvider('typescript', {
//   provideCompletionItems: (model, position) => {
//       const suggestions = [
//           ...keywords.map(k => {
//               return {
//                   label: k,
//                   kind: monaco.languages.CompletionItemKind.Keyword,
//                   insertText: k,
//               };
//           })
//       ];
//       console.log(suggestions);
//       return { suggestions: suggestions };
//   },
//   triggerCharacters: ['$']
// });

export default forwardRef(function Editor({ code }: any, ref: any) {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl: any = useRef(null);

  useEffect(() => {
    if (monacoEl && !editor && code) {
      const $e = monaco.editor.create(monacoEl.current, {
        ...editorConfig,
        ...{
          value: [code].join('\n'),
          language: 'typescript',
        },
      } as any);
      setEditor($e);
    }

    return () => editor?.dispose();
  }, [monacoEl.current, code]);

  ref.current = useCallback(() => {
    return editor?.getValue();
  }, [editor]);

  return <div className="monaco-editor" ref={monacoEl}></div>;
});
