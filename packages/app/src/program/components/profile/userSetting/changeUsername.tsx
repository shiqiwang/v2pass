import {Button, Form, Input, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {testUsernameApi, updateUsernameApi} from '../../../request';
import {Username} from '../../../types';
import {IChangeUsername} from '../type';

interface IProps {
  refresh(): void;
}

@observer
export class ChangeUsername extends Component<IProps> {
  @observable
  private username: IChangeUsername = {
    value: '',
    validateStatus: undefined,
    help: '',
  };

  render(): ReactNode {
    const {validateStatus, help, value} = this.username;

    return (
      <div className="changeUsername">
        <Form>
          <Form.Item hasFeedback validateStatus={validateStatus} help={help}>
            <Input
              placeholder="new username"
              value={value}
              onChange={event =>
                this.updateUsername({value: event.target.value})
              }
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.onSave()}>
              save
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onTestUsername = async (value: Username): Promise<boolean> => {
    const pattern = /^\w{5,30}$/;

    if (!pattern.test(value)) {
      this.updateUsername({
        validateStatus: 'error',
        help: 'length 5~30, contain a-z A-Z _',
      });
      return false;
    } else {
      const result = await testUsernameApi(value);
      const {code, data} = result;

      if (code) {
        this.updateUsername({validateStatus: 'success', help: ''});
        return true;
      } else {
        this.updateUsername({validateStatus: 'error', help: data});
        return false;
      }
    }
  };

  private onSave = async (): Promise<void> => {
    const {value} = this.username;
    const testResult = await this.onTestUsername(value);

    if (testResult) {
      updateUsernameApi(value)
        .then(result => {
          if (result) {
            chrome.storage.local.set({username: value});
            this.updateUsername({validateStatus: undefined});
            this.props.refresh();
            message.success('update username successfully');
          }
        })
        .catch(error => message.error(error.message));
    }
  };

  @action
  private updateUsername = (value: Partial<IChangeUsername>): void => {
    this.username = {
      ...this.username,
      ...value,
    };
  };
}
