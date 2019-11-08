import {Route} from 'boring-router-react';
import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import {router} from './router';
import {PlainData, PlainDataContext} from './store';
import HomePage from './views/homepage/homepage';
import Login from './views/login/login';
import Register from './views/register/register';
import UnlockPage from './views/unlock/unlock';

ReactDOM.render(
  <PlainDataContext.Provider
    value={new PlainData({vaults: [], targets: []}, '')}
  >
    <Route match={router.unlock} component={UnlockPage}></Route>
    <Route match={router.homepage} component={HomePage}></Route>
    <Route match={router.login} component={Login}></Route>
    <Route match={router.register} component={Register}></Route>
  </PlainDataContext.Provider>,
  document.getElementById('app'),
);
