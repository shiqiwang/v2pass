import {Button, Icon} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './step.less';

interface IStepThreeProps {
  backward(): void;
}

@observer
export default class StepThree extends Component<IStepThreeProps> {
  render(): ReactNode {
    return (
      <div className="registerPageStep">
        <div className="stepBox">安全提示：</div>
        <div className="stepBox">Secret Key: </div>
        <Button
          onClick={() => this.props.backward()}
          className="backwardButton"
        >
          Backward
        </Button>
        <Button type="primary">download</Button>
      </div>
    );
  }
}
