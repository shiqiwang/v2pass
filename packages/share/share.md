# user collection

user collection 是集合，装载了很多用户的数据

```ts
let userDocument = {
  id: '',
  username: '',
  password: '', // bcrypt
  data: {
    targets: [{}, {}, {}],
    folders: [{}, {}],
    passwords: [{}, {}, {}],
  },
};

let userCollection = [userDocument, userDocument2, userDocument3];

let targetCollection = [
  {
    name: 'taobao',
    entries: [
      {
        type: 'website',
        url: 'https://taobao.com',
      },
    ],
  },
];
```

# collection target

```js
import {Nominal} from 'tslang';

type TargetId = Nominal<string, 'target-id'>; // string & {__type: 'target-id'}
type TargetObjectId = Nominal<Object, 'target-object-id'>;

type UserId = Nominal<string, 'user-id'>;
type UserObjectId = Nominal<Object, 'user-object-id'>;

let target: Target = {
  user: 'abc' as UserId, // 使用需要使用as关键字
  // ...
};

// 在password中直接引用具体target的_id
interface Target {
  // _id: TargetId; 前端_id，拿到后端id后需要转化为前端所用_id
  // _id: TargetObjectId; 后端_id
  // user: UserId; 和id类似 有userId
  // user: UserObjectId;
  displayName: string;
  entries: TargetEntry[];
}

type TargetEntry =
  | WebsiteTargetEntry
  | AndroidAppTargetEntry
  | IOSAppTargetEntry;

interface WebsiteTargetEntry {
  type: 'website';
  url: string;
}

interface AndroidAppTargetEntry {
  type: 'android-app';
  id: string;
}

interface IOSAppTargetEntry {
  type: 'ios-app';
  id: string;
}
```

# collection

# folder

# vault

1. folder 层级之上，有 private/shared 概念，目前只做 private
