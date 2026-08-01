import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './app/store';
import AuthInitializer from './components/auth/AuthInitializer';

import { Toaster } from 'react-hot-toast';
import './index.css';
import { router } from './routes/AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>,
);
