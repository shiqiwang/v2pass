import {Button, Form, Icon, Input} from 'antd';
import {FormProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import React, {
  ChangeEventHandler,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import './unlock.less';

class UnlockPage extends Component<FormProps> {
  @observable password: string = '';

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;

    return (
      <div className="loginPage">
        <Form
          onSubmit={this.onFormSubmit}
          className="loginForm"
          layout="inline"
        >
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input your password!'}],
              initialValue: this.password,
            })(
              <Input
                prefix={<Icon type="lock" />}
                type="password"
                placeholder="password"
                onChange={this.onInputChange}
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

  private onInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    this.updatePassword(event.target.value);
  };

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    this.props.form!.validateFields((error, values) => {
      if (!error) {
        // 加密
        console.log('submit', values);
      }
    });
  };

  @action
  private updatePassword(password: string): void {
    this.password = password;
  }
}

export default Form.create({name: 'unlock_page'})(UnlockPage);
