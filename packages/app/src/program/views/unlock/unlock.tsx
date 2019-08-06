import {Button, Col, Form, Icon, Input, Row} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {RouteComponentProps} from 'boring-router-react';
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
        <Row type="flex" justify="center" align="middle" className="loginPage">
          <Col span={24}>
            <Form
              onSubmit={this.onFormSubmit}
              className="loginForm"
              layout="inline"
            >
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [
                    {required: true, message: 'Please input your password!'},
                  ],
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
          </Col>
        </Row>
      </div>
    );
  }

  private onInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    this.updatePassword(event.target.value);
  };

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    this.props.form!.validateFields((error, values) => {
      // 假设密码为123
      if (!error && values.password === '123') {
        // 加密
        // 测试
        router.homepage.$push();
      }

      this.props.form!.setFields({
        password: {
          value: '',
          errors: [new Error('password error!')],
        },
      });
    });
  };

  @action
  private updatePassword(password: string): void {
    this.password = password;
  }
}

export default Form.create<UnlockPageProps>({name: 'unlock_page'})(UnlockPage);
