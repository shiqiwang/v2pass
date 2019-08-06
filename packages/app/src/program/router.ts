import {Router} from 'boring-router';
import {createHashHistory} from 'history';

export const history = createHashHistory();

export const router = Router.create(
  {
    unlock: true,
    homepage: true,
    // homepage: {
    //   $query: {
    //     id: true,
    //   },
    // },
    rest: {
      $match: /.*/,
    },
  },
  history,
);

export type Router = typeof router;
