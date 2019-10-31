import {Button, Drawer} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {UserBaseInfo} from '../../types';
import {CopyableContainer} from '../copyableContainer';

import './index.less';

import UserSetting from './userSetting/userSetting';

interface UserBaseInfoProps {
  userInfo: UserBaseInfo;
}

@observer
export default class Profile extends Component<UserBaseInfoProps> {
  @observable
  private visible: boolean = false;

  render(): ReactNode {
    const {username, email, secretKey} = this.props.userInfo;

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
          <UserSetting canChange={{username, email, secretKey}} />
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
