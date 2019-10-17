import {Button, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {testEmailApi, testUsernameApi} from '../../../request/request';
import {BaseInfo} from '../types';

import './step.less';

type BaseInfoLabel = keyof BaseInfo;

interface IStepOneProps extends FormComponentProps {
  forward(email: BaseInfo['email']['value']): void;
}

@observer
class StepOne extends Component<IStepOneProps> {
  @observable
  private data: BaseInfo = {
    username: {
      value: '',
      validateStatus: 'warning',
    },
    email: {
      value: '',
      validateStatus: 'warning',
    },
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {username, email} = this.data;

    return (
      <div className="registerPageStep">
        <Form className="registerPageForm" onSubmit={this.onFormSubmit}>
          <Form.Item
            label="username"
            hasFeedback
            validateStatus={username.validateStatus}
          >
            {getFieldDecorator('username', {
              initialValue: username.value,
            })(
              <Input
                type="text"
                onChange={event => this.onInputChange('username', event)}
                onBlur={event => this.onTestUsername(event.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item
            label="email"
            hasFeedback
            validateStatus={email.validateStatus}
          >
            {getFieldDecorator('email', {
              initialValue: email.value,
            })(
              <Input
                type="text"
                onChange={event => this.onInputChange('email', event)}
                onBlur={event => this.onTestEmail(event.target.value)}
              />,
            )}
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
      // 提交注册数据 username email
      // 服务器返回id
      // 验证email是该用户的email
      // 把数据传出至上层组件
      // 转步骤2
      this.props.forward(this.data.email.value);
    } else {
      message.error('correct error, submit again');
    }
  };

  private onInputChange(
    label: BaseInfoLabel,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  private onTestUsername(value: BaseInfo['username']['value']): void {
    this.updateStatus('username', 'validating');
    const {setFields} = this.props.form!;
    // 怎么限定不能以数字开头？？？
    const pattern = /^\w{5,30}$/;

    if (!pattern.test(value)) {
      this.updateStatus('username', 'error');
      setFields({
        username: {
          errors: [{message: 'length 5~30, contain a-z A-Z _'}],
        },
      });
    } else {
      testUsernameApi(value)
        .then(result => {
          if (result.data.code === 200) {
            this.updateStatus('username', 'success');
            setFields({
              username: {
                errors: [{message: ''}],
              },
            });
          } else {
            this.updateStatus('username', 'error');
            setFields({
              username: {
                errors: [{message: 'username exist, use another one'}],
              },
            });
          }
        })
        .catch(error => {
          console.error('test username', error);
        });
    }
  }

  private onTestEmail(value: BaseInfo['email']['value']): void {
    this.updateStatus('email', 'validating');
    const {setFields} = this.props.form!;
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

    if (!pattern.test(value)) {
      this.updateStatus('email', 'error');
      setFields({
        email: {
          errors: [{message: 'input valid email address'}],
        },
      });
    } else {
      testEmailApi(value)
        .then(result => {
          if (result.data.code === 200) {
            this.updateStatus('email', 'success');
            setFields({
              email: {
                errors: [{message: ''}],
              },
            });
          } else {
            this.updateStatus('email', 'error');
            setFields({
              email: {
                errors: [{message: 'email exist, use another one'}],
              },
            });
          }
        })
        .catch(error => {
          console.error('test email', error);
        });
    }
  }

  @action
  private updateData<TLabel extends BaseInfoLabel>(
    label: TLabel,
    value: BaseInfo[TLabel]['value'],
  ): void {
    this.data[label]['value'] = value;
  }

  private updateStatus<TLabel extends BaseInfoLabel>(
    label: TLabel,
    value: BaseInfo[TLabel]['validateStatus'],
  ): void {
    this.data[label]['validateStatus'] = value;
  }
}

export default Form.create<IStepOneProps>({name: 'step_one'})(StepOne);
