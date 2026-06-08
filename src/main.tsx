import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupMockApi } from './mockApi.ts';

// Dynamic API fail-safe interceptor for static servers (like GitHub Pages)
setupMockApi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
