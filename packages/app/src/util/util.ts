import Vault from '../types/vault';
import Folder from '../types/folder';
import Password from '../types/password';
import {ActiveItem} from '../program/components/passwordList/passwordList';
export function findVault(vaults: Vault[], _id: Vault['_id']): Vault {
  return vaults.map(vault => {
    if (vault._id === _id) {
      return vault;
    }
  })[0];
}
export function findFolder(
  vaults: Vault[],
  _id: Folder['_id'],
  vaultId: Folder['vaultId'],
): Folder {
  return vaults.map(vault => {
    if (vault._id === vaultId) {
      return vault.folders.map(folder => {
        if (folder._id === _id) {
          return folder;
        }
      })[0];
    }
  })[0];
}

export function findPassword(
  vaults: Vault[],
  activeItem: ActiveItem,
): Password {
  const {activeFolder, activePassword, activeVault} = activeItem;
  return vaults.map(vault => {
    if (vault._id === activeVault) {
      return vault.folders.map(folder => {
        if (folder._id === activeFolder) {
          return folder.passwords.map(password => {
            if (password._id === activePassword) {
              return password;
            }
          })[0];
        }
      })[0];
    }
  })[0];
}
