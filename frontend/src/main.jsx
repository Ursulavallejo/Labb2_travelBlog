import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './components/Context.jsx';
import App from './App.jsx';

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';

import '@fontsource/poppins';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/400-italic.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
