import { useCallback, useEffect, useState } from "react";
import Switch from 'antd/es/switch';
import { bridgeInvoke } from "../../modules/socket";

import 'antd/es/switch/style/css';

export default () => {
  const [networks, setNetworks] = useState<any>({});
  const [port, setport] = useState<string>('');

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
    }
  }, [port]);

  useEffect(() => {
    bridgeInvoke({
      api: 'getActiveNetworkProxyStatus',
    }).then(rs => {
      setNetworks(rs);
    });
    bridgeInvoke({
      api: "getLocalProxyPort",
    }).then((portNumberString) => {
      setport(portNumberString as string);
    })
  }, []);

  return <div>
    {Object.keys(networks).map(key => (
      <div style={{padding: '10px 0'}}>
        {key}: <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked checked={networks[key]} onChange={(checked) => {onChange(checked, key)}} />
      </div>
    ))}
  </div>
}
