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
3. 推导所需成分：master password、secret key、account id（是否就是 user \_id 呢）、email、salt。
4. 数据都在用户本地解密，在远端所有数据都应当是加密状态，只是身份验证通过后，定时把加密数据发送给用户，存储在用户本地。
5. 身份验证时也不能发送用户敏感信息，用迪菲-赫尔曼密钥交换法，验证客户端和服务器端身份
6. 去哪里找库和函数啊...绝望
