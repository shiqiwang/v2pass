import {Empty, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {findByName} from '../../util/util';

import PasswordList from './list/passwordList';
import VaultList from './list/vaultList';
import {ActiveItem, ForSearch, ListProps} from './types/types';

// 看看是否能把clickItem放到InductionContainer上
// 加入targets
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

  render(): ReactNode {
    const {vaults} = this.props;
    const {text, result} = this.search;

    return (
      <div className="list">
        <Input.Search
          type="text"
          onSearch={value => this.onSearchPassword(value)}
        />
        {!text ? (
          <VaultList
            vaults={vaults}
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
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
    const result = findByName(value, this.props.vaults);

    if (value && result.length) {
      const {_id, folderId, vaultId} = result[0];
      item = {
        activeFolder: folderId,
        activePassword: _id,
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
}

export default List;
export * from './item/folderItem';
export * from './item/passwordItem';
export * from './item/vaultItem';
