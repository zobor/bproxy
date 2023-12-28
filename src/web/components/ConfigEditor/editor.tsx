import React, { useRef, useState, useEffect, useCallback, forwardRef } from 'react';
import { loadScript } from '../../modules/util';

async function initJSBeautify() {
  if ((window as any).js_beautify) {
    return true;
  }
  return await loadScript('https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/js-beautify/1.14.0/beautify.min.js')
}

export default forwardRef(function Editor({ code }: any, ref: any) {
  const editor: any = useRef(null);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  useEffect(() => {
    const list: string[] = ['https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ace/1.4.14/ace.min.js'];
    Promise.all(
      list.map((url) => {
        return loadScript(url);
      }),
    ).then(() => {
      const ace: any = (window as any).ace;
      ace.config.set('basePath', 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/ace/1.4.14');
      editor.current = ace.edit('editor');
      editor.current.setTheme('ace/theme/monokai');
      editor.current.setOption('wrap', true);
      editor.current.setShowPrintMargin(false);
      editor.current.getSession().setMode('ace/mode/javascript');
      editor.current.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      setLastUpdate(Date.now());
    });
  }, []);

  ref.current = useCallback(() => {
    return editor.current.getSession().getValue();
  }, [editor]);

  useEffect(() => {
    if (code && editor.current) {
      editor.current.getSession().setValue(code);
    }
  }, [code, lastUpdate]);

  useEffect(() => {
    const formatJS = () => {
      initJSBeautify().then(() => {
        const v = editor.current.getSession().getValue();
        const v2 = (window as any).js_beautify(v, {
          indent_size: 2,
        });
        editor.current.getSession().setValue(v2);
      });
    };
    const onPrase = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.keyCode === 70) {
        formatJS();
        return false;
      }
    };
    document.body.addEventListener('keydown', onPrase);

    return () => {
      document.body.removeEventListener('keydown', onPrase);
    };
  }, []);

  return (
    <div id="editor" style={{ width: '100%', height: '100%', fontSize: 16 }}></div>
  );
});
