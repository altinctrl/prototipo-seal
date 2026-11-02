import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { SealogProvider } from './store/SealogContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SealogProvider>
      <App />
    </SealogProvider>
  </React.StrictMode>
);
