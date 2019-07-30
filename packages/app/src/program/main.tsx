import React from 'react';
import ReactDOM from 'react-dom';

import {Router, RouteMatch} from 'boring-router';
import {Route, Link} from 'boring-router-react';
import {createHashHistory} from 'history';

let history = createHashHistory();

let router = Router.create(
  {
    default: {
      $match: '',
    },
    test: {
      $exact: true,
      $children: {
        testId: {
          $match: /\d+/,
          $query: {
            xxx: true,
          },
        },
      },
    },
    rest: {
      $match: RouteMatch.rest,
    },
  },
  history,
);

ReactDOM.render(
  <div>
    <Route match={router.default}>
      default page
      <Link to={router.test}>test</Link>
    </Route>
    <Route match={router.test}>
      {match => (
        <div>
          <h1>test page</h1>
          <Link to={match.testId} params={{testId: '123'}}>
            test id xxx
          </Link>
          <Route match={match.testId}>
            {match => (
              <div>
                id: {match.$params.testId} {match.$params.yyy}
              </div>
            )}
          </Route>
        </div>
      )}
    </Route>
    <Route match={router.rest}>not found</Route>
  </div>,
  document.getElementById('app'),
);
