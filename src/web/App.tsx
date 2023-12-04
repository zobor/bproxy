import 'animate.css';
import React, { lazy, Suspense, useEffect, useReducer, useRef } from 'react';
import { BrowserRouter, Route, Routes, RouterProps } from 'react-router-dom';
import ShowError from './components/ShowError';
import { omit } from './modules/lodash';
import { Ctx, defaultState, reducer } from './pages/ctx';

import './App.scss';

type LazyComponent = React.LazyExoticComponent<React.ComponentType<RouterProps>>;

function LazyLoadComponent<T>(Com: LazyComponent): React.ReactNode {
  const C: any = Com;
  return (
    <Suspense fallback={<div />}>
      <C />
    </Suspense>
  );
}

const routerList: {
  routerPath: string;
  Component: LazyComponent;
}[] = [
  // 监控
  {
    name: 'Home',
    routerPath: '/',
  },
  {
    name: 'LogViewer',
    routerPath: '/LogViewer',
  },
  {
    name: 'SyncClipboard',
    routerPath: '/SyncClipboard',
  },
].map((config) => ({
  ...config,
  Component: lazy(() => import(`./pages/${config.name}/index.tsx`)),
}));

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const timer = useRef<any>(0);

  useEffect(() => {
    if (state.ready) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => window.localStorage.setItem('context-data', JSON.stringify(omit(state, 'requestId'))),
        500,
      );
    }
  }, [state]);

  return (
    <div className="app cube" id="app">
      <Ctx.Provider value={{ state, dispatch }}>
        <ShowError>
          <BrowserRouter basename="/web/">
            <Routes>
              {routerList.map((routerConfig: any) => (
                <Route
                  caseSensitive
                  key={routerConfig.name}
                  path={routerConfig.routerPath}
                  element={LazyLoadComponent(routerConfig.Component)}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </ShowError>
      </Ctx.Provider>
    </div>
  );
};
