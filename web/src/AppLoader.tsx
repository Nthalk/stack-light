import React from 'react';
import {hot} from 'react-hot-loader/root';
import SessionProvider from './providers/SessionProvider';
import {ApiProvider} from './providers/ApiProvider';
import {BrowserRouter} from 'react-router-dom';
import App from './App';

function AppLoader(): JSX.Element {
  return (
    <SessionProvider>
      <ApiProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiProvider>
    </SessionProvider>
  );
}

export default hot(AppLoader);
