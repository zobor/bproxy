import React, { useEffect, useState } from 'react';
import { getLogContent } from '../../modules/bridge';
import './index.scss';

export default () => {
  const [logString, setLog] = useState<string>('');
  useEffect(() => {
    setTimeout(() => {
      getLogContent().then((rs: any) => {
        setLog(rs.split(/\n/).reverse().slice(0, 200).join('\n'));
      });
    }, 500);
  }, []);
  return (
    <div className="log-viewer">
      <h1>log viewer</h1>
      <div className="logs">
        <code>
          <pre>{logString.slice(0, 2048 * 10).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </code>
      </div>
    </div>
  );
};
