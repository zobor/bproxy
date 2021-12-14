import { useCallback, useEffect, useState } from "react";

import { bridgeInvoke } from "../../modules/socket";
import { message, Switch } from "../UI";

import './index.scss';

export default () => {
  const [networks, setNetworks] = useState<any>({});
  const [port, setport] = useState<string>('');
  const [support, setSupport] = useState<boolean>(true);

  const onChange = useCallback((checked: boolean, deviceName: string) => {
    bridgeInvoke({
      api: 'setNetworkProxyStatus',
      params: {
        deviceName,
        status: checked ? 'on' : 'off',
      },
    });
    setNetworks((pre) => ({
      ...pre,
      [deviceName]: checked,
    }));
    if (checked) {
      bridgeInvoke({
        api: 'setNetworkProxy',
        params: {
          deviceName,
          host: '127.0.0.1',
          port,
        },
      });
      message.success(`已成功开启系统代理：http://127.0.0.1:${port}`);
    } else {
      message.success('已关闭系统代理');
    }
  }, [port]);

  const init = () => {
    bridgeInvoke({
      api: 'getActiveNetworkProxyStatus',
    }).then(rs => {
      if (rs) {
        setNetworks(rs);
      }
    });
    bridgeInvoke({
      api: "getLocalProxyPort",
    }).then((portNumberString) => {
      setport(portNumberString as string);
    });
  };

  useEffect(() => {
    bridgeInvoke({
      api: 'getOsName',
    }).then(osName => {
      setSupport(osName === 'darwin');
      if (osName === 'darwin') {
        init();
      }
    });
  }, []);

  if (!support) {
    return <div>切换代理功能不支持当前系统</div>;
  }

  return <div className="dialog-system-proxy">
    <h4>开启系统代理之后，系统上的http(s)请求会通过bproxy代理，显示在列表里了</h4>
    {Object.keys(networks).map(key => (
      <div style={{padding: '10px 0'}}>
        {key}: <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked checked={networks[key]} onChange={(checked) => {onChange(checked, key)}} />
      </div>
    ))}
  </div>
}
