import Password from './password';
export default interface Folder {
  _id: string;
  vaultId: string;
  name: string;
  describe: string;
  passwords: Password[];
}
