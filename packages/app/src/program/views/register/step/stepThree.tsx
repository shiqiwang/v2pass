import {Button, Icon} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

@observer
export default class StepThree extends Component {
  render(): ReactNode {
    return (
      <div className="stepThree">
        <div>安全提示：</div>
        <div>Secret Key: </div>
        <Button>download</Button>
      </div>
    );
  }
}
