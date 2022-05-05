import { memo, useContext, useEffect, useMemo, useState } from "react";
import { Ctx } from "../ctx";
import useRequest from "../hooks/useRequest";
import { ws } from '../modules/socket';
import Controller from './Controller';
import Detail from "./Detail";
import './index.scss';
import Table from "./Table";

const DetailMemo = memo(Detail);

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { requestId, filterString, filterType, updateRequestListFlag, showDetail, proxySwitch, filterContentType } = state;
  const { list, clean, lastUpdate } = useRequest(proxySwitch, filterType, filterString, filterContentType, updateRequestListFlag);
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
