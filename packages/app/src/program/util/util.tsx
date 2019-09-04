import {ActiveItem} from '../components/passwordList/normalPasswordList';
import Folder from '../types/folder';
import Password from '../types/password';
import Vault from '../types/vault';

export function findByName(name: string, vaults: Vault[]): Password[] {
  return vaults
    .map(vault => vault.folders.map(folder => folder.passwords))
    .flat(2)
    .filter(password => password.pass_name === name);
}

export function findVault(
  vaults: Vault[],
  _id: Vault['_id'],
): Vault | undefined {
  return vaults.filter(vault => vault._id === _id)[0];
}

export function findFolder(
  vaults: Vault[],
  _id: Folder['_id'],
  vaultId: Folder['vaultId'],
): Folder | undefined {
  const targetVault = vaults.filter(vault => vault._id === vaultId)[0];

  if (targetVault) {
    return targetVault.folders.filter(folder => folder._id === _id)[0];
  }

  return undefined;
}

export function findPassword(
  vaults: Vault[],
  activeItem: ActiveItem,
): Password | undefined {
  const {activeFolder, activePassword, activeVault} = activeItem;
  const targetVault = vaults.filter(vault => vault._id === activeVault)[0];

  if (!targetVault) {
    return undefined;
  }

  const targetFolder = targetVault.folders.filter(
    folder => folder._id === activeFolder,
  )[0];

  if (!targetFolder) {
    return undefined;
  }

  return targetFolder.passwords.filter(
    password => password._id === activePassword,
  )[0];
}
