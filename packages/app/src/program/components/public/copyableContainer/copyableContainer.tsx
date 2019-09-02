import {Button} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {PasswordItem} from '../../../../types/password';

import './copyableContainer.less';

interface CopyableContainerProps {
  data: {
    label: PasswordItem['label'];
    value: PasswordItem['value'];
    type: PasswordItem['type'];
  };
}

@observer
class CopyableContainer extends Component<CopyableContainerProps> {
  @observable
  private passwordVisible = false;

  render(): ReactNode {
    const {label, value, type} = this.props.data;

    return (
      <div className="copyableContainer" onClick={this.copyValue}>
        <div className="label">{label}</div>
        <div className="value">
          {type !== 'password' || this.passwordVisible ? value : '..........'}
        </div>
        <div className="operations">
          <Button.Group size="large">
            <Button type="primary" onClick={this.copyValue}>
              Copy
            </Button>
            {type === 'password' && (
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

export default CopyableContainer;
