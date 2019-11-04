import {Button, Drawer} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {UserBaseInfo} from '../../types';
import {CopyableContainer} from '../copyableContainer';

import './index.less';

import UserSetting from './userSetting/userSetting';

@observer
export default class Profile extends Component {
  @observable
  private visible: boolean = false;

  @observable
  private userInfo: UserBaseInfo = {
    username: '',
    email: '',
    id: '',
    secretKey: '',
  };

  render(): ReactNode {
    const {username, email, secretKey} = this.userInfo;

    return (
      <div className="profile">
        <Button onClick={() => this.onShow()}>Profile</Button>
        <Drawer
          title="Profile"
          placement="right"
          closable={false}
          onClose={() => this.onClose()}
          visible={this.visible}
          width={400}
        >
          <div className="baseInfoBox">
            <CopyableContainer data={{label: 'username', value: username}} />
            <CopyableContainer data={{label: 'email', value: email}} />
            <CopyableContainer data={{label: 'secretKey', value: secretKey}} />
          </div>
          <UserSetting
            canChange={{username, email, secretKey}}
            refresh={() => this.refresh()}
          />
        </Drawer>
      </div>
    );
  }

  componentWillMount(): void {
    this.getData();
  }

  private refresh(): void {
    this.getData();
  }

  private getData(): void {
    chrome.storage.local.get(items => {
      const {username, email, id, secretKey} = items;
      this.updateUserInfo({username, email, id, secretKey});
    });
  }

  private onShow = (): void => {
    this.updateVisible(true);
  };

  private onClose = (): void => {
    this.updateVisible(false);
  };

  @action
  private updateVisible = (value: boolean): void => {
    this.visible = value;
  };

  @action
  private updateUserInfo = (value: Partial<UserBaseInfo>): void => {
    this.userInfo = {
      ...this.userInfo,
      ...value,
    };
  };
}
