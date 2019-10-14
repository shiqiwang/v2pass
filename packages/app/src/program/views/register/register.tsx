import {Button, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {
  registerApi,
  testEmailApi,
  testUsernameApi,
} from '../../request/request';
import {Router, router} from '../../router';
import {UserInfo} from '../../types/user';

export interface RegisterPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['register']> {}

type ValidateStatus = 'success' | 'warning' | 'validating' | 'error';

interface FormData {
  username: {
    value: UserInfo['username'];
    status: ValidateStatus;
  };
  email: {
    value: UserInfo['email'];
    status: ValidateStatus;
  };
  password: {
    value: string;
    status: ValidateStatus;
  };
  repeatPassword: {
    value: string;
    status: ValidateStatus;
  };
}

type FormDataLabelType = keyof FormData;

const itemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 12},
};
const buttonLayout = {
  wrapperCol: {span: 12, offset: 6},
};

@observer
class Register extends Component<RegisterPageProps> {
  @observable
  private data: FormData = {
    username: {
      value: '',
      status: 'warning',
    },
    email: {
      value: '',
      status: 'warning',
    },
    password: {
      value: '',
      status: 'warning',
    },
    repeatPassword: {
      value: '',
      status: 'warning',
    },
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {username, email, password, repeatPassword} = this.data;

    return (
      <div className="registerPage">
        <Form className="registerPageForm" onSubmit={this.onFormSubmit}>
          <Form.Item
            label="username"
            {...itemLayout}
            hasFeedback
            validateStatus={username.status}
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
            {...itemLayout}
            hasFeedback
            validateStatus={email.status}
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
          <Form.Item
            label="password"
            {...itemLayout}
            hasFeedback
            validateStatus={password.status}
          >
            {getFieldDecorator('password', {
              initialValue: password.value,
            })(
              <Input
                type="password"
                onChange={event => this.onInputChange('password', event)}
                onBlur={event => this.onTestPassword(event.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item
            label="repeat password"
            {...itemLayout}
            hasFeedback
            validateStatus={repeatPassword.status}
          >
            {getFieldDecorator('repeatPassword', {
              initialValue: repeatPassword.value,
            })(
              <Input
                type="password"
                onChange={event => this.onInputChange('repeatPassword', event)}
                onBlur={event => this.onCheckPassword(event.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {username, email, password, repeatPassword} = this.data;

    if (
      username.status === 'success' &&
      email.status === 'success' &&
      password.status === 'success' &&
      repeatPassword.status === 'success'
    ) {
      // 生成verify
      // 提交注册数据 username email verify
    } else {
      message.error('correct error, submit again');
    }
  };

  private onInputChange(
    label: FormDataLabelType,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  private onTestUsername(value: UserInfo['username']): void {
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

  private onTestEmail(value: UserInfo['email']): void {
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

  private onTestPassword(value: string): void {
    this.updateStatus('password', 'validating');
    const pattern = /^\S{10,30}$/;
    const {setFields} = this.props.form!;

    if (!pattern.test(value)) {
      this.updateStatus('password', 'error');
      setFields({
        password: {
          errors: [{message: 'length 10~30, printable character'}],
        },
      });
    } else {
      this.updateStatus('password', 'success');
      setFields({
        password: {
          errors: [{message: ''}],
        },
      });
    }
  }

  private onCheckPassword(value: string): void {
    this.updateStatus('repeatPassword', 'validating');
    const {setFields} = this.props.form!;

    if (value === this.data.password.value) {
      this.updateStatus('repeatPassword', 'success');
      setFields({
        repeatPassword: {
          errors: [{message: ''}],
        },
      });
    } else {
      this.updateStatus('repeatPassword', 'error');
      setFields({
        repeatPassword: {
          errors: [{message: 'different from the password'}],
        },
      });
    }
  }

  @action
  private updateData<TLabel extends FormDataLabelType>(
    label: TLabel,
    value: FormData[TLabel]['value'],
  ): void {
    this.data[label]['value'] = value;
  }

  private updateStatus<TLabel extends FormDataLabelType>(
    label: TLabel,
    value: FormData[TLabel]['status'],
  ): void {
    this.data[label]['status'] = value;
  }
}

export default Form.create<RegisterPageProps>({name: 'register'})(Register);
