import {Button} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

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
        <div className="stepBox">
          安全提示：请下载您的Secret
          Key保存至安全的地方，也请务必记住自己的密码，为了安全考虑v2pass不提供密码找回功能
        </div>
        <div className="stepBox">Secret Key: {secretKey}</div>
        <Button
          onClick={() => this.props.backward()}
          className="backwardButton"
        >
          Backward
        </Button>
        <Button type="primary" icon="download">
          download
        </Button>
      </div>
    );
  }
}
