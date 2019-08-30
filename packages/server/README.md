# @v2pass/server

## api 设计

1. 注册 register(username, email, verify): boolean

- 用户输入 username，email，master password
  - 中途要验证 username 和 email
  - 提供 master password 的参考
- 客户端生成 secret key，user id，加上 salt 生成密码验证器 verify
  - user id `能在客户端生成吗？`
- 把 username email verify 发送给服务器
- secret key，username，email，user id 存储在用户设备本地

2. 登录/解锁 unlock(username, email, unlockKey): allUserData

- 用户输入自己的 master password
- 客户端用 master password，secret key，salt，email，user id 生成 unlockKey
- 发送至服务器用 verify 验证身份
  - 身份验证成功需要返回该用户的所有数据

3. 创建密码项：createPasswordItem(username, email, unlockKey?, encryptPasswordItem): boolean

- 每次客户端和服务器通信都需要验证身份吗
  - 如果验证，这里的 unlockKey 应当是用户解锁客户端时生成且存在本地的，但每次客户端解锁时限到了时会从本地删除（`不行吧，敏感信息不能保存吧`）
  - 如果 unlockKey 不能存储（安全问题），不验证，则不传 unlockKey

4. 创建 vault 组：createVault(username, email, unlockKey?, encryptVault): boolean
5. 创建文件夹：createFolder(username, email, unlockKey?, encryptFolder): boolean
6. 修改 vault 组：editVault(username, email, unlockKey?, encryptVault, findQuery): boolean

- `疑惑`，由于存在修改的情况，是否各项的都有不应加密的查询条件，如 name 或 id 什么的，但是如果这些是明文的安全吗 `万：应该修改本地解密的数据后整体再次加密替换用户的所有数据，如果是这样的话，最终server端有的就只是updateData() api`

7. 修改 folder 组：editFolder
8. 修改密码项：editPasswordItem

- 修改密码项里面，包含了 collect 与否

9. 删除 vault 组：deleteVault(username, email, unlockKey?, id)

- `疑惑`：同上，而且名字很可能重复，感觉 id 不加密才靠谱？`万：同上，删除本地数据中的该项，再整体替数据库数据`

10. 删除文件夹：deleteFolder
11. 删除密码项：deletePasswordItem
12. `疑惑`：id 因为在本地和在数据库中不同，在数据库中的类型为`mongodb.ObjectId`，这在客户端中可以转化吗？
13. 修改账户密码，绑定邮箱等：editAccount(username, email, unlockKey, newDataObject, verify): boolean

- 修改账户密码，绑定邮箱等好像并不能改变密钥？（这个有待查证，但确实是不能改变个啥）
- 更改账户设置需要输入再次输入旧 master password 验证身份
- 修改了账户设置，身份验证器应该相应被替换
- newDataObject 对应更改后的 username，email 等

14. verify，email，加密后的数据 等得类型是`？？？`
15. 那些需要验证的如 email 可以用正则做类型来约束吗`？？？`
16. 感觉客户端任务比较重，后端没什么工作量
