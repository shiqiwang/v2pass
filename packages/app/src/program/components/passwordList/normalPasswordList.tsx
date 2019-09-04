import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Folder from '../../types/folder';
import Password from '../../types/password';
import Vault from '../../types/vault';
import {findByName} from '../../util/util';

import FolderItem from './item/folderItem';
import PasswordItem from './item/passwordItem';
import VaultItem from './item/vaultItem';

const activeStyle = {
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  border: '1px solid rgb(24, 144, 255)',
};

export interface ActiveItem {
  activePassword: Password['_id'];
  activeFolder: Password['folderId'];
  activeVault: Password['vaultId'];
}

interface VaultProps {
  vaults: Vault[];
  search: string;
  select(activeItem: ActiveItem): void;
}

@observer
class PasswordList extends Component<VaultProps> {
  @observable
  private activeItem: ActiveItem = {
    activePassword: '',
    activeFolder: '',
    activeVault: '',
  };

  @observable
  private searchResult = findByName(this.props.search, this.props.vaults);

  render(): ReactNode {
    const {vaults, search} = this.props;
    const {activePassword, activeFolder, activeVault} = this.activeItem;
    console.log(search, this.searchResult);

    // 这个search还有问题，明天拆分看看 太挤了
    return (
      <div className="passwordList">
        {!!search
          ? this.searchResult.map((password, index) => {
              const {_id, vaultId, folderId} = password;
              const isPasswordActive = activePassword === _id;

              return (
                <div key={String(index)}>
                  <PasswordItem
                    style={isPasswordActive ? activeStyle : undefined}
                    password={password}
                    clickPassword={() =>
                      this.onPasswordClick(_id, folderId, vaultId)
                    }
                  />
                </div>
              );
            })
          : vaults.map((vault, index) => {
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
                              clickFolder={() =>
                                this.onFolderClick(_id, vaultId)
                              }
                            />
                            {isFolderActive
                              ? passwords.map((password, index) => {
                                  const {_id, vaultId, folderId} = password;
                                  const isPasswordActive =
                                    activePassword === _id;

                                  return (
                                    <div
                                      className="singlePassword"
                                      key={String(index)}
                                    >
                                      <PasswordItem
                                        style={
                                          isPasswordActive
                                            ? activeStyle
                                            : undefined
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
    const activeItem = {
      activePassword: '',
      activeFolder: '',
      activeVault: _id,
    };
    this.updateActiveItem(activeItem);
    this.props.select(activeItem);
  }

  private onFolderClick(_id: Folder['_id'], vaultId: Folder['vaultId']): void {
    const activeItem = {
      activePassword: '',
      activeFolder: _id,
      activeVault: vaultId,
    };
    this.updateActiveItem(activeItem);
    this.props.select(activeItem);
  }

  private onPasswordClick(
    _id: Password['_id'],
    vaultId: Password['vaultId'],
    folderId: Password['folderId'],
  ): void {
    const activeItem = {
      activePassword: _id,
      activeFolder: folderId,
      activeVault: vaultId,
    };
    this.updateActiveItem(activeItem);
    this.props.select(activeItem);
  }

  @action
  private updateActiveItem(states: ActiveItem): void {
    this.activeItem = states;
  }
}

export default PasswordList;
export * from './item/folderItem';
export * from './item/passwordItem';
export * from './item/vaultItem';
