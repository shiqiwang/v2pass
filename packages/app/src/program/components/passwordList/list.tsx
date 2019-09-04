import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import PasswordList from './list/passwordList';
import VaultList from './list/vaultList';
import {ActiveItem, ListProps} from './types/types';

// 在search与否之间转换时，需要有一个初始化activeItem的机制
// 明天需要把vault、folder、password的detail再抽一下
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

  render(): ReactNode {
    const {vaults, search, searchResult} = this.props;

    return (
      <div className="list">
        {!search ? (
          <VaultList
            vaults={vaults}
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
          />
        ) : (
          <PasswordList
            passwords={searchResult}
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
          />
        )}
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
