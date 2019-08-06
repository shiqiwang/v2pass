import {Button, Col, Form, Icon, Input, Row} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {Link, RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEventHandler,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {Router, router} from '../../router';

import './login.less';

export interface LoginPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['login']> {}

@observer
class Login extends Component<LoginPageProps> {
  @observable
  private userName = '';
  @observable
  private password = '';

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const itemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
    };
    const buttonLayout = {
      wrapperCol: {span: 2, offset: 4},
    };

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
                  initialValue: this.userName,
                })(<Input type="text" placeholder="user name" />)}
              </Form.Item>
              <Form.Item label="password" {...itemLayout}>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: 'Please input your password!'},
                  ],
                  initialValue: this.password,
                })(<Input type="password" placeholder="password" />)}
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

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {};
}

export default Form.create<LoginPageProps>({name: 'login'})(Login);
