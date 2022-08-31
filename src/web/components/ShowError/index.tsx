import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import './index.scss';

interface IErrorHandlerProps {
  children: JSX.Element;
}

const resolveError = () => {
  window.location.reload();
};

function ErrorFallback(props: any) {
  const { error } = props;
  const onClick = resolveError;

  return (
    <div className="showPageError">
      <h4>出错了！</h4>
      <pre className="scrollbar-style">{error.message}</pre>
      <pre className="scrollbar-style">{error.stack}</pre>
      <div className="error-resolve">
        <button onClick={onClick}>重载</button>
      </div>
    </div>
  );
}

const ShowError = (props: IErrorHandlerProps) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
    {props.children}
  </ErrorBoundary>
);

export default ShowError;
