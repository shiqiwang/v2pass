/*global chrome*/

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

import {getDataApi, loginApi, loginGetBaseInfo} from '../../request';
import {Router, router} from '../../router';
import {StorageInfo} from '../../types';

import './login.less';

export interface LoginPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['login']> {}

interface FormData {
  username: StorageInfo['username'];
  password: string;
  secretKey: StorageInfo['secretKey'];
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
          <Form.Item label="user name">
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your username!'}],
              initialValue: username,
            })(
              <Input
                type="text"
                placeholder="user name"
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
                placeholder="password"
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
                placeholder="secret key"
                onChange={event => this.onInputChange('secretKey', event)}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
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
        loginGetBaseInfo(username)
          .then(result => {
            const {data} = result;

            if (data.code === 200) {
              const {email, id} = data.message;
              console.log(email, id);
              // email, id, secret key, password
              // 这里后面应当是计算出的unlockKey！！！
              loginApi(username, password)
                .then(result => {
                  if (result.data.code === 200) {
                    // 获取数据
                  } else {
                    message.error(result.data.message);
                  }
                })
                .catch(error => {
                  console.error('login error', error);
                  message.error(error.message);
                });
            } else {
              message.error(data.message);
            }
          })
          .catch(error => {
            console.error('login error', error);
            message.error(error.message);
          });
      }
    });
  };

  private onInputChange(
    label: FormDataLabelType,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
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
