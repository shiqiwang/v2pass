// 如果一个人注册完第一步就退出去了，这种情况应当如何处理？

import {Icon, Steps, message} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {createSecretKey, createVerify} from '../../auth';
import {registerBaseInfoApi, registerValidatorApi} from '../../request';
import {Router, router} from '../../router';

import StepOne from './step/stepOne';
import StepThree from './step/stepThree';
import StepTwo from './step/stepTwo';
import {BaseInfo, Factor, IStepStatus} from './types';

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
  private factor: Factor = {
    id: '',
    username: '',
    email: '',
    secretKey: '',
    salt: '',
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
              forward={(username, email) =>
                this.stepOneForward(username, email)
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
    username: BaseInfo['username']['value'],
    email: Factor['email'],
  ): void {
    registerBaseInfoApi(username, email)
      .then(result => {
        if (result.data.code === 200) {
          this.updateStepStatus({
            one: 'finish',
            two: 'process',
          });
          this.updateFactor({
            email,
            username,
            id: result.data.message,
          });
        } else {
          message.error(result.data.message);
        }
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  private stepTwoForward(password: Factor['password']): void {
    const secretKey = createSecretKey();
    const {username, email, id} = this.factor;
    const verify = createVerify({id, email, secretKey, password});
    registerValidatorApi(verify)
      .then(result => {
        if (result.data.code === 200) {
          chrome.storage.local.set({
            username,
            email,
            id,
            secretKey,
          });
          this.updateFactor({secretKey});
          this.updateStepStatus({
            two: 'finish',
            three: 'process',
          });
        } else {
          message.error(result.data.message);
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
  private updateFactor(value: Partial<Factor>): void {
    this.factor = {
      ...this.factor,
      ...value,
    };
  }
}
