import {Vault, Folder, Password} from './index';

export interface IActive {
  vault: Vault['id'];
  folder: Folder['id'];
  pass: Password['id'];
}

export interface IStatus {
  status: number;
  id: string;
}
