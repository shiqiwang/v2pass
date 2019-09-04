import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {findByName} from '../../util/util';

import PasswordList from './list/passwordList';
import VaultList from './list/vaultList';
import {ActiveItem, ListProps} from './types/types';

@observer
class List extends Component<ListProps> {
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

    return (
      <div className="list">
        <VaultList
          vaults={vaults}
          activeItem={this.activeItem}
          clickItem={activeItem => this.onItemClick(activeItem)}
        />
      </div>
    );
  }

  private onItemClick(activeItem: ActiveItem): void {
    this.updateActiveItem(activeItem);
    this.props.select(activeItem);
  }

  @action
  private updateActiveItem(states: ActiveItem): void {
    this.activeItem = states;
  }
}

export default List;
export * from './item/folderItem';
export * from './item/passwordItem';
export * from './item/vaultItem';
