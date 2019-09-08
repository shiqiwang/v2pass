import lodash from 'lodash';

import Folder, {FolderGist, FolderInfo} from '../types/folder';
import Password, {PasswordGist} from '../types/password';
import Target from '../types/target';
import Vault, {VaultGist, VaultInfo} from '../types/vault';
import {userData} from '../views/homepage/testData';

// 真实数据需要从本地导入并解密
// 拆解数据先搁在这里，万一以后想用呢
export const targets: Target[] = userData.data.targets;

export const vaults: Vault[] = userData.data.vaults;
export const vaultInfoArray: VaultInfo[] = vaults.map(vault =>
  lodash.omit(vault, ['folders']),
);
export const vaultGistArray: VaultGist[] = vaultInfoArray.map(vault =>
  lodash.omit(vault, ['describe', 'type']),
);

export const folders: Folder[] = vaults.map(vault => vault.folders).flat();
export const folderInfoArray: FolderInfo[] = folders.map(folder =>
  lodash.omit(folder, ['passwords']),
);
export const folderGistArray: FolderGist[] = folderInfoArray.map(folder =>
  lodash.omit(folder, ['describe']),
);

export const passwords: Password[] = folders
  .map(folder => folder.passwords)
  .flat();
export const passwordInfoArray: PasswordGist[] = passwords.map(password =>
  lodash.omit(password, ['targetId', 'items']),
);
