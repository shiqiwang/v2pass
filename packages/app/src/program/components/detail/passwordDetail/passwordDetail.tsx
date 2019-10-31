import {Col, Icon, Row} from 'antd';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {Password, Target} from '../../../types';
import {findTarget} from '../../../util';
import {CopyableContainer} from '../../copyableContainer';

import './passwordDetail.less';

interface PasswordProps {
  password: Password;
  targets: Target[];
}

@observer
class PasswordDetail extends Component<PasswordProps> {
  @computed
  private get target(): Target {
    const {targetId} = this.props.password;
    const target = findTarget(targetId, this.props.targets);
    return target;
  }

  render(): ReactNode {
    const {password} = this.props;

    return (
      <div className="passwordDetail">
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>
              <h4>{password.pass_name}</h4>
            </Col>
          </Row>
          <div className="main">
            <h5>Main Info</h5>
            {password.items.map((item, index) => (
              <CopyableContainer key={String(index)} data={item} />
            ))}
            <h5>Target：{this.target.displayName}</h5>
            {this.target.entries.map((item, index) => (
              <CopyableContainer
                key={String(index)}
                data={{label: item.type, value: item.value}}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordDetail;
