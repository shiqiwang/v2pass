import {Button, Form, Input, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {registerApi} from '../../../request/request';
import {PasswordInfo} from '../types';

import './step.less';

type PasswordInfoLabel = keyof PasswordInfo;

interface IStepTwoProps extends FormComponentProps {
  forward(password: PasswordInfo['password']['value']): void;
  backward(): void;
}

@observer
class StepTwo extends Component<IStepTwoProps> {
  @observable
  private data: PasswordInfo = {
    password: {
      value: '',
      validateStatus: 'warning',
    },
    repeatPassword: {
      value: '',
      validateStatus: 'warning',
    },
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {password, repeatPassword} = this.data;

    return (
      <div className="registerPageStep">
        <Form className="registerPageForm" onSubmit={this.onFormSubmit}>
          <Form.Item
            label="password"
            hasFeedback
            validateStatus={password.validateStatus}
          >
            {getFieldDecorator('password', {
              initialValue: password.value,
            })(
              <Input
                type="password"
                onChange={event => this.onInputChange('password', event)}
                onBlur={event => this.onTestPassword(event.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item
            label="repeat password"
            hasFeedback
            validateStatus={repeatPassword.validateStatus}
          >
            {getFieldDecorator('repeatPassword', {
              initialValue: repeatPassword.value,
            })(
              <Input
                type="password"
                onChange={event => this.onInputChange('repeatPassword', event)}
                onBlur={event => this.onCheckPassword(event.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item>
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
      // 生成verify
      // 提交注册数据 verify
      // 转步骤3
      this.props.forward(this.data.password.value);
    } else {
      message.error('correct error, submit again');
    }
  };

  private onInputChange(
    label: PasswordInfoLabel,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  private onTestPassword(value: string): void {
    this.updateStatus('password', 'validating');
    const pattern = /^\S{10,30}$/;
    const {setFields} = this.props.form!;

    if (!pattern.test(value)) {
      this.updateStatus('password', 'error');
      setFields({
        password: {
          errors: [{message: 'length 10~30, printable character'}],
        },
      });
    } else {
      this.updateStatus('password', 'success');
      setFields({
        password: {
          errors: [{message: ''}],
        },
      });
    }
  }

  private onCheckPassword(value: string): void {
    this.updateStatus('repeatPassword', 'validating');
    const {setFields} = this.props.form!;

    if (value === this.data.password.value) {
      this.updateStatus('repeatPassword', 'success');
      setFields({
        repeatPassword: {
          errors: [{message: ''}],
        },
      });
    } else {
      this.updateStatus('repeatPassword', 'error');
      setFields({
        repeatPassword: {
          errors: [{message: 'different from the password'}],
        },
      });
    }
  }

  @action
  private updateData<TLabel extends PasswordInfoLabel>(
    label: TLabel,
    value: PasswordInfo[TLabel]['value'],
  ): void {
    this.data[label]['value'] = value;
  }

  private updateStatus<TLabel extends PasswordInfoLabel>(
    label: TLabel,
    value: PasswordInfo[TLabel]['validateStatus'],
  ): void {
    this.data[label]['validateStatus'] = value;
  }
}

export default Form.create<IStepTwoProps>({name: 'step_two'})(StepTwo);
