/// <reference types="react" />
import "antd/es/modal/style/css";
import "./controller.scss";
interface ControllerProps {
    connected?: boolean;
}
declare const Controller: (props: ControllerProps) => JSX.Element;
export default Controller;
