import classNames from 'classnames';
import { useCallback, useContext, useEffect } from 'react';
import ConfigEditor from '../components/ConfigEditor';
import Filter from '../components/Filter';
import Install from '../components/Install';
import RuleTest from '../components/ruleTest';
import Settings from '../components/Settings';
import {
  BugOutlined,
  ClearOutlined,
  CodeOutlined,
  FilterOutlined,
  MacCommandOutlined,
  message,
  Modal,
  PlayCircleOutlined,
  SettingOutlined,
  UsbOutlined,
  WifiOutlined
} from '../components/UI';
import Weinre from '../components/Weinre';
import { Ctx } from '../ctx';
import useBool from '../hooks/useBool';
import { activeProxy, checkProxy, disActiveProxy } from '../modules/bridge';
import { ws } from '../modules/socket';
import './Controller.scss';

const ControllerDialog = ({ title, children, visible, ...others }) => {
  if (!visible) {
    return null;
  }
  return (
    <Modal
      centered
      title={title}
      visible={visible}
      footer={null}
      width={1000}
      {...others}
    >
      {children}
    </Modal>
  );
};

const RuleTestModal = (props) => {
  return (
    <ControllerDialog
      title="检测目标URL是否跟你的rule匹配"
      width={800}
      {...props}
    >
      <RuleTest />
    </ControllerDialog>
  );
};

const FilterModal = (props) => {
  return (
    <ControllerDialog title="过滤 HTTP 日志" width={700} {...props}>
      <Filter />
    </ControllerDialog>
  );
};

const InstallModal = (props) => {
  return (
    <ControllerDialog title="安装 HTTPS 证书" width={800} {...props}>
      <Install />
    </ControllerDialog>
  );
};

const ConfigModal = (props) => {
  return (
    <ControllerDialog title="编辑配置文件" width={900} {...props}>
      <ConfigEditor onCancel={props.onCancel} />
    </ControllerDialog>
  );
};

const SettingsModal = (props) => {
  return (
    <ControllerDialog title="个性化设置" width={1000} {...props}>
      <Settings />
    </ControllerDialog>
  );
};

const WeinreModal = (props) => {
  return (
    <ControllerDialog title="页面调试" width={500} {...props}>
      <Weinre />
    </ControllerDialog>
  );
};

interface ControllerProps {
  connected?: boolean;
}

const Disconnected = () => (
  <div className="disconnected">bproxy 已经停止工作，等待连接中...</div>
);

const Controller = (props: ControllerProps) => {
  const { connected } = props;
  const { state, dispatch } = useContext(Ctx);
  const { proxySwitch, clean, filterString, filterContentType } = state;

  const { state: isShowRuleTest, toggle: toggleShowRuleTest } = useBool(false);
  const { state: isShowFilter, toggle: toggleShowFilter } = useBool(false);
  const { state: isShowInstall, toggle: toggleShowInstall } = useBool(false);
  const { state: isShowConfig, toggle: toggleShowConfig } = useBool(false);
  useBool(false);
  const { state: isShowSettings, toggle: toggleShowSettings } = useBool(false);
  const { state: isShowWeinre, toggle: toggleShowWeinre } = useBool(false);
  const { state: systemProxyStatus, toggle: toggleSystemProxyStatus } =
    useBool(false);

  const toggleSwitch = useCallback(() => {
    dispatch({ type: 'setProxySwitch', proxySwitch: !proxySwitch });
  }, [proxySwitch]);
  const onClean = () => {
    if (clean) {
      clean();
    }
  };
  const onClickSystemProxy = useCallback(() => {
    if (systemProxyStatus) {
      disActiveProxy();
    } else {
      activeProxy();
    }
    toggleSystemProxyStatus();
    message.success(!systemProxyStatus ? '系统代理已开启' : '系统代理已关闭');
  }, [systemProxyStatus]);
  useEffect(() => {
    ws.on('open', () => {
      checkProxy().then((isOpen) => {
        if (isOpen) {
          toggleSystemProxyStatus();
        }
      });
    });

    // const closeProxySettings = () => {
    //   disActiveProxy();
    // };

    // window.addEventListener('beforeunload', closeProxySettings);
  }, []);

  return (
    <div className="controller">
      {!connected ? <Disconnected /> : null}
      <div
        onClick={toggleSwitch}
        className={classNames({
          disabled: !proxySwitch,
        })}
      >
        <PlayCircleOutlined />
        <span>日志开关</span>
      </div>
      <div onClick={onClean}>
        <ClearOutlined />
        <span>清理日志</span>
      </div>
      <div onClick={toggleShowInstall}>
        <WifiOutlined />
        <span>安装证书</span>
      </div>
      <div onClick={toggleShowRuleTest}>
        <BugOutlined />
        <span>代理规则</span>
      </div>
      <div
        onClick={toggleShowFilter}
        className={classNames({
          warn: !!filterString || filterContentType !== 'all',
        })}
      >
        <FilterOutlined />
        <span>过滤规则</span>
      </div>
      <div
        className={classNames({
          [systemProxyStatus ? 'warn' : 'disabled']: true,
        })}
        onClick={onClickSystemProxy}
      >
        <MacCommandOutlined />
        <span>系统代理</span>
      </div>
      <div onClick={toggleShowConfig}>
        <UsbOutlined />
        <span>配置文件</span>
      </div>
      <div onClick={toggleShowWeinre}>
        <CodeOutlined />
        <span>页面调试</span>
      </div>
      <div onClick={toggleShowSettings}>
        <SettingOutlined />
        <span>设置</span>
      </div>

      <RuleTestModal onCancel={toggleShowRuleTest} visible={isShowRuleTest} />
      <FilterModal onCancel={toggleShowFilter} visible={isShowFilter} />
      <InstallModal onCancel={toggleShowInstall} visible={isShowInstall} />
      <ConfigModal onCancel={toggleShowConfig} visible={isShowConfig} />
      <SettingsModal onCancel={toggleShowSettings} visible={isShowSettings} />
      <WeinreModal onCancel={toggleShowWeinre} visible={isShowWeinre} />
    </div>
  );
};

export default Controller;
