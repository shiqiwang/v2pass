import {Button, Dropdown, Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import DataProcess from '../../dataProcess';

import NewFolder from './newFolder';
import NewItem from './newItem';
import NewRandomPass from './newRandomPass';
import NewTarget from './newTarget';
import NewVault from './newVault';

const types = ['Folder', 'Vault', 'Password', 'Target', 'Random Password'];

interface DrawerStates {
  visible: boolean;
  type: string;
}

interface IProps {
  dataProcess: DataProcess;
}

@observer
class CreateNew extends Component<IProps> {
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

    const {dataProcess} = this.props;

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
              id: uuid(),
              folderId: '',
              vaultId: '',
              pass_name: '',
              items: [{id: uuid(), type: 'text', label: '', value: ''}],
              collect: false,
              targetId: '',
            }}
            dataProcess={dataProcess}
          />
        )}
        {type === 'Folder' && (
          <NewFolder
            drawer={{visible, onClose: this.onClose}}
            folder={{name: '', describe: '', id: uuid(), vaultId: ''}}
            vaultInfoArray={dataProcess.vaultInfoArray}
          />
        )}
        {type === 'Vault' && (
          <NewVault
            drawer={{visible, onClose: this.onClose}}
            vault={{name: '', describe: '', id: uuid(), type: 'private'}}
          />
        )}
        {type === 'Target' && (
          <NewTarget
            drawer={{visible, onClose: this.onClose}}
            target={{
              displayName: '',
              id: uuid(),
              entries: [{id: uuid(), type: 'website URL', value: ''}],
            }}
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
}

export default CreateNew;
