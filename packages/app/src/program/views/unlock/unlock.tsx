import {Button, Form, Icon, Input} from 'antd';
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

import './unlock.less';

export interface UnlockPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['unlock']> {}

@observer
class UnlockPage extends Component<UnlockPageProps> {
  @observable
  private password = '';

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;

    return (
      <div className="loginPage">
        {/* <Link to={router.homepage}>home</Link> */}
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
        // 测试
        if (values.password === '123') {
          router.homepage.$push();
        }
      }
    });
  };

  @action
  private updatePassword(password: string): void {
    this.password = password;
  }
}

export default Form.create<UnlockPageProps>({name: 'unlock_page'})(UnlockPage);
