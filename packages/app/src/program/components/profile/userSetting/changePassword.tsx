import {Button, Form, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {MasterPassword} from '../../../types';
import {IChangePassword} from '../type';

type IChangePasswordLabel = keyof IChangePassword;

@observer
export default class ChangePassword extends Component {
  @observable
  private oldPassword: MasterPassword = '';
  @observable
  private data: IChangePassword = {
    password: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
    repeatPassword: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
  };

  render(): ReactNode {
    const {password, repeatPassword} = this.data;

    return (
      <div className="changePassword">
        <Form>
          <Form.Item>
            <Input
              type="password"
              placeholder="current password"
              value={this.oldPassword}
              onChange={event => this.onOldPasswordChange(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={password.validateStatus}
            help={password.help}
          >
            <Input
              value={password.value}
              placeholder="new password"
              type="password"
              onChange={event =>
                this.onDataChange('password', event.target.value)
              }
              onBlur={event => this.onTestPassword(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={repeatPassword.validateStatus}
            help={repeatPassword.help}
          >
            <Input
              value={repeatPassword.value}
              placeholder="check password"
              type="password"
              onChange={event =>
                this.onDataChange('repeatPassword', event.target.value)
              }
              onBlur={event => this.onCheckPassword(event.target.value)}
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

  private onSave(): void {}

  private onOldPasswordChange = (value: MasterPassword): void => {
    this.updateOldPassword(value);
  };

  private onDataChange = (
    label: IChangePasswordLabel,
    value: MasterPassword,
  ): void => {
    this.updateData(label, {value});
  };

  private onTestPassword = (value: MasterPassword): void => {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updateData('password', {
        validateStatus: 'error',
        help: 'length 10-30',
      });
    } else {
      this.updateData('password', {validateStatus: 'success', help: ''});
    }
  };

  private onCheckPassword = (value: MasterPassword): void => {
    if (value === this.data.password.value) {
      this.updateData('repeatPassword', {validateStatus: 'success', help: ''});
    } else {
      this.updateData('repeatPassword', {
        validateStatus: 'error',
        help: 'different from the password',
      });
    }
  };

  @action
  private updateData<TLabel extends IChangePasswordLabel>(
    label: TLabel,
    value: Partial<IChangePassword[TLabel]>,
  ): void {
    this.data[label] = {
      ...this.data[label],
      ...value,
    };
  }

  @action
  private updateOldPassword(value: MasterPassword): void {
    this.oldPassword = value;
  }
}
