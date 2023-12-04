import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.querySelector('.appFirstStartLogin')!.innerHTML = '我准备好了 ~';

setTimeout(() => {
  (ReactDOM as any).createRoot(document.getElementById('root')!).render(<App />);
}, 250);
