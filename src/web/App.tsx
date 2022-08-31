import 'animate.css';
import React, {
  lazy,
  Suspense,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { BrowserRouter, Route, Routes, RouterProps } from 'react-router-dom';
import './App.scss';
import ShowError from './components/ShowError';
import { omit } from './modules/lodash';
import { Ctx, defaultState, reducer } from './pages/ctx';

type LazyComponent = React.LazyExoticComponent<
  React.ComponentType<RouterProps>
>;


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
    name: 'qrcode',
    routerPath: '/qrcode',
  },
  {
    name: 'LogViewer',
    routerPath: '/LogViewer',
  },
].map((config) => ({
  ...config,
  Component: lazy(() => import(`./pages/${config.name}/index.tsx`)),
}));

export default () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const timer = useRef<any>(0);

  useEffect(() => {
    const historyContext = window.localStorage.getItem('context-data');

    if (historyContext) {
      try {
        const data = JSON.parse(historyContext);
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

  useEffect(() => {
    if (state.ready) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        window.localStorage.setItem(
          'context-data',
          JSON.stringify(omit(state, 'requestId'))
        );
      }, 500);
    }
  }, [state]);

  return (
    <div className="app cube" id="app">
      <Ctx.Provider value={{ state, dispatch }}>
        <ShowError>
          <BrowserRouter basename='/web/'>
            <Routes>
              {routerList.map((routerConfig: any) => (
                <Route
                  caseSensitive
                  key={routerConfig.name}
                  path={routerConfig.routerPath}
                  element={LazyLoadComponent(
                    routerConfig.Component,
                  )}
                />
              ))}
            </Routes>
          </BrowserRouter>
        </ShowError>
      </Ctx.Provider>
    </div>
  );
};
