import 'core-js/stable';
import ReactDOM from 'react-dom';
import React from 'react';
const AppLoader = React.lazy(() => import('./AppLoader'));

ReactDOM.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <AppLoader />
  </React.Suspense>,
  document.getElementById('web')
);
