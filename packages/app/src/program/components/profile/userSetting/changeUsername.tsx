import {Button, Form, Input, message} from 'antd';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {testUsernameApi} from '../../../request';
import {Username} from '../../../types';
import {IChangeUsername} from '../type';

interface OldName {
  oldUsername: Username;
}

@observer
export default class ChangeUsername extends Component<OldName> {
  @observable
  private username: IChangeUsername = {
    value: '',
    validateStatus: undefined,
    help: '',
  };
  @observable
  private isChanged: boolean = false;

  @computed
  get value(): string {
    const {oldUsername} = this.props;

    if (this.isChanged) {
      return this.username.value;
    }

    return oldUsername;
  }

  render(): ReactNode {
    const {validateStatus, help} = this.username;

    return (
      <div className="changeUsername">
        <Form>
          <Form.Item hasFeedback validateStatus={validateStatus} help={help}>
            <Input
              value={this.value}
              onChange={event => this.onUsernameChange(event.target.value)}
              onBlur={event => this.onTestUsername(event.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.onSave()}>
              save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onUsernameChange = (value: Username): void => {
    const pattern = /^\w{5,30}$/;

    if (!pattern.test(value)) {
      this.updateUsername({
        value,
        validateStatus: 'error',
        help: 'length 5~30, contain a-z A-Z _',
      });
    } else {
      this.updateUsername({
        value,
        validateStatus: 'success',
        help: '',
      });
    }
  };

  private onTestUsername = (value: Username): void => {
    testUsernameApi(value)
      .then(result => {
        const {code, data} = result;

        if (code) {
          this.updateUsername({validateStatus: 'success', help: ''});
        } else {
          this.updateUsername({validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error));
  };

  private onSave = (): void => {};

  @action
  private updateUsername = (value: Partial<IChangeUsername>): void => {
    this.isChanged = true;
    this.username = {
      ...this.username,
      ...value,
    };
  };
}
