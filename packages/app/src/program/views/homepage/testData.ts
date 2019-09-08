// 测试数据
// 这种数据结构真的合理吗？
// 如果是嵌套的password -> folder -> vault这样存储有什么弊端呢？
// 试试嵌套的数据
import User from '../../types/user';
export const userData: User = {
  _id: '1',
  username: 'emi wang',
  email: 'shiqi.wang@live.com',
  unlockKey: '123',
  // 这里data后面应当是加密后的数据
  data: {
    targets: [
      {
        _id: '1',
        displayName: '阿里云',
        entries: [{type: 'website URL', value: 'https://aliyun.com'}],
      },
      {
        _id: '2',
        displayName: '腾讯系',
        entries: [{type: 'website URL', value: 'https://qq.com'}],
      },
    ],
    vaults: [
      {
        _id: '1',
        name: 'vault',
        type: 'private',
        describe: 'test vault',
        folders: [
          {
            _id: '1',
            vaultId: '1',
            name: 'test folder',
            describe: 'test folder',
            passwords: [
              {
                _id: '1',
                folderId: '1',
                targetId: '2',
                vaultId: '1',
                items: [
                  {
                    type: 'userName',
                    label: 'name',
                    value: 'emi wang',
                  },
                  {
                    type: 'password',
                    label: 'password',
                    value: '123',
                  },
                  {
                    type: 'text',
                    label: 'describe',
                    value: 'for test',
                  },
                ],
                collect: true,
                pass_name: 'test item',
              },
              {
                _id: '2',
                folderId: '1',
                targetId: '1',
                vaultId: '1',
                items: [
                  {
                    type: 'userName',
                    label: 'name',
                    value: 'emi wang',
                  },
                  {
                    type: 'password',
                    label: 'password',
                    value: '123',
                  },
                  {
                    type: 'text',
                    label: 'describe',
                    value: 'for test',
                  },
                ],
                collect: true,
                pass_name: 'test item',
              },
            ],
          },
        ],
      },
      {
        _id: '2',
        name: 'makeflow',
        type: 'private',
        describe: 'makeflow vault',
        folders: [],
      },
      {
        _id: '3',
        name: 'tencent',
        type: 'private',
        describe: 'for tencent company product',
        folders: [
          {
            _id: '1',
            name: 'folder',
            describe: 'a folder',
            vaultId: '3',
            passwords: [],
          },
        ],
      },
    ],
  },
};
