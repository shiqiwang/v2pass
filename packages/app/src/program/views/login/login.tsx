/*global chrome*/

import {Button, Col, Form, Input, Row, message} from 'antd';
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

import {getDataApi, loginApi} from '../../request/request';
import {Router, router} from '../../router';

import './login.less';

export interface LoginPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['login']> {}

interface FormData {
  username: string;
  password: string;
}

type FormDataLabelType = keyof FormData;

@observer
class Login extends Component<LoginPageProps> {
  @observable
  private data: FormData = {
    username: '',
    password: '',
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const itemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    const buttonLayout = {
      wrapperCol: {span: 2, offset: 4},
    };
    const {password, username} = this.data;

    return (
      <div className="loginPage">
        <Row type="flex" justify="center" align="middle" className="loginPage">
          <Col span={20}>
            <Form className="loginForm" onSubmit={this.onFormSubmit}>
              <Form.Item label="user name" {...itemLayout}>
                {getFieldDecorator('username', {
                  rules: [
                    {required: true, message: 'Please input your username!'},
                  ],
                  initialValue: username,
                })(
                  <Input
                    type="text"
                    placeholder="user name"
                    onChange={event => this.onInputChange('username', event)}
                  />,
                )}
              </Form.Item>
              <Form.Item label="password" {...itemLayout}>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: 'Please input your password!'},
                  ],
                  initialValue: password,
                })(
                  <Input
                    type="password"
                    placeholder="password"
                    onChange={event => this.onInputChange('password', event)}
                  />,
                )}
              </Form.Item>
              <Form.Item {...buttonLayout}>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {validateFields} = this.props.form!;
    validateFields((error, values) => {
      const {password, username} = values;

      // 只要storage中有username和email，则用unlock页面解锁进入主页面，否则用login页面登录
      // unlockKey应当是输入密码时即刻生成的
      if (!error) {
        loginApi(username, password)
          .then(result => {
            if (result.data.code === 200) {
              // 注册后第一次为登录页面，登录后把username email存储到chrome extension的storage中
              getDataApi(username, password)
                .then(result => {
                  if (result.data) {
                    console.log(result.data);
                    // 把得到的数据存入chrome extension的storage中以备后用
                    router.homepage.$push();
                  }
                })
                .catch(error => {
                  console.error('get data', error);
                });
            } else {
              message.error(result.data.message);
            }
          })
          .catch(error => {
            console.error('login error', error);
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
