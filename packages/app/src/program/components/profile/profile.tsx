import {Button, Collapse, Drawer} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {UserBaseInfo} from '../../types';
import {CopyableContainer} from '../copyableContainer';

import './index.less';

import {
  ChangeEmail,
  ChangePassword,
  ChangeSecretKey,
  ChangeUsername,
} from './userSetting';

const {Panel} = Collapse;

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
          <Collapse accordion>
            <Panel header="change username" key="1">
              <ChangeUsername refresh={this.onRefresh} />
            </Panel>
            <Panel header="change email" key="2">
              <ChangeEmail refresh={this.onRefresh} />
            </Panel>
            <Panel header="change password" key="3">
              <ChangePassword />
            </Panel>
            <Panel header="change secret key" key="4">
              <ChangeSecretKey refresh={this.onRefresh} />
            </Panel>
          </Collapse>
        </Drawer>
      </div>
    );
  }

  componentWillMount(): void {
    this.getUserInfo();
  }

  private onShow(): void {
    this.updateVisible(true);
  }

  private onRefresh = (): void => {
    this.getUserInfo();
  };

  private onClose = (): void => {
    this.updateVisible(false);
  };

  private getUserInfo = (): void => {
    chrome.storage.local.get(items => {
      const {username, email, id, secretKey} = items;
      this.updateUserInfo({username, email, id, secretKey});
    });
  };

  @action
  private updateVisible = (value: boolean): void => {
    this.visible = value;
  };

  @action
  private updateUserInfo(value: Partial<UserBaseInfo>): void {
    this.userInfo = {
      ...this.userInfo,
      ...value,
    };
  }
}
