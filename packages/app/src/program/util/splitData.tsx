import lodash from 'lodash';

import Folder, {FolderInfo} from '../types/folder';
import Password from '../types/password';
import Target from '../types/target';
import {UserInfo} from '../types/user';
import Vault, {VaultInfo} from '../types/vault';
import {userData} from '../views/homepage/testData'; // 这个数据正式应当从本地存储中获取后解密

export const userInfo: UserInfo = lodash.omit(userData, ['data']);

export const vaults: Vault[] = userData.data.vaults;

export const vaultInfoArray: VaultInfo[] = vaults.map(vault =>
  lodash.omit(vault, ['folders']),
);

export const folders: Folder[] = vaults.map(vault => vault.folders).flat();

export const folderInfoArray: FolderInfo[] = folders.map(folder =>
  lodash.omit(folder, ['passwords']),
);

export const passwords: Password[] = folders
  .map(folder => folder.passwords)
  .flat();

export const targets: Target[] = userData.data.targets;
