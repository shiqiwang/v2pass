import {message} from 'antd';
import {Router} from 'boring-router';
import {createHashHistory} from 'history';

import {getDataApi} from './request';

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

router.unlock.$afterEnter(() => {
  // 测试网络，可以离线使用？
  // 不是每个路由的before enter都需要请求一次数据的吧？
  getDataApi()
    .then()
    .catch(error => {
      message.error(error.message);
      router.login.$push();
    });
});

router.rest.$intercept(() => {
  return new Promise(resolve => {
    chrome.storage.local.get(items => {
      if (items.id) {
        router.unlock.$push();
      } else {
        router.login.$push();
      }

      resolve();
    });
  });
});

// 做访问前验证的钩子
// router.homepage.$intercept(() => {
//   router.unlock.$push();
// });
