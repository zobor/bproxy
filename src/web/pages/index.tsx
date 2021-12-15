import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Ctx } from "../ctx";
import useRequest from "../hooks/useRequest";
import Detail from "./Detail";
import Table from "./Table";
import Controller from './controller';
import './index.scss';

const DetailMemo = memo(Detail);

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { requestId, filterString, filterType, updateRequestListFlag, showDetail, proxySwitch } = state;
  const { list, clean } = useRequest(proxySwitch, filterType, filterString, updateRequestListFlag);
  const [detail, setDetail] = useState<any>(null);
  const detailMemo = useMemo(() => {
    return detail;
  }, [detail?.custom?.requestId]);
  const [connected, setConnected] = useState(true);
  const $statusCount = useRef(0);
  useEffect(() => {
    const item = list.find((item: any) => item.custom.requestId === requestId);
    if (item) {
      setDetail(item);
    }
  }, [list, requestId]);

  useEffect(() => {
    dispatch({ type: 'setClean', clean });

    setInterval(() => {
      if (!(window as any)?.$socket?.connected) {
        $statusCount.current += 1;
        if ($statusCount.current >= 4) {
          setConnected(false);
        }
      } else {
        setConnected(true);
        $statusCount.current = 0;
      }
    }, 300);
  }, []);

  return <div className="app-main">
    <Controller connected={connected} />
    <Table list={list} />
    {showDetail ? <DetailMemo detail={detailMemo} /> : null}
  </div>
};
