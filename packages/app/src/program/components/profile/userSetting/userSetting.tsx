import {Collapse} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import ChangeUsername from './changeUsername';

const {Panel} = Collapse;

@observer
export default class UserSetting extends Component {
  render(): ReactNode {
    return (
      <Collapse accordion>
        <Panel header="change username" key="1">
          <ChangeUsername oldUsername="" />
        </Panel>
        <Panel header="change email" key="2"></Panel>
        <Panel header="change password" key="3"></Panel>
        <Panel header="change secret key" key="4"></Panel>
      </Collapse>
    );
  }
}
