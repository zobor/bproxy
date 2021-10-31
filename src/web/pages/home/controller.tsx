import { useCallback, useContext } from "react";
import {
  PlayCircleOutlined,
  StopOutlined,
  WifiOutlined,
  LoadingOutlined,
  BugOutlined,
  EyeInvisibleOutlined,
  MacCommandOutlined,
} from "@ant-design/icons";
import Modal from "antd/es/modal";
import RuleTest from "./conponents/ruleTest";
import "antd/es/modal/style/css";
import "./controller.scss";
import useBool from "./hooks/useBool";
import { Ctx } from "../../ctx";
import classNames from "classnames";
import Filter from "./conponents/Filter";

const RuleTestModal = ({ visible, onClose }) => {
  return (
    <Modal
      title="匹配规则校验"
      onCancel={onClose}
      visible={visible}
      footer={null}
      width={1000}
    >
      <RuleTest />
    </Modal>
  );
};

const FilterModal = ({ visible, onClose }) => {
  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      width={1000}
      title="过滤HTTP日志"
    >
      <Filter />
    </Modal>
  );
};

const Controller = () => {
  const { state: isShowRuleTest, toggle: toggleShowRuleTest } = useBool(false);
  const { state: isShowFilter, toggle: toggleShowFilter } = useBool(false);
  const { state, dispatch } = useContext(Ctx);
  const { proxySwitch } = state;

  const toggleSwitch = useCallback(() => {
    dispatch({ type: "setProxySwitch", proxySwitch: !proxySwitch });
  }, [proxySwitch]);

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
      <div>
        <WifiOutlined />
        <span>Wi-Fi证书</span>
      </div>
      <div onClick={toggleShowRuleTest}>
        <BugOutlined />
        <span>代理规则</span>
      </div>
      <div onClick={toggleShowFilter}>
        <EyeInvisibleOutlined />
        <span>过滤规则</span>
      </div>
      <div>
        <MacCommandOutlined />
        <span>系统代理</span>
      </div>

      <RuleTestModal onClose={toggleShowRuleTest} visible={isShowRuleTest} />
      <FilterModal onClose={toggleShowFilter} visible={isShowFilter} />
    </div>
  );
};

export default Controller;
