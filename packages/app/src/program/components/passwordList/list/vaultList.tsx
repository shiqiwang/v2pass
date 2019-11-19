import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderItem from '../item/folderItem';
import VaultItem from '../item/vaultItem';
import {VaultListProps} from '../types/types';

import PasswordList from './passwordList';

@observer
export default class VaultList extends Component<VaultListProps> {
  render(): ReactNode {
    const {activeItem, clickItem, vaults} = this.props;

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
