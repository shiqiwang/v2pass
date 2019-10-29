import {ActiveItem} from '../components/passwordList/types/types';
import {Folder, Password, Target, Vault} from '../types';
// 目前data是用自己的test数据，后面数据应当从sessionStorage本地存储中获取
// sessionStorage够用吗？
// sessionStorage中存储的数据也应该是加密的吧，拿出来后再解密到数据变量中？

// 以下方法需要更改以下，数据在本地后，把util弄成类似于增删查改request的文件
export function findTarget(targetId: string, targets: Target[]): Target {
  return targets.filter(target => target.id === targetId)[0];
}

export function findByName(name: string, vaults: Vault[]): Password[] {
  return vaults
    .map(vault => vault.folders.map(folder => folder.passwords))
    .flat(2)
    .filter(password => password.pass_name.includes(name));
}

export function findVault(vaults: Vault[], id: Vault['id']): Vault | undefined {
  return vaults.filter(vault => vault.id === id)[0];
}

export function findFolder(
  vaults: Vault[],
  id: Folder['id'],
  vaultId: Folder['vaultId'],
): Folder | undefined {
  const targetVault = vaults.filter(vault => vault.id === vaultId)[0];

  if (targetVault) {
    return targetVault.folders.filter(folder => folder.id === id)[0];
  }

  return undefined;
}

export function findPassword(
  vaults: Vault[],
  activeItem: ActiveItem,
): Password | undefined {
  const {activeFolder, activePassword, activeVault} = activeItem;
  const targetVault = vaults.filter(vault => vault.id === activeVault)[0];

  if (!targetVault) {
    return undefined;
  }

  const targetFolder = targetVault.folders.filter(
    folder => folder.id === activeFolder,
  )[0];

  if (!targetFolder) {
    return undefined;
  }

  return targetFolder.passwords.filter(
    password => password.id === activePassword,
  )[0];
}
