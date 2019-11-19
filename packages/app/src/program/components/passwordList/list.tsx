import {Empty, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DataContext} from '../../store';

import PasswordList from './list/passwordList';
import VaultList from './list/vaultList';
import {ActiveItem, ForSearch, ListProps} from './types/types';

@observer
class List extends Component<ListProps> {
  @observable
  private activeItem: ActiveItem = {
    activePassword: '',
    activeFolder: '',
    activeVault: '',
  };
  @observable
  private search: ForSearch = {
    text: '',
    result: [],
  };
  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {text, result} = this.search;

    return (
      <div className="list">
        <Input.Search
          type="text"
          onSearch={value => this.onSearchPassword(value)}
        />
        {!text ? (
          <VaultList
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
            vaults={this.context.vaults}
          />
        ) : result.length ? (
          <PasswordList
            passwords={result}
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
            asSearch={true}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    );
  }

  private onItemClick(activeItem: ActiveItem): void {
    this.updateActiveItem(activeItem);
    this.props.select(activeItem);
  }

  private onSearchPassword(value: string): void {
    let item: ActiveItem = {
      activeVault: '',
      activeFolder: '',
      activePassword: '',
    };
    const result = this.context.findPasswordsByName(value);

    if (value && result.length) {
      const {id, folderId, vaultId} = result[0];
      item = {
        activeFolder: folderId,
        activePassword: id,
        activeVault: vaultId,
      };
    }

    this.updateSearch({text: value, result});
    this.updateActiveItem(item);
    this.props.select(item);
  }

  @action
  private updateActiveItem(states: ActiveItem): void {
    this.activeItem = states;
  }

  @action
  private updateSearch(states: ForSearch): void {
    this.search = states;
  }

  static contextType = DataContext;
}

export default List;
export * from './item/folderItem';
export * from './item/passwordItem';
export * from './item/vaultItem';
