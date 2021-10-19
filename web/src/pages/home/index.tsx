import { useReducer } from "react";
import { Ctx, defaultState, reducer } from "../../ctx";
import useRequest from "../../hooks/useRequest";
import Detail from "./Detail";
import Table from "./Table";
import './index.scss';

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState());
  const [list] = useRequest();

  return <div className="app-main">
    <Ctx.Provider value={{ state, dispatch }}>
      <Table list={list} />
      <Detail list={list} />
    </Ctx.Provider>
  </div>
};
