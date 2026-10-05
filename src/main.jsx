import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ReviewProvider } from './review/ReviewProvider.jsx';
import './styles/global.css';

// GitHub Pages uses real URLs under /my-site/. The review copy published
// as a claude.ai page (VITE_ROUTER=hash) can't rely on its own path, so
// it routes through the URL hash instead.
const useHash = import.meta.env.VITE_ROUTER === 'hash';
const Router = useHash ? HashRouter : BrowserRouter;
const routerProps = useHash ? {} : { basename: '/my-site/' };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router {...routerProps}>
      <ReviewProvider>
        <App />
      </ReviewProvider>
    </Router>
  </React.StrictMode>
);
