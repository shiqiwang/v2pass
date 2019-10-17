import {Icon, Steps} from 'antd';
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
  private stepStatus: IStepStatus = {
    one: 'process',
    two: 'wait',
    three: 'wait',
  };
  @observable
  private factor: Factor = {
    id: '',
    email: '',
    secretKey: '',
    salt: '',
    password: '',
  };

  render(): ReactNode {
    const {one, two, three} = this.stepStatus;

    return (
      <div className="registerPage">
        <Steps>
          <Step status={one} title="base info" icon={<Icon type="user" />} />
          <Step status={two} title="password" icon={<Icon type="solution" />} />
          <Step status={three} title="kit" icon={<Icon type="smile" />} />
        </Steps>
        <div className="mainStep">
          {one === 'process' ? (
            <StepOne forward={email => this.stepOneForward(email)} />
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
            <StepThree backward={() => this.stepThreeBackward()} />
          ) : (
            undefined
          )}
        </div>
      </div>
    );
  }

  private stepOneForward(email: Factor['email']): void {
    this.updateFactor('email', email);
    this.updateStepStatus('one', 'finish');
    this.updateStepStatus('two', 'process');
  }

  private stepTwoForward(password: Factor['password']): void {
    this.updateFactor('password', password);
    this.updateStepStatus('two', 'finish');
    this.updateStepStatus('three', 'process');
  }

  private stepTwoBackward(): void {
    this.updateStepStatus('one', 'process');
    this.updateStepStatus('two', 'wait');
  }

  private stepThreeBackward(): void {
    this.updateStepStatus('two', 'process');
    this.updateStepStatus('three', 'wait');
  }

  @action
  private updateStepStatus<TLabel extends IStepStatusLabel>(
    label: TLabel,
    value: IStepStatus[TLabel],
  ): void {
    this.stepStatus[label] = value;
  }

  @action
  private updateFactor<TLabel extends FactorLabel>(
    label: TLabel,
    value: Factor[TLabel],
  ): void {
    this.factor[label] = value;
  }
}
