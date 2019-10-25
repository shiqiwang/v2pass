import {Button, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {REGISTRATION_NOT_COMPLETED} from '../../../const';
import {
  registerBaseInfoApi,
  testEmailApi,
  testUsernameApi,
} from '../../../request';
import {Email, Username} from '../../../types';
import {BaseInfo, EmailVerify} from '../types';

import './step.less';

type BaseInfoLabel = keyof BaseInfo;

interface IStepOneProps extends FormComponentProps {
  forward(username: Username, email: Email): void;
}

@observer
export default class StepOne extends Component<IStepOneProps> {
  @observable
  private data: BaseInfo = {
    username: {
      value: '',
      validateStatus: 'warning',
      help: '',
    },
    email: {
      value: '',
      validateStatus: 'warning',
      help: '',
    },
  };

  private emailVerify: EmailVerify = {
    email: '',
    code: 0,
    tick: new Date(),
  };

  render(): ReactNode {
    const {username, email} = this.data;

    return (
      <div className="registerPageStep">
        <Form className="registerPageForm" onSubmit={this.onFormSubmit}>
          <Form.Item
            label="username"
            hasFeedback
            validateStatus={username.validateStatus}
            help={username.help}
          >
            <Input
              type="text"
              value={username.value}
              onChange={event => this.onUsernameChange(event.target.value)}
              onBlur={event => this.onTestUsername(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="email"
            hasFeedback
            validateStatus={email.validateStatus}
            help={email.help}
          >
            <Input
              type="text"
              value={email.value}
              onChange={event => this.onEmailChange(event.target.value)}
              onBlur={event => this.onTestEmail(event.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => this.onSendVerifyEmail()}>邮箱验证</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {username, email} = this.data;

    if (
      username.validateStatus === 'success' &&
      email.validateStatus === 'success'
    ) {
      const {username, email} = this.data;
      this.props.forward(username.value, email.value);
    }
  };

  private onUsernameChange(value: Username): void {
    const pattern = /^\w{5,30}$/;

    if (!pattern.test(value)) {
      this.updateData('username', {
        value,
        validateStatus: 'error',
        help: 'length 5~30, contain a-z A-Z _',
      });
    } else {
      this.updateData('username', {
        value,
        validateStatus: 'success',
        help: '',
      });
    }
  }

  private onTestUsername(value: Username): void {
    this.updateData('username', {validateStatus: 'validating', help: ''});
    testUsernameApi(value)
      .then(result => {
        const {code, data} = result.data;

        if (code) {
          if (data === REGISTRATION_NOT_COMPLETED) {
            // 未注册完成的账号
          } else {
            this.updateData('username', {validateStatus: 'success', help: ''});
          }
        } else {
          this.updateData('username', {validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error));
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

  private onSendVerifyEmail(): void {
    // 把用户邮箱发送至node，node发送邮件
  }

  private onTestEmail(value: Email): void {
    this.updateData('email', {validateStatus: 'validating', help: ''});
    testEmailApi(value)
      .then(result => {
        const {code, data} = result.data;

        if (code) {
          if (data === REGISTRATION_NOT_COMPLETED) {
            // 未注册完成的账号
          } else {
            this.updateData('email', {validateStatus: 'success', help: ''});
          }
        } else {
          this.updateData('email', {validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error));
  }

  @action
  private updateData<TLabel extends BaseInfoLabel>(
    label: TLabel,
    value: Partial<BaseInfo[TLabel]>,
  ): void {
    this.data[label] = {
      ...this.data[label],
      ...value,
    };
  }
}
