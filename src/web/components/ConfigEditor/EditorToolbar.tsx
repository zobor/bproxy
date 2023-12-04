import React from 'react';
import { useConfigPath } from '../../hooks/useBridge';

export default function EditorToolbar() {
  const { configFilePath } = useConfigPath();
  return <div className="editor-toolbar">配置文件目录：{configFilePath || ''}</div>;
}
