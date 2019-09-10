import {Button, Dropdown, Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import NewFolder from './newFolder';
import NewItem from './newItem';
import NewTarget from './newTarget';
import NewVault from './newVault';

const types = ['Folder', 'Vault', 'Password', 'Target'];

interface DrawerStates {
  visible: boolean;
  type: string;
}

@observer
class CreateNew extends Component {
  @observable
  private drawer: DrawerStates = {
    visible: false,
    type: '',
  };

  render(): ReactNode {
    const menu = (
      <Menu onClick={(value): void => this.onAddButtonClick(value)}>
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
            password={{
              _id: '',
              folderId: '',
              vaultId: '',
              pass_name: '',
              items: [],
              collect: false,
              targetId: '',
            }}
          />
        )}
        {type === 'Folder' && (
          <NewFolder
            drawer={{visible, onClose: this.onClose}}
            folder={{name: '', describe: '', _id: '', vaultId: ''}}
          />
        )}
        {type === 'Vault' && (
          <NewVault
            drawer={{visible, onClose: this.onClose}}
            vault={{name: '', describe: '', _id: '', type: 'private'}}
          />
        )}
        {type === 'Target' && (
          <NewTarget
            drawer={{visible, onClose: this.onClose}}
            target={{
              displayName: '',
              _id: uuid(),
              entries: [{_id: uuid(), type: 'website URL', value: ''}],
            }}
          />
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
}

export default CreateNew;
