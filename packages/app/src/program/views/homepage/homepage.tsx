import {Button, Col, Dropdown, Menu, Row} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderDetail from '../../components/folderDetail';
import NewFolder from '../../components/newFolder';
import NewItem from '../../components/newItem';
import NewRandomPass from '../../components/newRandomPass';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList';
import PasswordSearch from '../../components/passwordSearch';
import {Router} from '../../router';

const password = {
  title: 'password',
  iconType: 'file',
  note: 'note',
  pass: '1234567',
  userName: 'emi',
  target: ['taobao.com', 'tianmao.com'],
  moreInfo: [{label: 'more', value: 'info'}],
};

export interface HomePageProps
  extends RouteComponentProps<Router['homepage']> {}

@observer
class HomePage extends Component<HomePageProps> {
  @observable
  private newFolderDrawerVisible = false;
  @observable
  private newItemDrawerVisible = false;
  @observable
  private newRandomPassDrawerVisible = false;

  render(): ReactNode {
    // let {match} = this.props;
    // console.log(match.$params.id); 如果有query等可以用该方式获取
    const menu = (
      <Menu onClick={(value): void => this.onAddButtonClick(value)}>
        <Menu.Item key="newFolder">New Folder</Menu.Item>
        <Menu.Item key="newItem">New Item</Menu.Item>
        <Menu.Item key="newRandomPass">Generate Password</Menu.Item>
      </Menu>
    );

    return (
      <div className="homePage">
        <Row>
          <Col span={20}>
            <PasswordSearch />
          </Col>
          <Col span={4}>
            <Dropdown overlay={menu}>
              <Button type="primary" icon="plus" />
            </Dropdown>
          </Col>
        </Row>
        <NewFolder
          drawer={{
            visible: this.newFolderDrawerVisible,
            onClose: this.onNewFolderDrawerClose,
          }}
        />
        <NewItem
          drawer={{
            visible: this.newItemDrawerVisible,
            onClose: this.onNewItemDrawerClose,
          }}
        />
        <NewRandomPass
          drawer={{
            visible: this.newRandomPassDrawerVisible,
            onClose: this.onNewRandomPassDrawerClose,
          }}
        />
        <PasswordList />
        <PasswordDetail password={password} />
        <FolderDetail folderName="folderName" folderDetail="folder detail" />
      </div>
    );
  }

  private onNewFolderDrawerClose = (): void => {
    this.toggleNewFolderDrawer(false);
  };

  private onNewItemDrawerClose = (): void => {
    this.toggleNewItemDrawer(false);
  };

  private onNewRandomPassDrawerClose = (): void => {
    this.toggleNewRandomPassDrawer(false);
  };

  private onAddButtonClick = (value: ClickParam): void => {
    switch (value.key) {
      case 'newFolder':
        this.toggleNewFolderDrawer(true);
        break;
      case 'newItem':
        this.toggleNewItemDrawer(true);
        break;
      case 'newRandomPass':
        this.toggleNewRandomPassDrawer(true);
        break;
    }
  };

  @action
  private toggleNewFolderDrawer(visible: boolean): void {
    this.newFolderDrawerVisible = visible;
  }

  @action
  private toggleNewItemDrawer(visible: boolean): void {
    this.newItemDrawerVisible = visible;
  }

  @action
  private toggleNewRandomPassDrawer(visible: boolean): void {
    this.newRandomPassDrawerVisible = visible;
  }
}

export default HomePage;
