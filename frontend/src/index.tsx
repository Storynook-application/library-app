import React from 'react';
import ReactDOMClient from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.ts';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("No root element found");

const root = ReactDOMClient.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
