import { ErrorBoundary } from 'react-error-boundary';
import './index.scss';

interface IErrorHandlerProps {
  children: JSX.Element;
}

function ErrorFallback(props: any) {
  const { error } = props;

  return (
    <div role="alert">
      <h4>出错了！</h4>
      <pre>{error.message}</pre>
      {error.stack ? <pre>{error.stack}</pre> : null}
    </div>
  );
}

const ErrorHandler = (props: IErrorHandlerProps) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
    {props.children}
  </ErrorBoundary>
);

export default ErrorHandler;
