import {Button, Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import axios from 'axios';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

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
    const {validateFields, setFields} = this.props.form!;
    validateFields((error, values) => {
      if (error) {
        setFields(error);
      } else {
        console.warn('register', values);
      }
    });
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

    if (!value) {
      this.updateStatus('username', 'error');
      setFields({
        username: {
          errors: [{message: 'username required!'}],
        },
      });
    } else if (value.length < 5 || value.length > 30) {
      this.updateStatus('username', 'error');
      setFields({
        username: {
          errors: [{message: "username's length should between 5 and 30"}],
        },
      });
    } else {
      axios
        .get(
          `http://localhost:3000/testUsernameAvailability?username=${encodeURIComponent(
            value,
          )}`,
        )
        .then(result => {
          if ((result as any).data.code === 200) {
            this.updateStatus('username', 'success');
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

  private onTestEmail(value: UserInfo['email']): void {}

  private onCheckPassword(value: string): void {}

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
