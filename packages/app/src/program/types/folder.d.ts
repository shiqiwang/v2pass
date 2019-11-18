import {Password} from './index';

export interface Folder {
  id: string;
  vaultId: string;
  name: string;
  describe: string;
  passwords: Password[];
}
