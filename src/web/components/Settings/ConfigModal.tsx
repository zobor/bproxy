import React from 'react';
import { ControllerDialog } from '../../pages/Home/Controller';
import ConfigEditor from '../ConfigEditor';

const ConfigModal = (props) => {
  return (
    <ControllerDialog className="editor-modal" title="编辑配置文件" width={window.innerWidth} centered {...props}>
      <ConfigEditor onCancel={props.onCancel} />
    </ControllerDialog>
  );
};

export default ConfigModal;
