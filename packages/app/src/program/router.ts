import {Router} from 'boring-router';
import {createHashHistory} from 'history';

export const history = createHashHistory();

export const router = Router.create(
  {
    login: true,
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

router.rest.$intercept(() => {
  router.login.$push();
});

// 做访问前验证的钩子
// router.homepage.$intercept(() => {
//   router.unlock.$push();
// });