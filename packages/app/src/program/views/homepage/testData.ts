// 测试数据
import User from '../../../types/user';
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
        entries: [{type: 'website', url: 'https://aliyun.com'}],
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
            name: 'test folder',
            describe: 'test folder',
          },
        ],
      },
    ],
    passwords: [
      {
        _id: '1',
        items: [],
        collect: true,
        pass_name: 'test item',
      },
    ],
  },
};
