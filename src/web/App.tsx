import 'animate.css';
import React, { lazy, PropsWithoutRef, Suspense, useEffect, useReducer, useRef } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import { Ctx, defaultState, reducer } from './ctx';
import { omit } from './modules/_';


const keepAliveCache: Record<string, React.MemoExoticComponent<React.ComponentType<any>>> = {};

function LazyLoadComponent<P>(
  Com: React.LazyExoticComponent<React.ComponentType<P>>,
  name: string
): React.MemoExoticComponent<React.ComponentType<P>> {
  const cacheKey = `${name}-router`;

  if (keepAliveCache[cacheKey]) {
    return keepAliveCache[cacheKey];
  }

  keepAliveCache[cacheKey] = React.memo((props: PropsWithoutRef<P>) => (
    <Suspense fallback={<div />}>
      <Com {...props} />
    </Suspense>
  ));

  return keepAliveCache[cacheKey];
}

const routerList = [
  // 监控
  {
    name: 'Home',
    path: './pages',
    Component: lazy(() => import('./pages')),
    routerPath: '/',
  },
];

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const timer = useRef<any>(0);

  useEffect(() => {
    const historyContext = window.localStorage.getItem('context-data');

    if (historyContext) {
      try {
        const data = JSON.parse(historyContext);
        Object.keys(data).filter(key => key !=='requestId').filter((key: string) => key !== 'requestId').forEach((key: string) => {
          const fn = key.slice(0, 1).toUpperCase() + key.slice(1);
          dispatch({
            type: `set${fn}`,
            [key]: data[key],
          });
        });
      } catch(err) {}
    }
    dispatch({ type: "setReady", ready: true });
  }, []);

  useEffect(() => {
    if (state.ready) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        window.localStorage.setItem('context-data', JSON.stringify(omit(state, 'requestId')));
      }, 500);
    }
  }, [state]);

  return (
    <div className="app cube" id="app">
      <Ctx.Provider value={{ state, dispatch }}>
          <HashRouter>
            <Switch>
              {
                routerList.map((routerConfig: any) => <Route key={routerConfig.path} exact path={routerConfig.routerPath} component={LazyLoadComponent(routerConfig.Component, routerConfig.name)} />)
              }
            </Switch>
          </HashRouter>
      </Ctx.Provider>
    </div>
  );
};
