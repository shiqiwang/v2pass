import lodash from 'lodash';

import {ActiveItem} from '../components/passwordList/types/types';
import * as type from '../types';

export default class DataProcess {
  targets: type.Target[];
  vaults: type.Vault[];
  vaultInfoArray: type.VaultInfo[];
  vaultGistArray: type.VaultGist[];
  folders: type.Folder[];
  folderInfoArray: type.FolderInfo[];
  folderGistArray: type.FolderGist[];
  passwords: type.Password[];
  passwordInfoArray: type.PasswordGist[];

  constructor(data: type.UsageData) {
    const {targets, vaults} = data;

    this.targets = targets;

    this.vaults = vaults;
    this.vaultInfoArray = vaults.map(vault => lodash.omit(vault, ['folders']));
    this.vaultGistArray = this.vaultInfoArray.map(vault =>
      lodash.omit(vault, ['describe', 'type']),
    );

    this.folders = vaults.map(vault => vault.folders).flat();
    this.folderInfoArray = this.folders.map(folder =>
      lodash.omit(folder, ['passwords']),
    );
    this.folderGistArray = this.folderInfoArray.map(folder =>
      lodash.omit(folder, ['describe']),
    );

    this.passwords = this.folders.map(folder => folder.passwords).flat();
    this.passwordInfoArray = this.passwords.map(password =>
      lodash.omit(password, ['targetId', 'items']),
    );
  }

  findTarget(targetId: type.Target['id']): type.Target | undefined {
    return this.targets.filter(target => target.id === targetId)[0];
  }

  findPasswordsByName(name: type.Password['pass_name']): type.Password[] {
    return this.vaults
      .map(vault => vault.folders.map(folder => folder.passwords))
      .flat(2)
      .filter(password => password.pass_name.includes(name));
  }

  findVault(vaultId: type.Vault['id']): type.Vault | undefined {
    return this.vaults.filter(vault => vault.id === vaultId)[0];
  }

  findFolder(
    folderId: type.Folder['id'],
    vaultId: type.Vault['id'],
  ): type.Folder | undefined {
    const targetVault = this.vaults.filter(vault => vault.id === vaultId)[0];

    if (targetVault) {
      return targetVault.folders.filter(folder => folder.id === folderId)[0];
    }

    return undefined;
  }

  findPassword(activeItem: ActiveItem): type.Password | undefined {
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
}
