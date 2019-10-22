# v2pass

## app

1. 启动 app，类似命令：`yarn workspace @v2pass/app watch:program`
2. 启动 app 命令结构：`yarn workspace workspaceName packageJsonScriptsCommand`

## server

1. server 部分代码编译：`yarn tsc`或`yarn tsc -p .`
2. 如果编译不通过，在项目根目录下执行`yarn tsc -p ./packages/server/src/program/tsconfig.json`，把路径给全。或者直接`Ctrl+Shift+B`执行编译
3. 启动 server，命令：`node main.js`，在 v2pass/packages/server/bld/program 目录下

## 加密解密

（目前，没有共享 vault 的情况下）

1. 基础密码就两个：Master Password（用户登录/解锁时要使用）和 Secret Key（存储在用户设备本地，很长）
2. 身份验证和数据解密的密钥都来自基础密钥的衍生，但是它们是独立且不同的
3. 推导所需成分：master password、secret key、account id、email、salt。
4. 数据都在用户本地解密，在远端所有数据都应当是加密状态，只是身份验证通过后，定时把加密数据发送给用户，存储在用户本地。
5. 身份验证时也不能发送用户敏感信息，用迪菲-赫尔曼密钥交换法，验证客户端和服务器端身份

### 2019.10.15

1. 登录密钥(unlockKey)与数据加解密密钥(dataKey)生成的基本要素：master password，secret key，user id，email，salt

- master password：注册时用户自己输入的密码
- secret key：注册时，客户端生成的一串密钥，考虑用 uuid 表达
- email：注册时用户输入的自有邮箱
- user id：在注册第一阶段，会把 email，username 发往服务器，服务器生成该用户的 user id 返回至客户端
- salt：只有在生成 verify(登录验证器)时才会用到，是一串随机字符串

2. 生成 unlockKey 和 verify：

- master password + secret key + user id ---hash(sha256)--->unlockKey(每次要用时生成) ---bcrypt(+salt)--->verify(仅注册时生成，发送往服务器用于验证 unlockKey) -> sever
- master password + secret key ---hash(sha256)--->encrypt/decrypt key

3. unlockKey，verify，encrypt/decrypt key 三个重要密码的生成都在客户端，因此客户端安全很重要，确保安装客户端的设备是无风险的。

## login 与 unlock

1. login 意味着，用户 storage 中丢失了存储的所有东西，用户需要输入 username，password，secretKey 认证身份，获取用户基本信息和数据
2. unlock 意味着，用户 storage 中有 username，email，id，secretKey, data 这些基础的用户信息，但由于会话过期，，只需要用户输入 password 解密 storage 中的 data 即可。
3. 数据应存储在 local（只在登录的某一个设备上）中，而不是 sync（会随 google 账号同步至不同设备），数据存储在本地则可以支持离线使用，但在有网络时，需要每隔一段时间进行同步（login/unlock 时如果有网络则可以同步一次？）。
