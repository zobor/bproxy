import React, { useEffect, useState } from 'react';
import { GUIDE_CHANGELOG, GUIDE_HOME, GUIDE_HOME_TIPS } from '../../../utils/constant';
import { showLogFile } from '../../modules/api';
import { getVersion, openHomePage, clearLogConent, closeApp, showConfigOnTerminal } from '../../modules/bridge';
import { version_build } from '../../pages/version';
import Icon from '../Icon';
import { Form, message, Tag } from '../UI';
import './index.scss';

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

  const openLogFile = () => {
    showLogFile();
  };
  const onCleanLog = () => {
    clearLogConent();
    message.success('日志清理成功');
  };
  const onShowConfigOnTerminal = () => {
    showConfigOnTerminal();
    message.success('请在控制台查看日志');
  };

  useEffect(() => {
    getVersion().then((v: any) => setVersion(v));
  }, []);
  return (
    <div className="dialog-settings">
      <Form name="time_related_controls" {...formItemLayout}>
        <Form.Item label="版本号">
          <div>
            <Tag className="version" style={{ cursor: 'pointer' }} onClick={openHomePage} color="rgb(165, 105, 189)">
              {version}
            </Tag>
            <Tag className="version" style={{ cursor: 'pointer' }} onClick={openHomePage} color="rgb(165, 105, 189)">
              最近更新于：{version_build}
            </Tag>
          </div>
        </Form.Item>
        <Form.Item label={GUIDE_HOME_TIPS}>
          <div className="flexCenter helpTips">
            <Icon type="help" />
            <a href={GUIDE_HOME} target="_blank;">
              查看 bproxy 使用文档
            </a>
          </div>
        </Form.Item>
        <Form.Item label="其他功能">
          <Tag style={{ cursor: 'pointer' }} onClick={openLogFile} color="rgb(165, 105, 189)">
            查看日志
          </Tag>
          <Tag style={{ cursor: 'pointer' }} onClick={onCleanLog} color="rgb(215, 189, 226)">
            清空日志
          </Tag>
          <Tag style={{ cursor: 'pointer' }} onClick={onShowConfigOnTerminal} color="rgb(88, 214, 141)">
            控制台显示当前配置
          </Tag>
          <Tag style={{ cursor: 'pointer' }} onClick={() => window.open(GUIDE_CHANGELOG)} color="rgb(244, 208, 63)">
            更新日志
          </Tag>
        </Form.Item>
        <Form.Item label="APP">
          <Tag style={{ cursor: 'pointer' }} onClick={closeApp} color="rgb(165, 105, 189)">
            关闭bproxy
          </Tag>
        </Form.Item>
      </Form>
    </div>
  );
};
