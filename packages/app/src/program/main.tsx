import {Route} from 'boring-router-react';
import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import {router} from './router';
import HomePage from './views/homepage/homepage';
import UnlockPage from './views/unlock/unlock';

ReactDOM.render(
  <div>
    <Route match={router.unlock} component={UnlockPage}></Route>
    <Route match={router.homepage} component={HomePage}></Route>
  </div>,
  document.getElementById('app'),
);
