import {Router} from 'boring-router';
import {Route} from 'boring-router-react';
import {createHashHistory} from 'history';
import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import LoginPage from './views/login/login';
import HomePage from './views/homepage/homepage';

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
      <LoginPage />
      <HomePage />
    </Route>
  </div>,
  document.getElementById('app'),
);
