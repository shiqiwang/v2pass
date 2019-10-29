import {Divider, Icon} from 'antd';
import {Link} from 'boring-router-react';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {router} from '../../../router';

import './step.less';

interface IStepThreeProps {
  secretKey: string;
  backward(): void;
}

@observer
export default class StepThree extends Component<IStepThreeProps> {
  render(): ReactNode {
    const {secretKey} = this.props;

    return (
      <div className="registerPageStep">
        <div>
          <span className="registerDown">注册完成</span>
          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
        </div>
        <Divider />
        <div className="stepBox">
          安全提示：
          <div>请把您的Secret Key保存至安全的地方</div>
          <div>请务必记住自己的密码，为了安全考虑v2pass不提供密码找回功能</div>
        </div>
        <Divider />
        <div className="stepBox">Secret Key: {secretKey}</div>
        <Link to={router.login}>login</Link>
      </div>
    );
  }
}
