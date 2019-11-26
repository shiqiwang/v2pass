import {Button, Col, Form, Input, Row, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {KeyGenerator} from '../../../auth';
import {emailVerifyApi, testEmailApi, updateEmailApi} from '../../../request';
import {Email, EmailVerifyCode, MasterPassword} from '../../../types';
import {IChangeEmail} from '../type';

type IChangeEmailLabel = keyof IChangeEmail;

interface IProps {
  refresh(): void;
}

@observer
export class ChangeEmail extends Component<IProps> {
  @observable
  private data: IChangeEmail = {
    email: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
    code: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
    password: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
  };

  render(): ReactNode {
    const {email, password, code} = this.data;

    return (
      <div className="changeEmail">
        <Form>
          <Form.Item
            hasFeedback
            validateStatus={password.validateStatus}
            help={password.help}
          >
            <Input
              value={password.value}
              onChange={event =>
                this.updateData('password', {value: event.target.value})
              }
              placeholder="confirm password"
              type="password"
            />
          </Form.Item>
          <Form.Item
            hasFeedback
            validateStatus={email.validateStatus}
            help={email.help}
          >
            <Input
              value={email.value}
              placeholder="new email"
              onChange={event =>
                this.updateData('email', {value: event.target.value})
              }
            />
          </Form.Item>
          <Form.Item validateStatus={code.validateStatus} help={code.help}>
            <Row>
              <Col span={12}>
                <Input
                  value={code.value}
                  onChange={event =>
                    this.updateData('code', {value: event.target.value})
                  }
                />
              </Col>
              <Col span={11} offset={1}>
                <Button onClick={() => this.onSendVerifyEmail()}>
                  获取验证码
                </Button>
              </Col>
            </Row>
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

  private async onTestEmail(value: Email): Promise<boolean> {
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

    if (!pattern.test(value)) {
      this.updateData('email', {
        validateStatus: 'error',
        help: 'wrong format',
      });
      return false;
    } else {
      const result = await testEmailApi(value);
      const {code, data} = result;

      if (code) {
        this.updateData('email', {validateStatus: 'success', help: ''});
        return true;
      } else {
        this.updateData('email', {validateStatus: 'error', help: data});
        return false;
      }
    }
  }

  private onTestCode(value: EmailVerifyCode): boolean {
    const code = Number(value);

    if (isNaN(code)) {
      this.updateData('code', {
        help: 'verification code just contains number',
        validateStatus: 'error',
      });
      return false;
    } else if (value === '') {
      this.updateData('code', {
        help: '',
        validateStatus: 'warning',
      });
      return false;
    } else {
      this.updateData('code', {
        help: '',
        validateStatus: 'success',
      });
      return true;
    }
  }

  private onTestPassword(value: MasterPassword): boolean {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updateData('password', {
        validateStatus: 'error',
        help: 'length 10-30',
      });
      return false;
    } else {
      this.updateData('password', {validateStatus: 'success', help: ''});
      return true;
    }
  }

  private async onSendVerifyEmail(): Promise<void> {
    const {value} = this.data.email;
    const emailStatus = await this.onTestEmail(value);

    if (emailStatus) {
      emailVerifyApi(value)
        .then(result => {
          if (result) {
            message.success('email send successfully');
          }
        })
        .catch(error => message.error(error.message));
    }
  }

  private async onSave(): Promise<void> {
    const {email, code, password} = this.data;
    const emailStatus = await this.onTestEmail(email.value);
    const codeStatus = this.onTestCode(code.value);
    const passwordStatus = this.onTestPassword(password.value);

    if (emailStatus && codeStatus && passwordStatus) {
      chrome.storage.local.get(items => {
        const {id, secretKey} = items;
        const unlockKey = new KeyGenerator({
          id,
          password: password.value,
          secretKey,
          email: items.email,
        }).createUnlockKey();
        const newVerify = new KeyGenerator({
          id,
          secretKey,
          email: email.value,
          password: password.value,
        }).createVerify();
        updateEmailApi(email.value, unlockKey, newVerify, code.value)
          .then(result => {
            if (result) {
              chrome.storage.local.set({email: email.value});
              this.props.refresh();
              message.success('update email successfully');
            }
          })
          .catch(error => message.error(error.message));
      });
    }
  }

  @action
  private updateData<TLabel extends IChangeEmailLabel>(
    label: TLabel,
    value: Partial<IChangeEmail[TLabel]>,
  ): void {
    this.data[label] = {
      ...this.data[label],
      ...value,
    };
  }
}
