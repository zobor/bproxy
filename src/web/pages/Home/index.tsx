import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { isPlainObject } from 'lodash';
import { Ctx } from '../ctx';
import useRequest from '../../hooks/useRequest';
import { getConfigFilePath } from '../../modules/bridge';
import { ws } from '../../modules/socket';
import Controller from './Controller';
import DetailCom from './Detail';
import './index.scss';
import SelectConfig from './SelectConfig';
import Table from './Table';
import { useUmamiInitReport } from '../../hooks/useUmami';
import Sidebar from './SideBar';
import { message, Modal } from '../../components/UI';
import { onConfigFileRuntimeError } from '../../modules/socket';
import { parseJSON } from '../../../utils/utils';

const Detail = memo(DetailCom);

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const [ready, setReady] = useState(false);
  const {
    requestId,
    filterString,
    filterRequestMethod,
    filterType,
    showDetail,
    proxySwitch,
    filterContentType,
    configFilePath,
    showSelectConfig,
  } = state;
  const { list, clean } = useRequest(proxySwitch, filterType, filterString, filterContentType, filterRequestMethod);
  const [detail, setDetail] = useState<any>(null);
  const detailMemo = useMemo(() => {
    return detail;
  }, [detail?.custom?.requestId, detail?.requestEndTime]);
  const [connected, setConnected] = useState<number | boolean>(0);
  useUmamiInitReport(!!connected);
  useEffect(() => {
    const item = list.find((item: any) => item.custom.requestId === requestId);
    if (item) {
      setDetail(item);
    }
  }, [list, requestId]);

  useEffect(() => {
    dispatch({ type: 'setClean', clean });
    // TODO
    ws.on('close', () => {
      if (ready) {
        setConnected(false);
      }
    });
    ws.on('open', () => {
      setConnected(true);
      getConfigFilePath().then((filepath) => {
        dispatch({
          type: 'setConfigFilePath',
          configFilePath: (filepath as string) || '',
        });
        setTimeout(() => {
          setReady(true);
        }, 0);
      });
    });
  }, []);

  useEffect(() => {
    if (!list.length) {
      dispatch({
        type: 'setShowDetail',
        showDetail: false,
      });
    }
  }, [list.length]);

  useEffect(() => {
    onConfigFileRuntimeError((rs) => {
      if (!isPlainObject(rs)) {
        return;
      }
      const { payload } = rs || {};
      if (payload && payload.message && payload.stack) {
        const { message: msg, stack } = payload;
        Modal.error({
          title: '配置文件异常',
          width: '50vw',
          content: (
            <pre className="prettyprint" style={{ maxWidth: '80vw', color: 'red' }}>
              <code>{msg}</code>
              <code>{stack}</code>
            </pre>
          ),
          afterClose: () => {
            message.success('配置已回滚');
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    const historyContext = window.localStorage.getItem('context-data');

    if (historyContext) {
      try {
        const data = parseJSON(historyContext);
        Object.keys(data)
          .filter((key) => key !== 'requestId')
          .filter((key: string) => key !== 'requestId')
          .forEach((key: string) => {
            const fn = key.slice(0, 1).toUpperCase() + key.slice(1);
            dispatch({
              type: `set${fn}`,
              [key]: data[key],
            });
          });
      } catch (err) {}
    }
    dispatch({ type: 'setReady', ready: true });
  }, []);

  if (ready && (!configFilePath || showSelectConfig)) {
    return <SelectConfig />;
  }

  return (
    <>
      <Controller connected={connected} />
      <Table list={list} />
      {showDetail ? <Detail detail={detailMemo} /> : null}
      <Sidebar />
    </>
  );
};
