import {Button} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './copyableContainer.less';

interface CopyableContainerProps {
  data: {
    label: string;
    value: string | number | Date;
    secure?: boolean;
  };
}

@observer
export class CopyableContainer extends Component<CopyableContainerProps> {
  @observable
  private passwordVisible = false;

  render(): ReactNode {
    const {label, value, secure} = this.props.data;

    return (
      <div className="copyableContainer" onClick={this.copyValue}>
        <div className="label">{label}</div>
        <div className="value">
          {!secure || this.passwordVisible ? value : '..........'}
        </div>
        <div className="operations">
          <Button.Group size="large">
            <Button type="primary" onClick={this.copyValue}>
              Copy
            </Button>
            {secure && (
              <Button
                type="primary"
                onClick={() => this.showPassword(!this.passwordVisible)}
              >
                {this.passwordVisible ? 'Hide' : 'Reveal'}
              </Button>
            )}
          </Button.Group>
        </div>
      </div>
    );
  }

  @action
  updatePasswordVisible(status: boolean): void {
    this.passwordVisible = status;
  }

  private copyValue(): void {}

  private showPassword(status: boolean): void {
    this.updatePasswordVisible(status);
  }
}
