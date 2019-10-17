import {Icon, Steps, message} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import StepOne from './step/stepOne';
import StepThree from './step/stepThree';
import StepTwo from './step/stepTwo';
import {Factor, IStepStatus} from './types';

type FactorLabel = keyof Factor;
type IStepStatusLabel = keyof IStepStatus;

const {Step} = Steps;

@observer
export default class Register extends Component {
  @observable
  private stepData: IStepStatus[] = [
    {
      status: 'process',
      title: 'base info',
      icon: 'user',
      step: 'one',
    },
    {
      status: 'wait',
      title: 'password',
      icon: 'user',
      step: 'two',
    },
    {
      status: 'wait',
      title: 'kit',
      icon: 'user',
      step: 'three',
    },
  ];
  @observable
  private factor: Factor = {
    id: '',
    email: '',
    secretKey: '',
    salt: '',
    password: '',
  };

  render(): ReactNode {
    return (
      <div className="registerPage">
        <Steps>
          {this.stepData.map((item, index) => (
            <Step
              key={String(index)}
              status={item.status}
              title={item.title}
              icon={<Icon type={item.icon} />}
            />
          ))}
        </Steps>
        {this.stepData.map((item, index) => {
          return (
            <div key={String(index)}>
              {item.step === 'one' && item.status === 'process' ? (
                <StepOne forward={email => this.stepOneForward(email)} />
              ) : (
                undefined
              )}
              {item.step === 'two' && item.status === 'process' ? (
                <StepTwo
                  forward={password => this.stepTwoForward(password)}
                  backward={() => this.stepTwoBackward()}
                />
              ) : (
                undefined
              )}
              {item.step === 'three' && item.status === 'process' ? (
                <StepThree />
              ) : (
                undefined
              )}
            </div>
          );
        })}
      </div>
    );
  }

  private stepOneForward(email: Factor['email']): void {
    this.updateFactor('email', email);
    this.updateStepData('one', 'status', 'finish');
    this.updateStepData('two', 'status', 'process');
  }

  private stepTwoForward(password: Factor['password']): void {
    this.updateFactor('password', password);
    this.updateStepData('two', 'status', 'finish');
    this.updateStepData('three', 'status', 'process');
  }

  private stepTwoBackward(): void {}

  @action
  private updateStepData<TLabel extends IStepStatusLabel>(
    step: IStepStatus['step'],
    label: TLabel,
    value: IStepStatus[TLabel],
  ): void {
    const theOne = this.stepData.findIndex(item => item.step === step);

    if (theOne !== -1) {
      this.stepData[theOne][label] = value;
    }
  }

  @action
  private updateFactor<TLabel extends FactorLabel>(
    label: TLabel,
    value: Factor[TLabel],
  ): void {
    this.factor[label] = value;
  }
}
