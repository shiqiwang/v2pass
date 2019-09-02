import {Card, Icon, InputNumber, Rate, Switch} from 'antd';
import {observable} from 'mobx';
import React, {Component, ReactNode} from 'react';

import './generateRandomPassword.less';

class GenerateRandomPassword extends Component {
  @observable passwordComplexity = 0;

  render(): ReactNode {
    return (
      <div className="generateRandomPassword">
        <Card style={{width: 300}}>
          <Icon className="renew" type="sync" />
          <div className="row">
            <span className="label">密码强度</span>
            <Rate disabled defaultValue={this.passwordComplexity} />
          </div>
          <div className="row rowSecond">
            <span className="label">密码长度</span>
            <InputNumber min={6} max={36} />
          </div>
          <div className="row">
            <span className="label">使用数字</span>
            <Switch defaultChecked />
            <span className="label">使用符号</span>
            <Switch defaultChecked />
          </div>
        </Card>
      </div>
    );
  }
}

export default GenerateRandomPassword;
