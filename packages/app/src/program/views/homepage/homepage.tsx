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
import {NEW_FOLDER, NEW_ITEM, NEW_RANDOM_PASS} from '../../const/const';
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
        <Menu.Item key={NEW_FOLDER}>New Folder</Menu.Item>
        <Menu.Item key={NEW_ITEM}>New Item</Menu.Item>
        <Menu.Item key={NEW_RANDOM_PASS}>Generate Password</Menu.Item>
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
        <PasswordList />
        <PasswordDetail password={password} />
        <FolderDetail folderName="folderName" folderDetail="folder detail" />
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

export default HomePage;
