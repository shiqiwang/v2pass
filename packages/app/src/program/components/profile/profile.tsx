import {Button, Descriptions, Drawer} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {UserBaseInfo} from '../../types';

import UserSetting from './userSetting/userSetting';

interface UserBaseInfoProps {
  userInfo: UserBaseInfo;
}

@observer
export default class Profile extends Component<UserBaseInfoProps> {
  @observable
  private visible: boolean = false;

  render(): ReactNode {
    const {username, email} = this.props.userInfo;

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
          <Descriptions title="User Info" layout="vertical">
            <Descriptions.Item label="username">{username}</Descriptions.Item>
            <Descriptions.Item label="email">{email}</Descriptions.Item>
          </Descriptions>
          <UserSetting />
        </Drawer>
      </div>
    );
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
}
