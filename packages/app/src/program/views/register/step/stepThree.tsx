import {Button, Icon} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

interface IStepThreeProps {
  backward(): void;
}

@observer
export default class StepThree extends Component<IStepThreeProps> {
  render(): ReactNode {
    return (
      <div className="stepThree">
        <div>安全提示：</div>
        <div>Secret Key: </div>
        <Button type="primary" onClick={() => this.props.backward()}>
          Backward
        </Button>
        <Button type="primary">download</Button>
      </div>
    );
  }
}
