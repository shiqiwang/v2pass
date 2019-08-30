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
      {
        _id: '2',
        displayName: '腾讯系',
        entries: [{type: 'website', url: 'https://qq.com'}],
      },
    ],
    vaults: [
      {
        _id: '1',
        name: 'vault',
        type: 'private',
        describe: 'test vault',
      },
    ],
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
    ],
    folders: [
      {
        _id: '1',
        vaultId: '1',
        name: 'test folder',
        describe: 'test folder',
      },
    ],
  },
};
