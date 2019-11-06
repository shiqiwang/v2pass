import {Icon, Steps, message} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {KeyGenerator, createSecretKey} from '../../auth';
import {registerApi, registerBaseInfoApi} from '../../request';
import {Router} from '../../router';
import {
  Email,
  EmailVerifyCode,
  MasterPassword,
  UnlockKeyVerifyFactor,
  Username,
} from '../../types';

import StepOne from './step/stepOne';
import StepThree from './step/stepThree';
import StepTwo from './step/stepTwo';
import {IStepStatus} from './types';

interface RegisterProps extends RouteComponentProps<Router['register']> {}

const {Step} = Steps;

@observer
export default class Register extends Component<RegisterProps> {
  @observable
  private stepStatus: IStepStatus = {
    one: 'process',
    two: 'wait',
    three: 'wait',
  };
  @observable
  private factor: UnlockKeyVerifyFactor = {
    id: '',
    email: '',
    secretKey: '',
    password: '',
  };

  render(): ReactNode {
    const {one, two, three} = this.stepStatus;
    const {secretKey} = this.factor;

    return (
      <div className="registerPage">
        <Steps>
          <Step status={one} title="base info" icon={<Icon type="user" />} />
          <Step status={two} title="password" icon={<Icon type="solution" />} />
          <Step status={three} title="kit" icon={<Icon type="smile" />} />
        </Steps>
        <div className="mainStep">
          {one === 'process' ? (
            <StepOne
              forward={(username, email, code) =>
                this.stepOneForward(username, email, code)
              }
            />
          ) : (
            undefined
          )}
          {two === 'process' ? (
            <StepTwo
              forward={password => this.stepTwoForward(password)}
              backward={() => this.stepTwoBackward()}
            />
          ) : (
            undefined
          )}
          {three === 'process' ? (
            <StepThree
              secretKey={secretKey}
              backward={() => this.stepThreeBackward()}
            />
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }

  private stepOneForward(
    username: Username,
    email: Email,
    code: EmailVerifyCode,
  ): void {
    registerBaseInfoApi(username, email, code)
      .then(result => {
        if (result) {
          this.updateStepStatus({
            one: 'finish',
            two: 'process',
          });
          this.updateFactor({
            email,
            id: result.id,
          });
        }
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  private stepTwoForward(password: MasterPassword): void {
    const secretKey = createSecretKey();
    const {email, id} = this.factor;
    const keyGenerator = new KeyGenerator({id, email, secretKey, password});
    const verify = keyGenerator.createVerify();
    const cipherData = keyGenerator.encryptData(undefined);
    registerApi(id, verify, cipherData)
      .then(result => {
        if (result) {
          this.updateFactor({secretKey});
          // 注册成功，自动下载secretKey
          // session会因为调用api而刷新吗，5分钟
          this.updateStepStatus({
            two: 'finish',
            three: 'process',
          });
        }
      })
      .catch(error => {
        console.error('register validator api', error);
      });
  }

  private stepTwoBackward(): void {
    this.updateStepStatus({
      one: 'process',
      two: 'wait',
    });
  }

  private stepThreeBackward(): void {
    this.updateStepStatus({
      two: 'process',
      three: 'wait',
    });
  }

  @action
  private updateStepStatus(value: Partial<IStepStatus>): void {
    this.stepStatus = {
      ...this.stepStatus,
      ...value,
    };
  }

  @action
  private updateFactor(value: Partial<UnlockKeyVerifyFactor>): void {
    this.factor = {
      ...this.factor,
      ...value,
    };
  }
}
