import {Button, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import './copyableContainer.less';

interface CopyableContainerProps {
  data: {
    label: string;
    value: string;
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
      <div className="copyableContainer">
        <div className="label">{label}</div>
        <div className="value">
          {!secure || this.passwordVisible ? value : '..........'}
        </div>
        <div className="operations">
          <Button.Group size="large">
            <CopyToClipboard
              text={this.props.data.value}
              onCopy={() => this.copyValue()}
            >
              <Button type="primary">Copy</Button>
            </CopyToClipboard>
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

  private copyValue(): void {
    message.success('copied');
  }

  private showPassword(status: boolean): void {
    this.updatePasswordVisible(status);
  }
}
