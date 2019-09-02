import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Folder from '../../../types/folder';
import Password from '../../../types/password';
import Vault from '../../../types/vault';

import FolderItem from './folderItem';
import PasswordItem from './passwordItem';
import VaultItem from './vaultItem';

const activeStyle = {
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  border: '1px solid rgb(24, 144, 255)',
};

interface ActiveItem {
  activePassword: Password['_id'];
  activeFolder: Password['folderId'];
  activeVault: Password['vaultId'];
}

interface VaultProps {
  vaults: Vault[];
  select(): void;
}

@observer
class PasswordList extends Component<VaultProps> {
  @observable
  private activeItem: ActiveItem = {
    activePassword: '',
    activeFolder: '',
    activeVault: '',
  };

  render(): ReactNode {
    const {vaults} = this.props;
    const {activePassword, activeFolder, activeVault} = this.activeItem;

    return (
      <div className="passwordList">
        {vaults.map((vault, index) => {
          const {_id, folders} = vault;
          const isVaultActive = activeVault === _id;

          return (
            <div className="singleVault" key={String(index)}>
              <VaultItem
                style={isVaultActive ? activeStyle : undefined}
                vault={vault}
                isActive={isVaultActive}
                clickVault={() => this.onVaultClick(_id)}
              />
              {isVaultActive
                ? folders.map((folder, index) => {
                    const {_id, passwords, vaultId} = folder;
                    const isFolderActive = activeFolder === _id;

                    return (
                      <div className="singleFolder" key={String(index)}>
                        <FolderItem
                          style={isFolderActive ? activeStyle : undefined}
                          isActive={isFolderActive}
                          folder={folder}
                          clickFolder={() => this.onFolderClick(_id, vaultId)}
                        />
                        {isFolderActive
                          ? passwords.map((password, index) => {
                              const {_id, vaultId, folderId} = password;
                              const isPasswordActive = activePassword === _id;

                              return (
                                <div
                                  className="singlePassword"
                                  key={String(index)}
                                >
                                  <PasswordItem
                                    style={
                                      isPasswordActive ? activeStyle : undefined
                                    }
                                    password={password}
                                    clickPassword={() =>
                                      this.onPasswordClick(
                                        _id,
                                        folderId,
                                        vaultId,
                                      )
                                    }
                                  />
                                </div>
                              );
                            })
                          : undefined}
                      </div>
                    );
                  })
                : undefined}
            </div>
          );
        })}
      </div>
    );
  }

  private onVaultClick(_id: Vault['_id']): void {
    this.updateActiveItem({
      activePassword: '',
      activeFolder: '',
      activeVault: _id,
    });
  }

  private onFolderClick(_id: Folder['_id'], vaultId: Folder['vaultId']): void {
    this.updateActiveItem({
      activePassword: '',
      activeFolder: _id,
      activeVault: vaultId,
    });
  }

  private onPasswordClick(
    _id: Password['_id'],
    vaultId: Password['vaultId'],
    folderId: Password['folderId'],
  ): void {
    this.updateActiveItem({
      activePassword: _id,
      activeFolder: folderId,
      activeVault: vaultId,
    });
  }

  @action
  private updateActiveItem(states: ActiveItem): void {
    this.activeItem = states;
  }
}

export default PasswordList;
export * from './folderItem';
export * from './passwordItem';
export * from './vaultItem';
