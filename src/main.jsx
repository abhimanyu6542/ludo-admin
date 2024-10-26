import React from 'react';
import router from './router/index.jsx';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/react-query';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import { store } from './redux/ReduxStore.jsx';
import { Provider } from 'react-redux';

const persister = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
