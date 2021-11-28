import { useCallback, useContext } from "react";
import classNames from "classnames";
import {
  PlayCircleOutlined,
  WifiOutlined,
  BugOutlined,
  MacCommandOutlined,
  ClearOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import RuleTest from "../../components/ruleTest";
import useBool from "../../hooks/useBool";
import { Ctx } from "../../ctx";
import Filter from '../../components/Filter';
import Install from "../../components/Install";
import SystemProxy from '../../components/SystemProxy';

import "./controller.scss";
import { Modal } from "../../components/UI";

const ControllerDialog = ({ title, children, ...others }) => {
  return (
    <Modal centered title={title} footer={null} width={1000} {...others}>
      {children}
    </Modal>
  );
}

const RuleTestModal = (props) => {
  return (
    <ControllerDialog
      title="检测目标URL是否跟你的rule匹配"
      {...props}
    >
      <RuleTest />
    </ControllerDialog>
  );
};

const FilterModal = (props) => {
  return (
    <ControllerDialog
    destroyOnClose
      title="过滤HTTP日志"
      {...props}
    >
      <Filter visible={props.visible} />
    </ControllerDialog>
  );
};

const InstallModal = (props) => {
  return <ControllerDialog
    title="安装HTTPS证书"
    {...props}
  >
    <Install />
  </ControllerDialog>
};

const SystemProxylModal = (props) => {
  return <ControllerDialog
    destroyOnClose
    title="系统代理开关"
    {...props}
  >
    <SystemProxy />
  </ControllerDialog>
};

interface ControllerProps {
  connected?: boolean;
}

const Disconnected = () => <div className="disconnected">
  bproxy 已经停止工作，等待连接中...
</div>

const Controller = (props: ControllerProps) => {
  const { connected } = props;
  const { state, dispatch } = useContext(Ctx);
  const { proxySwitch, clean, disableCache, filterString } = state;

  const { state: isShowRuleTest, toggle: toggleShowRuleTest } = useBool(false);
  const { state: isShowFilter, toggle: toggleShowFilter } = useBool(false);
  const { state: isShowInstall, toggle: toggleShowInstall } =
    useBool(false);

  const { state: isShowSystemProxy, toggle: toggleShowSystemProxy } =
    useBool(false);

  const toggleSwitch = useCallback(() => {
    dispatch({ type: "setProxySwitch", proxySwitch: !proxySwitch });
  }, [proxySwitch]);
  const onClean = () => {
    if (clean) {
      clean();
    }
  };

  if (!connected) {
    return <Disconnected />
  }

  return (
    <div className="controller">
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
        <span>Wi-Fi证书</span>
      </div>
      <div onClick={toggleShowRuleTest}>
        <BugOutlined />
        <span>代理规则</span>
      </div>
      <div
        onClick={toggleShowFilter}
        className={classNames({
          disabled: !filterString,
        })}
      >
        <FilterOutlined />
        <span>过滤规则</span>
      </div>
      <div onClick={toggleShowSystemProxy}>
        <MacCommandOutlined />
        <span>系统代理</span>
      </div>

      <RuleTestModal onCancel={toggleShowRuleTest} visible={isShowRuleTest} />
      <FilterModal onCancel={toggleShowFilter} visible={isShowFilter} />
      <InstallModal onCancel={toggleShowInstall} visible={isShowInstall} />
      <SystemProxylModal onCancel={toggleShowSystemProxy} visible={isShowSystemProxy} />
    </div>
  );
};

export default Controller;
