import {Button, Form, Icon, Input} from 'antd';
import {FormProps} from 'antd/lib/form';
import React, {Component, ReactNode} from 'react';

import './login.less';

class LoginPage extends Component<FormProps> {
  handleSubmit = (event: any): void => {
    event.preventDefault();
    this.props.form!.validateFields((error, values) => {
      if (!error) {
        console.log(values);
      }
    });
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;

    return (
      <div className="loginPage">
        <Form
          onSubmit={this.handleSubmit}
          className="loginForm"
          layout="inline"
        >
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your password!'}],
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Unlock
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({name: 'login_page'})(LoginPage);
