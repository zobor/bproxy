import classNames from 'classnames';
import React, { lazy, Suspense, useCallback, useContext, useEffect } from 'react';
import {
  ApiOutlined,
  BugOutlined,
  ClearOutlined,
  FilterOutlined,
  MacCommandOutlined,
  message,
  Modal,
  PlayCircleOutlined,
  SettingOutlined,
  Spin,
} from '../../components/UI';
import useBool from '../../hooks/useBool';
import { activeProxy, checkProxy, disActiveProxy } from '../../modules/bridge';
import { ws } from '../../modules/socket';
import { Ctx } from '../ctx';
import Filter from '../../components/Filter';
import RuleTest from '../../components/ruleTest';

import './Controller.scss';
import { useRuntimePlatform } from '../../hooks/useBridge';
import Install from '../../components/Install';
import { LOCAL_STORAGE_SHOE_INSTALL_CERT } from '../../../utils/constant';

const Settings = lazy(() => import('../../components/Settings'));
const Weinre = lazy(() => import('../../components/Weinre'));

export const ControllerDialog = ({ title, children, visible, ...others }) => {
  if (!visible) {
    return null;
  }
  return (
    <Modal
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

const SettingsModal = (props) => {
  return (
    <ControllerDialog title="个性化设置" width={600} {...props}>
      <Suspense fallback={<Spin />}>
        <Settings />
      </Suspense>
    </ControllerDialog>
  );
};

const WeinreModal = (props) => {
  return (
    <ControllerDialog title="页面调试" width={600} {...props}>
      <Suspense fallback={<Spin />}>
        <Weinre />
      </Suspense>
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
    <ControllerDialog title="安装 HTTPS 证书" width={800} centered {...props}>
      <Install />
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
  const { proxySwitch, clean } = state;

  const { state: isShowSettings, toggle: toggleShowSettings } = useBool(false);
  const { state: isShowWeinre, toggle: toggleShowWeinre } = useBool(false);
  const { state: isShowFilter, toggle: toggleShowFilter } = useBool(false);
  const { state: isShowRuleTest, toggle: toggleShowRuleTest } = useBool(false);
  const { state: isShowInstall, toggle: toggleShowInstall } = useBool(window.localStorage.getItem(LOCAL_STORAGE_SHOE_INSTALL_CERT) !== '1');
  const onToggleInstall = () => {
    toggleShowInstall();
    window.localStorage.setItem(LOCAL_STORAGE_SHOE_INSTALL_CERT, '1');
  };
  const {
    state: systemProxyStatus,
    toggle: toggleSystemProxyStatus,
    ok: setProxyOn,
    no: setProxyOff,
  } = useBool(false);
  const { platform } = useRuntimePlatform();

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
  const showSelectConfig = () => {
    dispatch({ type: 'setShowSelectConfig', showSelectConfig: true });
  };
  useEffect(() => {
    const open$ = ws.on('open', () => {
      checkProxy().then((isOpen) => {
        if (isOpen) {
          setProxyOn();
        }
      });
    });

    const autoCheck = () => {
      checkProxy().then((isOpen) => {
        if (isOpen) {
          setProxyOn();
        } else {
          setProxyOff();
        }
      });
    };

    const timer = setInterval(() => {
      autoCheck();
    }, 60 * 1000);

    return () => {
      open$.unsubscribe();
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const watchHotKey = (e) => {
      const { altKey, keyCode } = e;
      if (altKey && keyCode === 88) {
        onClean();
      }
    };
    document.body.addEventListener('keydown', watchHotKey);

    return () => {
      document.body.removeEventListener('keydown', watchHotKey);
    };
  }, [onClean]);

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
      <div
        className={classNames({
          [systemProxyStatus ? 'warn' : 'disabled']: true,
        })}
        onClick={onClickSystemProxy}
      >
        <MacCommandOutlined />
        <span>系统代理</span>
      </div>
      <div onClick={toggleShowFilter}>
        <FilterOutlined />
        <span>过滤规则</span>
      </div>
      {platform === 'app' ? <div onClick={showSelectConfig}>
        <ApiOutlined />
        <span>切换配置</span>
      </div> : null}
      <div onClick={toggleShowWeinre}>
        <BugOutlined />
        <span>页面调试</span>
      </div>
      <div onClick={toggleShowRuleTest}>
        <BugOutlined />
        <span>规则检测</span>
      </div>
      <div onClick={toggleShowSettings}>
        <SettingOutlined />
        <span>设置</span>
      </div>

      {/* 个性化设置 */}
      <SettingsModal onCancel={toggleShowSettings} visible={isShowSettings} />
      {/* 远程调试 */}
      <WeinreModal onCancel={toggleShowWeinre} visible={isShowWeinre} />
      {/* 过滤 */}
      <FilterModal onCancel={toggleShowFilter} visible={isShowFilter} />
      {/* 规则检查 */}
      <RuleTestModal onCancel={toggleShowRuleTest} visible={isShowRuleTest} />
      {/* 安装证书 */}
      <InstallModal onCancel={onToggleInstall} visible={isShowInstall} />
    </div>
  );
};

export default Controller;
