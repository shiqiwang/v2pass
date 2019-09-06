import {Button, Dropdown, Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateDrawer from '../createDrawer/createDrawer';

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
        <CreateDrawer visible={visible} type={type} onClose={this.onClose} />
        <Dropdown overlay={menu}>
          <Button type="primary" icon="plus" className="newButton">
            New
          </Button>
        </Dropdown>
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
