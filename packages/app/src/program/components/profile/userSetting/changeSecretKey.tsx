import {Button, Form, Input, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {
  KeyGenerator,
  createSecretKey,
  decryptData,
  encryptData,
} from '../../../auth';
import {updateVerify} from '../../../request';
import {MasterPassword, SecretKey, UsageData} from '../../../types';
import {IChangeSecretKey} from '../type';

import './index.less';

interface IProps {
  refresh(): void;
}

@observer
export class ChangeSecretKey extends Component<IProps> {
  @observable
  private data: IChangeSecretKey = {
    value: '',
    password: {
      value: '',
      validateStatus: undefined,
      help: '',
    },
  };

  @observable
  private disable: boolean = false;

  render(): ReactNode {
    const {value, validateStatus, help} = this.data.password;

    return (
      <div className="changeSecretKey">
        <Form>
          <Form.Item hasFeedback validateStatus={validateStatus} help={help}>
            <Input
              value={value}
              placeholder="confirm password"
              type="password"
              onChange={event =>
                this.updatePassword({value: event.target.value})
              }
            />
          </Form.Item>
          <div className="newSecretKeyBox">{this.data.value}</div>
          <Form.Item>
            <Button
              type="primary"
              onClick={() => this.createNewSecretKey()}
              disabled={this.disable}
              className="createNewSecretKey"
            >
              create secret key
            </Button>
            <Button type="primary" onClick={() => this.onSave()}>
              save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onTestPassword(value: MasterPassword): boolean {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updatePassword({
        validateStatus: 'error',
        help: 'length 10-30',
      });
      return false;
    } else {
      this.updatePassword({validateStatus: 'success', help: ''});
      return true;
    }
  }

  private createNewSecretKey(): void {
    this.updateSecretKey(createSecretKey());
  }

  private onSave(): void {
    this.updateDisable(true);
    const {password, value} = this.data;
    const passwordTestResult = this.onTestPassword(password.value);

    if (passwordTestResult && value) {
      chrome.storage.local.get(items => {
        const {id, email, secretKey, data} = items;
        const oldKeyGenerator = new KeyGenerator({
          id,
          email,
          secretKey,
          password: password.value,
        });
        const unlockKey = oldKeyGenerator.createUnlockKey();
        const oldDataKey = oldKeyGenerator.createDataKey();
        const plainData = decryptData(oldDataKey, data) as UsageData;
        const newKeyGenerator = new KeyGenerator({
          id,
          email,
          password: password.value,
          secretKey: value,
        });
        const newVerify = newKeyGenerator.createVerify();
        const newDataKey = newKeyGenerator.createDataKey();
        const newData = encryptData(newDataKey, plainData);
        updateVerify(unlockKey, newVerify, newData)
          .then(result => {
            if (result) {
              // 如果成功了要下载该secret key让用户保存!!!
              chrome.storage.local.set({secretKey: value, data: newData});
              this.props.refresh();
              message.success('update successfully');
            }
          })
          .catch(error => message.error(error.message))
          .finally(() => this.updateDisable(false))
          .catch();
      });
    } else {
      this.updateDisable(false);
    }
  }

  @action
  private updatePassword(value: Partial<IChangeSecretKey['password']>): void {
    this.data.password = {
      ...this.data.password,
      ...value,
    };
  }

  @action
  private updateSecretKey(value: SecretKey): void {
    this.data.value = value;
  }

  @action
  private updateDisable(value: boolean): void {
    this.disable = value;
  }
}
