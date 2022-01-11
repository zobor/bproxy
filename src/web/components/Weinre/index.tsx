import { useEffect, useState } from 'react';
import { WeinreOptions } from '../../../types/proxy';
import { bridgeInvoke } from '../../modules/socket';
import { isEmpty } from '../../modules/_';
import './index.scss';

export default () => {
  const [weinreConfig, setWeinreConfig] = useState<WeinreOptions>({} as WeinreOptions);
  useEffect(() => {
    bridgeInvoke({api: 'getProxyConfig'}).then((rs: any) => {
      if (rs && rs.weinre) {
        setWeinreConfig(rs.weinre);
      }
    });
  }, []);
  if (isEmpty(weinreConfig)) {
    return null;
  }
  return <div className="dialog-page-debug">
    <iframe src={`http://localhost:${weinreConfig.httpPort}/client/#anonymous`} style={{border: 'none', width: '100%', height: '100%'}} />
  </div>
};
