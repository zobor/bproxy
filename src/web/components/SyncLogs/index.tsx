import React, { useEffect } from 'react';
import { onSyncLogs } from '../../modules/socket';
import './index.scss';

export default () => {
  useEffect(() => {
    onSyncLogs((data) => {
      console.log(data);
    });
  }, []);
  return <div className='dialog-logs'></div>
};
