import {Button, Form, Input, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {createUnlockKey, createVerify} from '../../../auth';
import {updateVerify} from '../../../request';
import {MasterPassword} from '../../../types';
import {IChangePassword} from '../type';

type IChangePasswordLabel = keyof IChangePassword;

@observer
export default class ChangePassword extends Component {
  @observable
  private data: IChangePassword = {
    old: {
      validateStatus: undefined,
      value: '',
      help: '',
    },
    password: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
    repeat: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
  };

  render(): ReactNode {
    const {password, repeat, old} = this.data;

    return (
      <div className="changePassword">
        <Form>
          <Form.Item>
            <Input
              type="password"
              placeholder="current password"
              value={old.value}
              onChange={event => this.onDataChange('old', event.target.value)}
              onBlur={event => this.onTestPassword('old', event.target.value)}
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
              onBlur={event =>
                this.onTestPassword('password', event.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={repeat.validateStatus}
            help={repeat.help}
          >
            <Input
              value={repeat.value}
              placeholder="check password"
              type="password"
              onChange={event =>
                this.onDataChange('repeat', event.target.value)
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

  private onSave(): void {
    const {old, password, repeat} = this.data;

    if (
      old.validateStatus === 'success' &&
      password.validateStatus === 'success' &&
      repeat.validateStatus === 'success'
    ) {
      chrome.storage.local.get(items => {
        const {id, email, secretKey} = items;
        const unlockKey = createUnlockKey({
          id,
          email,
          secretKey,
          password: old.value,
        });
        const verify = createVerify({
          id,
          email,
          secretKey,
          password: password.value,
        });
        updateVerify(unlockKey, verify)
          .then(result => {
            if (result) {
              message.success('update successfully');
            }
          })
          .catch(error => message.error(error));
      });
    }
  }

  private onDataChange = (
    label: IChangePasswordLabel,
    value: MasterPassword,
  ): void => {
    this.updateData(label, {value});
  };

  private onTestPassword = (
    label: 'password' | 'old',
    value: MasterPassword,
  ): void => {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updateData(label, {
        validateStatus: 'error',
        help: 'length 10-30',
      });
    } else {
      this.updateData(label, {validateStatus: 'success', help: ''});
    }
  };

  private onCheckPassword = (value: MasterPassword): void => {
    if (value === this.data.password.value) {
      this.updateData('repeat', {validateStatus: 'success', help: ''});
    } else {
      this.updateData('repeat', {
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
}
