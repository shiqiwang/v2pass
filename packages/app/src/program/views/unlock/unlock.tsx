import {Button, Form, Icon, Input} from 'antd';
import {FormProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import React, {Component, ReactNode} from 'react';

import './unlock.less';

class UnlockPage extends Component<FormProps> {
  @observable inputPassword: string = '';

  @action changeValue = (event: any): void => {
    this.inputPassword = event.currentTarget.value;
  };

  handleSubmit = (event: any): void => {
    event.preventDefault();
    this.props.form!.validateFields((error, values) => {
      if (!error) {
        // 加密
        console.log('submit', values);
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
              initialValue: this.inputPassword,
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="password"
                onChange={this.changeValue}
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

export default Form.create({name: 'unlock_page'})(UnlockPage);
