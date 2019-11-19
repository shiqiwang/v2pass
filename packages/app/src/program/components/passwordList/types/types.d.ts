import {Password, Target, Folder, Vault} from '../../../types';
import {ClassType} from 'react';

interface ActiveItem {
  activePassword: Password['id'];
  activeFolder: Password['folderId'];
  activeVault: Password['vaultId'];
}

interface ItemUIProps {
  activeItem: ActiveItem;
  clickItem(activeItem: ActiveItem): void;
}

export interface PasswordProps extends ItemUIProps {
  password: Password;
  asSearch: boolean;
}

export interface FolderProps extends ItemUIProps {
  folder: Folder;
}

export interface VaultProps extends ItemUIProps {
  vault: Vault;
}

export interface PasswordListProps extends ItemUIProps {
  passwords: Password[];
  asSearch: boolean;
}

export interface VaultListProps extends ItemUIProps {
  vaults: Vault[];
}

export interface ListProps {
  select(activeItem: ActiveItem): void;
}

export interface ForSearch {
  text: string;
  result: Password[];
}
