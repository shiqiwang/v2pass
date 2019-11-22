import {Button, Dropdown, Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DataContext} from '../../store';

import {NewFolder, NewItem, NewRandomPass, NewTarget, NewVault} from './index';

const types = ['Vault', 'Target', 'Random Password'];

interface DrawerStates {
  visible: boolean;
  type: string;
}

@observer
export class CreateNew extends Component {
  context!: React.ContextType<typeof DataContext>;

  @observable
  private drawer: DrawerStates = {
    visible: false,
    type: '',
  };

  render(): ReactNode {
    const {vaults, folders} = this.context;
    const menu = (
      <Menu onClick={(value): void => this.onAddButtonClick(value)}>
        <Menu.Item key="Password" disabled={!folders.length}>
          Password
        </Menu.Item>
        <Menu.Item key="Folder" disabled={!vaults.length}>
          Folder
        </Menu.Item>
        {types.map(type => (
          <Menu.Item key={type}>{type}</Menu.Item>
        ))}
      </Menu>
    );
    const {visible, type} = this.drawer;

    return (
      <div>
        <Dropdown overlay={menu}>
          <Button type="primary" icon="plus" className="newButton">
            New
          </Button>
        </Dropdown>
        {type === 'Password' && (
          <NewItem
            drawer={{visible, onClose: this.onClose}}
            key={Math.random()}
          />
        )}
        {type === 'Folder' && (
          <NewFolder
            drawer={{visible, onClose: this.onClose}}
            key={Math.random()}
          />
        )}
        {type === 'Vault' && (
          <NewVault
            drawer={{visible, onClose: this.onClose}}
            key={Math.random()}
          />
        )}
        {type === 'Target' && (
          <NewTarget
            drawer={{visible, onClose: this.onClose}}
            key={Math.random()}
          />
        )}
        {type === 'Random Password' && (
          <NewRandomPass drawer={{visible, onClose: this.onClose}} />
        )}
      </div>
    );
  }

  private onClose = (): void => {
    this.toggleDrawer({visible: false, type: ''});
  };

  private onAddButtonClick = (value: ClickParam): void => {
    this.toggleDrawer({visible: true, type: value.key});
  };

  @action
  private toggleDrawer(states: DrawerStates): void {
    this.drawer = states;
  }

  static contextType = DataContext;
}
