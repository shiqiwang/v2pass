import {Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {findByName} from '../../util/util';

import PasswordList from './list/passwordList';
import VaultList from './list/vaultList';
import {ActiveItem, ForSearch, ListProps} from './types/types';

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
        ) : (
          <PasswordList
            passwords={result}
            activeItem={this.activeItem}
            clickItem={activeItem => this.onItemClick(activeItem)}
            asSearch={true}
          />
        )}
      </div>
    );
  }

  private onItemClick(activeItem: ActiveItem): void {
    this.updateActiveItem(activeItem);
  }

  private onSearchPassword(value: string): void {
    const result = findByName(value, this.props.vaults);
    this.updateSearch({text: value, result});
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
