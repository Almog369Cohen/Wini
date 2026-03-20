import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const isElectron = !!(window as { electronAPI?: unknown }).electronAPI;

async function main() {
  let AppComponent: React.ComponentType;

  if (isElectron) {
    const { default: App } = await import('./App');
    AppComponent = App;
  } else {
    const { default: WebApp } = await import('./web/WebApp');
    AppComponent = WebApp;
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppComponent />
    </React.StrictMode>
  );
}

main();
