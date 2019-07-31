import {Router} from 'boring-router';
import {Route} from 'boring-router-react';
import {createHashHistory} from 'history';
import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import HomePage from './views/homepage/homepage';
import UnlockPage from './views/unlock/unlock';

let history = createHashHistory();

let router = Router.create(
  {
    default: {
      $match: '',
    },
  },
  history,
);

ReactDOM.render(
  <div>
    <Route match={router.default}>
      <UnlockPage />
      <HomePage />
    </Route>
  </div>,
  document.getElementById('app'),
);
