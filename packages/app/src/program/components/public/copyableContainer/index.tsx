import {Button, Icon} from 'antd';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface CopyableContainerProps {
  label: string;
  value: string;
  password?: boolean;
}

class CopyableContainer extends Component<CopyableContainerProps> {
  render(): ReactNode {
    const {label, value, password} = this.props;

    return (
      <div className="copyableContainer" onClick={this.copyValue}>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
        <div className="operations">
          <Button.Group size="large">
            <Button type="primary">Copy</Button>
            {password && <Button type="primary">Reveal</Button>}
          </Button.Group>
        </div>
      </div>
    );
  }

  private copyValue(): void {}
}

export default CopyableContainer;
