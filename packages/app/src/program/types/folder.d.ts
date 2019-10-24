import {Password} from './index';

export interface FolderGist {
  id: string;
  vaultId: string;
  name: string;
}

export interface FolderInfo extends FolderGist {
  describe: string;
}
export interface Folder extends FolderInfo {
  passwords: Password[];
}
