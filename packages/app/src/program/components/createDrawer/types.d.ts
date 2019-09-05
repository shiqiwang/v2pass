import Password from '../../types/password';
import Folder from '../../types/folder';
import Vault from '../../types/vault';

export interface DrawerProps {
  visible: boolean;
  title?: string;
  onClose(): void;
  type: 'Vault' | 'Folder' | 'Password' | 'Target';
}

export interface VaultFormProps {
  vault?: Vault;
}

export interface VaultFormStates {
  name: Vault['name'];
  type: Vault['type'];
  describe: Vault['describe'];
}

export interface FolderFormProps {
  folder?: Folder;
}

export interface FolderFormStates {
  name: Folder['name'];
  describe: Folder['describe'];
  vaultId: Folder['vaultId'];
}

export interface PasswordFormProps {
  password?: Password;
}

export interface PasswordFormStates {
  pass_name: Password['pass_name'];
  folderId: Password['folderId'];
  vaultId: Password['vaultId'];
  targetId: Password['targetId'];
  items: Password['items'];
  collect: Password['collect'];
}
