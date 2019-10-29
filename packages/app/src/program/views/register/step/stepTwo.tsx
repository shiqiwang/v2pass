import {Button, Form, Input, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {MasterPassword} from '../../../types';
import {PasswordInfo} from '../types';

import './step.less';

import {buttonLayout, formItemLayout} from './layout';

type PasswordInfoLabel = keyof PasswordInfo;

interface IStepTwoProps {
  forward(password: MasterPassword): void;
  backward(): void;
}

@observer
export default class StepTwo extends Component<IStepTwoProps> {
  @observable
  private data: PasswordInfo = {
    password: {
      value: '',
      validateStatus: 'warning',
      help: '',
    },
    repeatPassword: {
      value: '',
      validateStatus: 'warning',
      help: '',
    },
  };

  render(): ReactNode {
    const {password, repeatPassword} = this.data;

    return (
      <div className="registerPageStep">
        <Form
          className="registerPageForm"
          onSubmit={this.onFormSubmit}
          {...formItemLayout}
        >
          <Form.Item
            label="password"
            hasFeedback
            validateStatus={password.validateStatus}
            help={password.help}
          >
            <Input
              type="password"
              value={password.value}
              onChange={event =>
                this.onInputChange('password', event.target.value)
              }
              onBlur={event => this.onTestPassword(event.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="repeat"
            hasFeedback
            validateStatus={repeatPassword.validateStatus}
            help={repeatPassword.help}
          >
            <Input
              type="password"
              value={repeatPassword.value}
              onChange={event =>
                this.onInputChange('repeatPassword', event.target.value)
              }
              onBlur={event => this.onCheckPassword(event.target.value)}
            />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button
              onClick={() => this.props.backward()}
              className="backwardButton"
            >
              Backward
            </Button>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const {password, repeatPassword} = this.data;

    if (
      password.validateStatus === 'success' &&
      repeatPassword.validateStatus === 'success'
    ) {
      this.props.forward(password.value);
    } else {
      message.error('correct values');
    }
  };

  private onInputChange(label: PasswordInfoLabel, value: string): void {
    this.updateData(label, {value});
  }

  private onTestPassword(value: string): void {
    const pattern = /^\S{10,30}$/;

    if (!pattern.test(value)) {
      this.updateData('password', {
        validateStatus: 'error',
        help: 'length 10-30',
      });
    } else {
      this.updateData('password', {validateStatus: 'success'});
    }
  }

  private onCheckPassword(value: string): void {
    if (value === this.data.password.value) {
      this.updateData('repeatPassword', {validateStatus: 'success'});
    } else {
      this.updateData('repeatPassword', {
        validateStatus: 'error',
        help: 'different from the password',
      });
    }
  }

  @action
  private updateData<TLabel extends PasswordInfoLabel>(
    label: TLabel,
    value: Partial<PasswordInfo[TLabel]>,
  ): void {
    this.data[label] = {
      ...this.data[label],
      ...value,
    };
  }
}
