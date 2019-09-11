import {
  Button,
  Card,
  Col,
  Icon,
  Input,
  InputNumber,
  Rate,
  Row,
  Switch,
} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './generateRandomPassword.less';

import {generatePassword} from './generatePass';
import {Factor} from './types';
type FactorLabel = keyof Factor;

@observer
class GenerateRandomPassword extends Component {
  @observable
  private passwordComplexity = 0;
  @observable
  private password = '';
  @observable
  private factor: Factor = {
    length: 20,
    useNumber: true,
    useSymbol: true,
    useLetter: true,
  };

  render(): ReactNode {
    const {length, useNumber, useSymbol} = this.factor;

    return (
      <div className="generateRandomPassword">
        <Row style={{marginBottom: 10}}>
          <Col span={18}>
            <Input
              value={this.password}
              onChange={event => this.onChangePassword(event.target.value)}
            />
          </Col>
          <Col span={5} offset={1}>
            <Button type="primary">copy</Button>
          </Col>
        </Row>
        <Card style={{width: 300}}>
          <Icon
            className="renew"
            type="sync"
            onClick={() => this.onGeneratePass()}
          />
          <div className="row">
            <span className="label">密码强度</span>
            <Rate disabled value={this.passwordComplexity} />
          </div>
          <div className="row rowSecond">
            <span className="label">密码长度</span>
            <InputNumber
              min={6}
              max={36}
              value={length}
              onChange={(value: number) => this.onChangeFactor('length', value)}
            />
          </div>
          <div className="row">
            <span className="label">使用数字</span>
            <Switch
              checked={useNumber}
              onChange={value => this.onChangeFactor('useNumber', value)}
            />
            <span className="label">使用符号</span>
            <Switch
              checked={useSymbol}
              onChange={value => this.onChangeFactor('useSymbol', value)}
            />
          </div>
        </Card>
      </div>
    );
  }

  componentWillMount(): void {
    this.onGeneratePass();
  }

  @action updatePasswordComplexity(value: number): void {
    this.passwordComplexity = value;
  }

  private onGeneratePass(): void {
    this.updatePassword(generatePassword(this.factor));
    this.onChangePassComplex();
  }

  private onChangeFactor(label: FactorLabel, value: boolean | number): void {
    this.updateFactor(label, value);
  }

  private onChangePassword(value: string): void {
    this.updatePassword(value);
    this.updateFactor('length', value.length);
    this.onChangePassComplex();
  }

  private onChangePassComplex(): void {
    // 后续可能需要优化，需要有概率支撑，防止暴露破解
    let complex: number = 0;
    const {length, useLetter, useNumber, useSymbol} = this.factor;
    const diverse = [useLetter, useNumber, useSymbol].filter(item => !!item)
      .length;

    if (length < 10) {
      complex = 2;
    } else if (length >= 10 && diverse === 1) {
      complex = 3;
    } else if (length >= 10 && diverse === 2) {
      complex = 4;
    } else {
      complex = 5;
    }

    this.updatePasswordComplexity(complex);
  }

  @action
  private updateFactor<Label extends FactorLabel>(
    label: Label,
    value: Factor[Label],
  ): void {
    this.factor[label] = value;
  }

  @action
  private updatePassword(value: string): void {
    this.password = value;
  }
}

export default GenerateRandomPassword;
