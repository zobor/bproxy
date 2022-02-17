import { memo, useContext, useEffect, useMemo, useState } from "react";
import { Ctx } from "../ctx";
import useRequest from "../hooks/useRequest";
import Detail from "./Detail";
import Table from "./Table";
import Controller from './Controller';
import './index.scss';
import { ws } from '../modules/socket';

const DetailMemo = memo(Detail);

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { requestId, filterString, filterType, updateRequestListFlag, showDetail, proxySwitch } = state;
  const { list, clean, lastUpdate } = useRequest(proxySwitch, filterType, filterString, updateRequestListFlag);
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
    ws.on('close', () => {
      setConnected(false);
    });
    ws.on('open', () => {
      setConnected(true);
    });

  }, []);

  useEffect(() => {
    dispatch({ type: 'setLastUpdate', lastUpdate});
  }, [lastUpdate]);

  return <div className="app-main">
    <Controller connected={connected} />
    <Table list={list} />
    {showDetail ? <DetailMemo detail={detailMemo} /> : null}
  </div>
};
