import {Route} from 'boring-router-react';
import React from 'react';
import ReactDOM from 'react-dom';

import './main.less';

import {router} from './router';
import {Active, ActiveContext, DataContext, DataProcess} from './store';
import HomePage from './views/homepage/homepage';
import Login from './views/login/login';
import Register from './views/register/register';
import UnlockPage from './views/unlock/unlock';

ReactDOM.render(
  <DataContext.Provider value={new DataProcess({vaults: [], targets: []}, '')}>
    <Route match={router.unlock} component={UnlockPage}></Route>
    <ActiveContext.Provider value={new Active()}>
      <Route match={router.homepage} component={HomePage}></Route>
    </ActiveContext.Provider>
    <Route match={router.login} component={Login}></Route>
    <Route match={router.register} component={Register}></Route>
  </DataContext.Provider>,
  document.getElementById('app'),
);
