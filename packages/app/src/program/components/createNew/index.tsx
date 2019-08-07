import {Button, Dropdown, Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {NEW_FOLDER, NEW_ITEM, NEW_RANDOM_PASS} from '../../const/const';
import NewFolder from '../public/newFolder';
import NewItem from '../public/newItem';
import NewRandomPass from '../public/newRandomPass';

@observer
class CreateNew extends Component {
  @observable
  private newFolderDrawerVisible = false;
  @observable
  private newItemDrawerVisible = false;
  @observable
  private newRandomPassDrawerVisible = false;

  render(): ReactNode {
    const menu = (
      <Menu onClick={(value): void => this.onAddButtonClick(value)}>
        <Menu.Item key={NEW_FOLDER}>New Folder</Menu.Item>
        <Menu.Item key={NEW_ITEM}>New Item</Menu.Item>
        <Menu.Item key={NEW_RANDOM_PASS}>Generate Password</Menu.Item>
      </Menu>
    );

    return (
      <div className="createNew">
        <NewFolder
          drawer={{
            visible: this.newFolderDrawerVisible,
            onClose: () => this.onClose(NEW_FOLDER),
          }}
        />
        <NewItem
          drawer={{
            visible: this.newItemDrawerVisible,
            onClose: () => this.onClose(NEW_ITEM),
          }}
        />
        <NewRandomPass
          drawer={{
            visible: this.newRandomPassDrawerVisible,
            onClose: () => this.onClose(NEW_RANDOM_PASS),
          }}
        />
        <Dropdown overlay={menu}>
          <Button type="primary" icon="plus" className="newButton">
            New
          </Button>
        </Dropdown>
      </div>
    );
  }

  private onClose = (type: string): void => {
    this.toggleDrawer(type, false);
  };

  private onAddButtonClick = (value: ClickParam): void => {
    this.toggleDrawer(value.key, true);
  };

  @action
  private toggleDrawer(type: string, visible: boolean): void {
    switch (type) {
      case NEW_FOLDER:
        this.newFolderDrawerVisible = visible;
        break;
      case NEW_ITEM:
        this.newItemDrawerVisible = visible;
        break;
      case NEW_RANDOM_PASS:
        this.newRandomPassDrawerVisible = visible;
        break;
    }
  }
}

export default CreateNew;
