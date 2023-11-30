import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React, { lazy, Suspense, useCallback, useContext, useEffect } from 'react';
import { LOCAL_STORAGE_SHOE_INSTALL_CERT, USER_TOOLS } from '../../../utils/constant';
import Filter from '../../components/Filter';
import Icon from '../../components/Icon';
import Install from '../../components/Install';
import RuleTest from '../../components/ruleTest';
import ConfigModal from '../../components/Settings/ConfigModal';
import { message, Modal, Spin } from '../../components/UI';
import useBool from '../../hooks/useBool';
import { useRuntimePlatform } from '../../hooks/useBridge';
import useWerine from '../../hooks/useWeinre';
import useSystemProxyOpen from '../../hooks/useWs';
import { activeProxy, checkProxy, disActiveProxy } from '../../modules/bridge';
import { isMac } from '../../modules/util';
import { Ctx } from '../ctx';
import './Controller.scss';

const Settings = lazy(() => import('../../components/Settings'));
const Weinre = lazy(() => import('../../components/Weinre'));

export const ControllerDialog = ({ title, children, visible, className, ...others }) => {
  if (!visible) {
    return null;
  }
  return (
    <Modal className={className} title={title} open={visible} footer={null} width={1000} {...others}>
      {children}
    </Modal>
  );
};

const RuleTestModal = (props) => {
  return (
    <ControllerDialog title="检测目标URL是否跟你的rule匹配" width={800} {...props}>
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
    <ControllerDialog title="安装 HTTPS 证书" width={720} {...props}>
      <Install />
    </ControllerDialog>
  );
};

interface ControllerProps {
  connected?: boolean | number;
}

const Disconnected = () => <div className="disconnected">bproxy 已经停止工作，等待连接中...</div>;

const Controller = (props: ControllerProps) => {
  const { connected } = props;
  const { state, dispatch } = useContext(Ctx);
  const { proxySwitch, clean, textSearch } = state;

  const { state: isShowSettings, toggle: toggleShowSettings } = useBool(false);
  const { state: isShowWeinre, toggle: toggleShowWeinre } = useBool(false);
  const { state: isShowFilter, toggle: toggleShowFilter } = useBool(false);
  const { state: isShowRuleTest, toggle: toggleShowRuleTest } = useBool(false);
  const { state: isShowInstall, toggle: toggleShowInstall } = useBool(false);
  const { state: isShowConfig, toggle: toggleShowConfig } = useBool(false);
  const { clients } = useWerine(isShowWeinre);
  const { state: isSystemProxyOpen } = useSystemProxyOpen();
  const isDialogShow =
    isShowSettings || isShowWeinre || isShowFilter || isShowRuleTest || isShowInstall || isShowConfig;

  const onClickSearch = () => {
    dispatch({ type: 'setShowTextSearch', showTextSearch: true });
  };
  const onToggleInstall = () => {
    toggleShowInstall();
    window.localStorage.setItem(LOCAL_STORAGE_SHOE_INSTALL_CERT, '1');
  };
  const { state: systemProxyStatus, toggle: toggleSystemProxyStatus, ok: setProxyOn, no: setProxyOff } = useBool(false);
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
    if (isSystemProxyOpen) {
      setProxyOn();
    }

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
    }, 10 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isSystemProxyOpen]);

  useEffect(() => {
    const watchHotKey = (e) => {
      const { altKey, keyCode } = e;
      // option + x
      if (altKey && keyCode === 88) {
        onClean();
      } else if (keyCode === 191) {
        !isDialogShow &&
          setTimeout(() => {
            dispatch({ type: 'setShowTextSearch', showTextSearch: true });
          }, 10);
      }
    };
    document.body.addEventListener('keydown', watchHotKey);

    return () => {
      document.body.removeEventListener('keydown', watchHotKey);
    };
  }, [onClean, isDialogShow]);

  useEffect(() => {
    setTimeout(() => {
      if (window.localStorage.getItem(LOCAL_STORAGE_SHOE_INSTALL_CERT) !== '1') {
        toggleShowInstall();
      }
    }, 3000);
  }, []);

  return (
    <div className="controller">
      {connected === false ? <Disconnected /> : null}
      <div
        onClick={toggleSwitch}
        className={classNames({
          disabled: !proxySwitch,
        })}
      >
        <Icon type="switch" />
        <span>日志开关</span>
      </div>
      <div onClick={onClean}>
        <Icon type="clear" />
        <span>清理日志</span>
      </div>
      <div
        className={classNames({
          ['warn']: isShowWeinre || !isEmpty(clients),
        })}
        onClick={toggleShowWeinre}
      >
        <Icon type="debug" />
        <span>页面调试</span>
      </div>
      <div
        className={classNames({
          ['warn']: textSearch && textSearch.length,
        })}
        onClick={onClickSearch}
      >
        <Icon type="search" />
        <span>内容搜索</span>
      </div>
      {platform === 'app' ? (
        <div onClick={showSelectConfig}>
          <Icon type="exchange" />
          <span>切换配置</span>
        </div>
      ) : null}
      <div
        className={classNames({
          ['warn']: isShowConfig,
        })}
        onClick={toggleShowConfig}
      >
        <Icon type="editor" />
        <span>编辑配置</span>
      </div>
      <div
        className={classNames({
          [systemProxyStatus ? 'warn' : 'disabled']: true,
        })}
        onClick={onClickSystemProxy}
      >
        <Icon type={isMac ? 'mac' : 'windows'} />
        <span>系统代理</span>
      </div>
      <div
        className={classNames({
          ['warn']: isShowFilter,
        })}
        onClick={toggleShowFilter}
      >
        <Icon type="filter" />
        <span>过滤规则</span>
      </div>
      <div
        className={classNames({
          ['warn']: isShowRuleTest,
        })}
        onClick={toggleShowRuleTest}
      >
        <Icon type="matched" />
        <span>规则检测</span>
      </div>
      <div
        className={classNames({
          ['warn']: isShowInstall,
        })}
        onClick={onToggleInstall}
      >
        <Icon type="chrome" />
        <span>安装证书</span>
      </div>
      <div
        onClick={() => {
          window.open(USER_TOOLS);
        }}
      >
        <Icon type="tools" />
        <span>开发工具</span>
      </div>
      <div
        className={classNames({
          ['warn']: isShowSettings,
        })}
        onClick={toggleShowSettings}
      >
        <Icon type="setting" />
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
      {/* 配置文件 */}
      <ConfigModal onCancel={toggleShowConfig} visible={isShowConfig} />
    </div>
  );
};

export default Controller;
