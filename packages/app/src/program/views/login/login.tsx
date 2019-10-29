import {Button, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {Link, RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {createUnlockKey} from '../../auth';
import {getDataApi, loginApi, loginGetBaseInfo} from '../../request';
import {Router, router} from '../../router';
import {MasterPassword, SecretKey, Username} from '../../types';

import './login.less';

export interface LoginPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['login']> {}

interface FormData {
  username: Username;
  password: MasterPassword;
  secretKey: SecretKey;
}

type FormDataLabelType = keyof FormData;

@observer
class Login extends Component<LoginPageProps> {
  @observable
  private data: FormData = {
    username: '',
    password: '',
    secretKey: '',
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {password, username, secretKey} = this.data;

    return (
      <div className="loginPage">
        <Form className="loginForm" onSubmit={this.onFormSubmit}>
          <Form.Item label="username">
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your username!'}],
              initialValue: username,
            })(
              <Input
                type="text"
                onChange={event => this.onInputChange('username', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="password">
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your password!'}],
              initialValue: password,
            })(
              <Input
                type="password"
                onChange={event => this.onInputChange('password', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="secretKey">
            {getFieldDecorator('secretKey', {
              rules: [
                {required: true, message: 'Please input your secret key!'},
              ],
              initialValue: secretKey,
            })(
              <Input
                type="input"
                onChange={event => this.onInputChange('secretKey', event)}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginButton">
              Login
            </Button>
            <Link to={router.register}>Register</Link>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {validateFields} = this.props.form!;
    validateFields((error, values) => {
      const {password, username, secretKey} = values;

      if (!error) {
        this.login(username, password, secretKey).catch(error =>
          message.error(error),
        );
      }
    });
  };

  private onInputChange(
    label: FormDataLabelType,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  private async login(
    username: Username,
    password: MasterPassword,
    secretKey: SecretKey,
  ): Promise<void> {
    const baseInfo = await loginGetBaseInfo(username);

    if (baseInfo) {
      const {id, email} = baseInfo;
      const unlockKey = createUnlockKey({id, email, secretKey, password});
      const loginResult = await loginApi(id, unlockKey);

      if (loginResult) {
        const data = await getDataApi(id, unlockKey);

        if (data) {
          chrome.storage.local.set({username, email, id, secretKey, data});
          router.homepage.$push();
        }
      }
    }
  }

  @action
  private updateData<TLabel extends FormDataLabelType>(
    label: TLabel,
    value: FormData[TLabel],
  ): void {
    this.data[label] = value;
  }
}

export default Form.create<LoginPageProps>({name: 'login'})(Login);
