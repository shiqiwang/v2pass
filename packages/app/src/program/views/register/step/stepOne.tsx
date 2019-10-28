import {Button, Col, Form, Input, Row, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {emailVerifyApi, testEmailApi, testUsernameApi} from '../../../request';
import {Email, Username} from '../../../types';
import {BaseInfo} from '../types';

import './step.less';

import {buttonLayout, formItemLayout} from './layout';

type BaseInfoLabel = keyof BaseInfo;

interface IStepOneProps {
  forward(username: Username, email: Email, code: number): void;
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
    code: {
      value: '',
      validateStatus: 'warning',
      help: '',
    },
  };

  render(): ReactNode {
    const {username, email, code} = this.data;

    return (
      <div className="registerPageStep">
        <Form
          className="registerPageForm"
          onSubmit={this.onFormSubmit}
          {...formItemLayout}
        >
          <Form.Item
            label="username"
            hasFeedback
            validateStatus={username.validateStatus}
            help={username.help}
          >
            <Input
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
              value={email.value}
              onChange={event => this.onEmailChange(event.target.value)}
              onBlur={event => this.onTestEmail(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="code"
            validateStatus={code.validateStatus}
            help={code.help}
          >
            <Row gutter={10}>
              <Col span={16}>
                <Input
                  value={code.value}
                  onChange={event => this.onCodeChange(event.target.value)}
                />
              </Col>
              <Col span={8}>
                <Button onClick={() => this.onSendVerifyEmail()}>
                  获取验证码
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...buttonLayout}>
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
    const {username, email, code} = this.data;

    if (
      username.validateStatus === 'success' &&
      email.validateStatus === 'success' &&
      code.validateStatus === 'success'
    ) {
      const {username, email} = this.data;
      this.props.forward(username.value, email.value, Number(code.value));
    } else {
      message.error('correct values');
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
          this.updateData('username', {validateStatus: 'success', help: ''});
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

  private onTestEmail(value: Email): void {
    this.updateData('email', {validateStatus: 'validating', help: ''});
    testEmailApi(value)
      .then(result => {
        const {code, data} = result.data;

        if (code) {
          this.updateData('email', {validateStatus: 'success', help: ''});
        } else {
          this.updateData('email', {validateStatus: 'error', help: data});
        }
      })
      .catch(error => message.error(error));
  }

  private onSendVerifyEmail(): void {
    const {value} = this.data.email;
    emailVerifyApi(value)
      .then(result => {
        const {code, data} = result.data;

        if (code) {
          message.success('email send successfully');
        } else {
          message.error(data);
        }
      })
      .catch(error => message.error(error));
  }

  private onCodeChange(value: string): void {
    const code = Number(value);

    if (code) {
      this.updateData('code', {
        value: code,
        help: '',
        validateStatus: 'success',
      });
    } else if (value === '') {
      this.updateData('code', {
        value: '',
        help: '',
        validateStatus: 'warning',
      });
    } else {
      this.updateData('code', {
        help: 'code should be number',
        validateStatus: 'error',
      });
    }
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
