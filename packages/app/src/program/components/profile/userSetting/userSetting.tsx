import {Collapse} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {Email, SecretKey, Username} from '../../../types';

import ChangeEmail from './changeEmail';
import ChangePassword from './changePassword';
import ChangeSecretKey from './changeSecretKey';
import ChangeUsername from './changeUsername';

const {Panel} = Collapse;

interface ICanChangeInfo {
  canChange: {
    email: Email;
    secretKey: SecretKey;
    username: Username;
  };
  refresh(): void;
}

@observer
export default class UserSetting extends Component<ICanChangeInfo> {
  render(): ReactNode {
    const {email, secretKey, username} = this.props.canChange;
    const {refresh} = this.props;

    return (
      <Collapse accordion>
        <Panel header="change username" key="1">
          <ChangeUsername oldUsername={username} refresh={refresh} />
        </Panel>
        <Panel header="change email" key="2">
          <ChangeEmail oldEmail={email} refresh={refresh} />
        </Panel>
        <Panel header="change password" key="3">
          <ChangePassword />
        </Panel>
        <Panel header="change secret key" key="4">
          <ChangeSecretKey refresh={refresh} />
        </Panel>
      </Collapse>
    );
  }
}
