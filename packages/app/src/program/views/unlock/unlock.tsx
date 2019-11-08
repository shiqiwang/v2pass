import {Button, Col, Form, Icon, Input, Row, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {KeyGenerator, decryptData} from '../../auth';
import {loginApi} from '../../request';
import {Router, router} from '../../router';
import {MasterPassword} from '../../types';

import './unlock.less';

export interface UnlockPageProps
  extends FormComponentProps,
    RouteComponentProps<Router['unlock']> {}

@observer
class UnlockPage extends Component<UnlockPageProps> {
  @observable
  private password: MasterPassword = '';

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;

    return (
      <div className="unlockPage">
        <Row type="flex" justify="center" align="middle" className="unlockPage">
          <Col span={24}>
            <Form
              onSubmit={this.onFormSubmit}
              className="unlockForm"
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
                    onChange={event => this.onInputChange(event.target.value)}
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

  private onInputChange(value: MasterPassword): void {
    this.updatePassword(value);
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {validateFields, setFields} = this.props.form!;
    validateFields((error, value) => {
      if (!error) {
        const {password} = value;
        chrome.storage.local.get(items => {
          const {id, secretKey, email, data} = items;
          const keyGenerator = new KeyGenerator({
            id,
            secretKey,
            password,
            email,
          });
          const unlockKey = keyGenerator.createUnlockKey();
          const dataKey = keyGenerator.createDataKey();
          const decrypt = decryptData(dataKey, data);

          if (decrypt) {
            router.homepage.$push();
            loginApi(id, unlockKey)
              .then(result => {
                if (result) {
                  // 隐式登录成功
                  // 做个全局记录？
                }

                // 没有成功的话，那连网/后端的服务就没法提供
                message.warning('server error');
              })
              .catch(error => {
                message.warning(error.message);
              });
          } else {
            message.error('password error');
          }
        });
      } else {
        setFields({
          password: {
            value: '',
            errors: [new Error('password error!')],
          },
        });
      }
    });
  };

  @action
  private updatePassword(password: MasterPassword): void {
    this.password = password;
  }
}

export default Form.create<UnlockPageProps>({name: 'unlock_page'})(UnlockPage);
