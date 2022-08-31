import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { Ctx } from '../ctx';
import useRequest from '../../hooks/useRequest';
import { getConfigFilePath } from '../../modules/bridge';
import { ws } from '../../modules/socket';
import Controller from './Controller';
import Detail from './Detail';
import './index.scss';
import SelectConfig from './SelectConfig';
import Table from './Table';

const DetailMemo = memo(Detail);

export default () => {
  const { state, dispatch } = useContext(Ctx);
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
  const { list, clean } = useRequest(
    proxySwitch,
    filterType,
    filterString,
    filterContentType,
    filterRequestMethod
  );
  const [detail, setDetail] = useState<any>(null);
  const detailMemo = useMemo(() => {
    return detail;
  }, [detail?.custom?.requestId]);
  const [connected, setConnected] = useState(true);
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
      setConnected(false);
    });
    ws.on('open', () => {
      setConnected(true);
      getConfigFilePath().then((filepath) => {
        dispatch({
          type: 'setConfigFilePath',
          configFilePath: (filepath as string) || '',
        });
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

  if (!configFilePath || showSelectConfig) {
    return <SelectConfig />;
  }

  return (
    <>
      <Controller connected={connected} />
      <Table list={list} />
      {showDetail ? <DetailMemo detail={detailMemo} /> : null}
    </>
  );
};
