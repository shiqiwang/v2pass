import React, {Component, ReactNode} from 'react';

import FolderItem from '../item/folderItem';
import VaultItem from '../item/vaultItem';
import {VaultListProps} from '../types/types';

import PasswordList from './passwordList';

export default class VaultList extends Component<VaultListProps> {
  render(): ReactNode {
    const {activeItem, clickItem, dataProcess} = this.props;
    const {vaults} = dataProcess;

    return (
      <div className="vaultLists">
        {vaults.map((vault, index) => {
          const {folders} = vault;

          return (
            <div key={String(index)} className="singleVault">
              <VaultItem
                vault={vault}
                activeItem={activeItem}
                clickItem={clickItem}
              />
              {folders.map((folder, index) => {
                return (
                  <div className="singleFolder" key={String(index)}>
                    <FolderItem
                      folder={folder}
                      activeItem={activeItem}
                      clickItem={clickItem}
                    />
                    <PasswordList
                      passwords={folder.passwords}
                      activeItem={activeItem}
                      clickItem={clickItem}
                      asSearch={false}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
