/*global chrome*/

import {Button, Col, Form, Input, Row} from 'antd';
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

import './login.less';

export interface LoginPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['login']> {}

interface FormData {
  userName: string;
  password: string;
}

type FormDataLabelType = keyof FormData;

@observer
class Login extends Component<LoginPageProps> {
  @observable
  private data: FormData = {
    userName: '',
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
    const {password, userName} = this.data;

    return (
      <div className="loginPage">
        <Row type="flex" justify="center" align="middle" className="loginPage">
          <Col span={20}>
            <Form className="loginForm" onSubmit={this.onFormSubmit}>
              <Form.Item label="user name" {...itemLayout}>
                {getFieldDecorator('userName', {
                  rules: [
                    {required: true, message: 'Please input your user name!'},
                  ],
                  initialValue: userName,
                })(
                  <Input
                    type="text"
                    placeholder="user name"
                    onChange={event => this.onInputChange('userName', event)}
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
    const {validateFields, setFields} = this.props.form!;
    validateFields((error, values) => {
      const {password, userName} = values;
      // 后面删除
      router.unlock.$push();

      if (!error && userName === 'emi' && password === '123') {
        router.unlock.$push();
        axios
          .post('http://localhost:3000/test', {test: 'test'})
          .then(response => {
            console.log('test response', response);
          })
          .catch(error => {
            console.log('test error', error);
          });
        // eslint-disable-line
        // const bg = chrome.extension.getBackgroundPage();
        // console.log('bg', bg);
        // console.log('bg test', (bg as any).test());
      }

      setFields({
        password: {
          value: '',
          errors: [new Error('user name or password error!')],
        },
        userName: {
          value: '',
          errors: [new Error('user name or password error!')],
        },
      });
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
