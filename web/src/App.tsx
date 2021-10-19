import React, { useReducer, lazy, Suspense, PropsWithoutRef } from 'react';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { Ctx, defaultState, reducer } from './ctx';
import ErrorHandler from './components/ErrorHandler';
import './App.scss';

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
  // 提现的首页
  {
    name: 'Home',
    path: './pages/home',
    Component: lazy(() => import(/* webpackPrefetch: true */ './pages/home')),
    routerPath: '/',
  },
];



export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState());

  return (
    <div className="app" id="app">
      <Ctx.Provider value={{ state, dispatch }}>
        <ErrorHandler>
          <HashRouter>
            <Switch>
              {
                routerList.map((routerConfig: any) => <Route key={routerConfig.path} exact path={routerConfig.routerPath} component={LazyLoadComponent(routerConfig.Component, routerConfig.name)} />)
              }
            </Switch>
          </HashRouter>
        </ErrorHandler>
      </Ctx.Provider>
    </div>
  );
};
