import {Button, Col, Form, Input, Row, message} from 'antd';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {emailVerifyApi, testEmailApi} from '../../../request';
import {Email, EmailVerifyCode} from '../../../types';
import {IChangeEmail, IEmailCode} from '../type';

interface OldEmail {
  oldEmail: Email;
}

@observer
export default class ChangeEmail extends Component<OldEmail> {
  @computed
  get value(): string {
    const {oldEmail} = this.props;

    if (this.isChanged) {
      return this.email.value;
    }

    return oldEmail;
  }

  @observable
  private email: IChangeEmail = {
    value: '',
    validateStatus: undefined,
    help: '',
  };
  @observable
  private code: IEmailCode = {
    value: '',
    validateStatus: undefined,
    help: '',
  };
  @observable
  private isChanged: boolean = false;

  render(): ReactNode {
    const {validateStatus, help} = this.email;

    return (
      <div className="changeEmail">
        <Form>
          <Form.Item hasFeedback validateStatus={validateStatus} help={help}>
            <Input
              value={this.value}
              onChange={event => this.onEmailChange(event.target.value)}
              onBlur={event => this.onTestEmail(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            validateStatus={this.code.validateStatus}
            help={this.code.help}
          >
            <Row>
              <Col span={12}>
                <Input
                  value={this.code.value}
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
      this.updateEmail({
        value,
        validateStatus: 'error',
        help: 'wrong format',
      });
    } else {
      this.updateEmail({
        value,
        validateStatus: 'success',
        help: '',
      });
    }
  }

  private onTestEmail(value: Email): void {
    this.updateEmail({validateStatus: 'validating', help: ''});
    testEmailApi(value)
      .then(result => {
        const {code, data} = result;

        if (code) {
          this.updateEmail({validateStatus: 'success', help: ''});
        } else {
          this.updateEmail({validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error));
  }

  private onCodeChange(value: EmailVerifyCode): void {
    const code = Number(value);

    if (isNaN(code)) {
      this.updateEmailCode({
        help: 'verification code just contains number',
        validateStatus: 'error',
      });
    } else if (value === '') {
      this.updateEmailCode({
        value,
        help: '',
        validateStatus: 'warning',
      });
    } else {
      this.updateEmailCode({
        value,
        help: '',
        validateStatus: 'success',
      });
    }
  }

  private onSendVerifyEmail(): void {
    const {value} = this.email;
    emailVerifyApi(value)
      .then(result => {
        if (result) {
          message.success('email send successfully');
        }
      })
      .catch(error => message.error(error));
  }

  private onSave(): void {
    // email更改涉及unlockKey和verify的更改
    // store中存储的数据也应该修改
  }

  @action
  private updateEmail(value: Partial<IChangeEmail>): void {
    this.isChanged = true;
    this.email = {
      ...this.email,
      ...value,
    };
  }

  @action
  private updateEmailCode(value: Partial<IEmailCode>): void {
    this.code = {
      ...this.code,
      ...value,
    };
  }
}
