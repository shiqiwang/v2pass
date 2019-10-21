import {Router} from 'boring-router';
import {createHashHistory} from 'history';

export const history = createHashHistory();

export const router = Router.create(
  {
    register: true,
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
  chrome.storage.sync.get(items => {
    if (items.id) {
      router.unlock.$push();
    } else {
      router.login.$push();
    }
  });
});

// 做访问前验证的钩子
// router.homepage.$intercept(() => {
//   router.unlock.$push();
// });
