import { memo, useContext, useEffect, useMemo, useState } from "react";
import { Ctx } from "../../ctx";
import useRequest from "../../hooks/useRequest";
import Detail from "./Detail";
import Table from "./Table";
import Controller from './controller';
import './index.scss';

const DetailMemo = memo(Detail);

export default () => {
  const { state, dispatch } = useContext(Ctx);
  const { requestId, filterString, filterType } = state;
  const { list, clean } = useRequest(state.proxySwitch, filterType, filterString);
  const [detail, setDetail] = useState<any>(null);
  const detailMemo = useMemo(() => {
    return detail;
  }, [detail?.custom?.requestId]);
  useEffect(() => {
    const item = list.find((item: any) => item.custom.requestId === requestId);
    if (item) {
      setDetail(item);
    }
  }, [list, requestId]);

  useEffect(() => {
    dispatch({ type: 'setClean', clean });
  }, []);

  return <div className="app-main">
    <Controller />
    <Table list={list} />
    <DetailMemo detail={detailMemo} />
  </div>
};
