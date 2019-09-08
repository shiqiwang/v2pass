import Password from './password';

export interface FolderGist {
  _id: string;
  vaultId: string;
  name: string;
}

export interface FolderInfo extends FolderGist {
  describe: string;
}
export default interface Folder extends FolderInfo {
  passwords: Password[];
}
