import {Button, Form, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {createSecretKey} from '../../../auth';
import {MasterPassword, SecretKey} from '../../../types';

export default class ChangeSecretKey extends Component {
  @observable
  private password: MasterPassword = '';
  @observable
  private secretKey: SecretKey = '';

  render(): ReactNode {
    return (
      <div className="changeSecretKey">
        <Form>
          <Form.Item>
            <Input value={this.password} placeholder="check password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.createNewSecretKey()}>
              create secret key
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private createNewSecretKey(): void {}
}
