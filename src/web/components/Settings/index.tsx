import React, { useEffect, useState } from 'react';
import useBool from '../../hooks/useBool';
import { showLogFile } from '../../modules/api';
import { getConfigFilePath, getVersion, openHomePage, clearLogConent } from '../../modules/bridge';
import { ControllerDialog } from '../../pages/Home/Controller';
import ConfigEditor from '../ConfigEditor';
import Install from '../Install';
import { Form, message, Tag, WifiOutlined } from '../UI';
import './index.scss';

const ConfigModal = (props) => {
  return (
    <ControllerDialog title="编辑配置文件" width={window.innerWidth * 0.8} centered {...props}>
      <ConfigEditor onCancel={props.onCancel} />
    </ControllerDialog>
  );
};

const InstallModal = (props) => {
  return (
    <ControllerDialog title="安装 HTTPS 证书" width={800} centered {...props}>
      <Install />
    </ControllerDialog>
  );
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export default () => {
  const [version, setVersion] = useState<string>('');
  const { state: isShowConfig, toggle: toggleShowConfig } = useBool(false);
  const { state: isShowInstall, toggle: toggleShowInstall } = useBool(false);
  useBool(false);
  const [configFilePath, setConfigFilePath] = useState<string>('');

  const getConfigPath = () => {
    getConfigFilePath().then((rs) => {
      setConfigFilePath(rs as string);
    });
  };

  const openLogFile = () => {
    showLogFile();
  };
  const onCleanLog = () => {
    clearLogConent();
    message.success('日志清理成功');
  };

  useEffect(() => {
    getVersion().then((v: any) => setVersion(v));
    getConfigPath();
  }, []);
  return (
    <div className="dialog-settings">
      <Form name="time_related_controls" {...formItemLayout}>
        <Form.Item
          label="版本号"
        >
          <div><Tag style={{ cursor: 'pointer' }} onClick={openHomePage} color="volcano">{version}</Tag></div>
        </Form.Item>
        <Form.Item
          label="编辑配置"
        >
          <div>{configFilePath}<Tag style={{cursor: 'pointer', marginLeft: 5}} onClick={toggleShowConfig} color="volcano">编辑</Tag></div>
        </Form.Item>
        <Form.Item
          label="功能开关"
        >
          <Tag style={{cursor: 'pointer'}} onClick={toggleShowInstall} color="#f50"><WifiOutlined />安装证书</Tag>
        </Form.Item>
        <Form.Item
          label="功能开关"
        >
          <Tag style={{cursor: 'pointer'}} onClick={openLogFile} color="#f50">查看日志</Tag>
          <Tag style={{cursor: 'pointer'}} onClick={onCleanLog} color="#f50">清空日志</Tag>
        </Form.Item>
      </Form>
      {/* 配置文件 */}
      <ConfigModal onCancel={toggleShowConfig} visible={isShowConfig} />
      {/* 安装证书 */}
      <InstallModal onCancel={toggleShowInstall} visible={isShowInstall} />
    </div>
  );
};
