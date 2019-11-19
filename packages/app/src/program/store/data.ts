import {message} from 'antd';
import {computed, observable} from 'mobx';
import React from 'react';

import {encryptData} from '../auth';
import {ActiveItem} from '../components/passwordList/types/types';
import {updateDataApi} from '../request';
import {DataKey, Folder, Password, Target, UsageData, Vault} from '../types';

export class DataProcess {
  @observable private data: UsageData;
  @observable private dataKey: DataKey;
  @observable hasService: boolean = false;

  @computed get targets(): Target[] {
    return this.data.targets;
  }

  @computed get vaults(): Vault[] {
    return this.data.vaults;
  }

  @computed get folders(): Folder[] {
    return this.vaults.map(vault => vault.folders).flat();
  }

  @computed get passwords(): Password[] {
    return this.folders.map(folder => folder.passwords).flat();
  }

  constructor(data: UsageData, dataKey: DataKey) {
    this.data = data;
    this.dataKey = dataKey;
  }

  getData(): UsageData {
    return this.data;
  }

  getDataKey(): DataKey {
    return this.dataKey;
  }

  updateData(newData: UsageData): void {
    this.data = newData;
  }

  updateDataKey(newDataKey: DataKey): void {
    this.dataKey = newDataKey;
  }

  updateHasService(has: boolean): void {
    this.hasService = has;
  }

  findTarget(targetId: Target['id']): Target | undefined {
    return this.targets.filter(target => target.id === targetId)[0];
  }

  findPasswordsByName(name: Password['pass_name']): Password[] {
    return this.vaults
      .map(vault => vault.folders.map(folder => folder.passwords))
      .flat(2)
      .filter(password => password.pass_name.includes(name));
  }

  findVault(vaultId: Vault['id']): Vault | undefined {
    return this.vaults.filter(vault => vault.id === vaultId)[0];
  }

  findFolder(folderId: Folder['id'], vaultId: Vault['id']): Folder | undefined {
    const targetVault = this.vaults.filter(vault => vault.id === vaultId)[0];

    if (targetVault) {
      return targetVault.folders.filter(folder => folder.id === folderId)[0];
    }

    return undefined;
  }

  findPassword(activeItem: ActiveItem): Password | undefined {
    const {activeFolder, activePassword, activeVault} = activeItem;
    const targetVault = this.vaults.filter(
      vault => vault.id === activeVault,
    )[0];

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

  addVault(vault: Vault): void {
    this.data.vaults.push(vault);
    this.updateStorageAndDatabase();
  }

  deleteVault(id: Vault['id']): void {
    this.data.vaults = this.data.vaults.filter(item => item.id !== id);
    this.updateStorageAndDatabase();
  }

  updateVault(vault: Vault): void {
    this.data.vaults = this.data.vaults.map(item => {
      if (item.id === vault.id) {
        return vault;
      }

      return item;
    });
    this.updateStorageAndDatabase();
  }

  addTarget(target: Target): void {
    this.data.targets.push(target);
    this.updateStorageAndDatabase();
  }

  deleteTarget(id: Target['id']): void {
    this.data.targets = this.data.targets.filter(item => item.id !== id);
    this.updateStorageAndDatabase();
  }

  updateTarget(target: Target): void {
    this.data.targets = this.data.targets.map(item => {
      if (item.id === target.id) {
        return target;
      }

      return item;
    });
    this.updateStorageAndDatabase();
  }

  addFolder(folder: Folder): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === folder.vaultId) {
        vault.folders.push(folder);
      }

      return vault;
    });
    this.updateStorageAndDatabase();
  }

  deleteFolder(id: Folder['id'], vaultId: Vault['id']): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === vaultId) {
        return {
          ...vault,
          folders: vault.folders.filter(folder => folder.id !== id),
        };
      } else {
        return vault;
      }
    });
    this.updateStorageAndDatabase();
  }

  updateFolder(newFolder: Folder): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === newFolder.vaultId) {
        vault.folders = vault.folders.map(folder => {
          if (folder.id === newFolder.id) {
            return newFolder;
          } else {
            return folder;
          }
        });
      }

      return vault;
    });
    this.updateStorageAndDatabase();
  }

  addPassword(newPass: Password): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === newPass.vaultId) {
        vault.folders.map(folder => {
          if (folder.id === newPass.folderId) {
            folder.passwords.push(newPass);
          }
        });
      }

      return vault;
    });
    this.updateStorageAndDatabase();
  }

  deletePassword(
    id: Password['id'],
    folderId: Password['folderId'],
    vaultId: Password['vaultId'],
  ): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === vaultId) {
        return {
          ...vault,
          folders: vault.folders.map(folder => {
            if (folder.id === folderId) {
              return {
                ...folder,
                passwords: folder.passwords.filter(
                  password => password.id !== id,
                ),
              };
            } else {
              return folder;
            }
          }),
        };
      } else {
        return vault;
      }
    });
    this.updateStorageAndDatabase();
  }

  updatePassword(newPass: Password): void {
    this.data.vaults = this.data.vaults.map(vault => {
      if (vault.id === newPass.vaultId) {
        return {
          ...vault,
          folders: vault.folders.map(folder => {
            if (folder.id === newPass.folderId) {
              return {
                ...folder,
                passwords: folder.passwords.map(item => {
                  if (item.id === newPass.id) {
                    return newPass;
                  } else {
                    return item;
                  }
                }),
              };
            } else {
              return folder;
            }
          }),
        };
      } else {
        return vault;
      }
    });
  }

  private updateStorageAndDatabase(): void {
    const cipherData = encryptData(this.dataKey, this.data);
    chrome.storage.local.set({data: cipherData});
    updateDataApi(cipherData)
      .then(result => {
        if (result) {
          message.success('data update successfully');
        } else {
          message.warning('data update to database error');
        }
      })
      .catch(error => message.error(error.message));
  }
}

export const DataContext = React.createContext(
  new DataProcess({vaults: [], targets: []}, ''),
);
