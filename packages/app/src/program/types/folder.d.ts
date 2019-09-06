import Password from './password';

export interface FolderInfo {
  _id: string;
  vaultId: string;
  name: string;
  describe: string;
}
export default interface Folder extends FolderInfo {
  passwords: Password[];
}
