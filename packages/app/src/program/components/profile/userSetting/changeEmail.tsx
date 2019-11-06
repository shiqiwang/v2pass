import {Button, Col, Form, Input, Row, message} from 'antd';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {KeyGenerator} from '../../../auth';
import {emailVerifyApi, testEmailApi, updateEmailApi} from '../../../request';
import {Email, EmailVerifyCode, MasterPassword} from '../../../types';
import {IChangeEmail} from '../type';

interface OldEmail {
  oldEmail: Email;
  refresh(): void;
}

type IChangeEmailLabel = keyof IChangeEmail;

@observer
export default class ChangeEmail extends Component<OldEmail> {
  @computed
  get value(): string {
    const {oldEmail} = this.props;

    if (this.isChanged) {
      return this.data.email.value;
    }

    return oldEmail;
  }

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
  @observable
  private isChanged: boolean = false;

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
              onChange={event => this.onPasswordInput(event.target.value)}
              onBlur={event => this.onTestPassword(event.target.value)}
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
              value={this.value}
              onChange={event => this.onEmailChange(event.target.value)}
              onBlur={event => this.onTestEmail(event.target.value)}
            />
          </Form.Item>
          <Form.Item validateStatus={code.validateStatus} help={code.help}>
            <Row>
              <Col span={12}>
                <Input
                  value={code.value}
                  onChange={event => this.onCodeChange(event.target.value)}
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

  private onEmailChange(value: Email): void {
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

    if (!pattern.test(value)) {
      this.updateData('email', {
        value,
        validateStatus: 'error',
        help: 'wrong format',
      });
    } else {
      this.updateData('email', {
        value,
        validateStatus: 'success',
        help: '',
      });
    }
  }

  private onTestEmail(value: Email): void {
    this.updateData('email', {validateStatus: 'validating', help: ''});
    testEmailApi(value)
      .then(result => {
        const {code, data} = result;

        if (code) {
          this.updateData('email', {validateStatus: 'success', help: ''});
        } else {
          this.updateData('email', {validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error.message));
  }

  private onCodeChange(value: EmailVerifyCode): void {
    const code = Number(value);

    if (isNaN(code)) {
      this.updateData('code', {
        help: 'verification code just contains number',
        validateStatus: 'error',
      });
    } else if (value === '') {
      this.updateData('code', {
        value,
        help: '',
        validateStatus: 'warning',
      });
    } else {
      this.updateData('code', {
        value,
        help: '',
        validateStatus: 'success',
      });
    }
  }

  private onPasswordInput(value: MasterPassword): void {
    this.updateData('password', {value});
  }

  private onTestPassword(value: MasterPassword): void {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updateData('password', {
        validateStatus: 'error',
        help: 'length 10-30',
      });
    } else {
      this.updateData('password', {validateStatus: 'success'});
    }
  }

  private onSendVerifyEmail(): void {
    const {value, validateStatus} = this.data.email;

    if (validateStatus === 'success') {
      emailVerifyApi(value)
        .then(result => {
          if (result) {
            message.success('email send successfully');
          }
        })
        .catch(error => message.error(error.message));
    }
  }

  private onSave(): void {
    const {email, code, password} = this.data;

    if (
      email.validateStatus === 'success' &&
      code.validateStatus === 'success' &&
      password.validateStatus === 'success'
    ) {
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
    if (label === 'email') {
      this.isChanged = true;
    }

    this.data[label] = {
      ...this.data[label],
      ...value,
    };
  }
}
