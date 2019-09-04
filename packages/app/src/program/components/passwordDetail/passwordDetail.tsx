import {Col, Empty, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Password from '../../types/password';
import CopyableContainer from '../public/copyableContainer/copyableContainer';

import './passwordDetail.less';

interface PasswordProps {
  password: Password;
}

@observer
class PasswordDetail extends Component<PasswordProps> {
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
            {password.items.map((item, index) => (
              <CopyableContainer key={String(index)} data={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordDetail;
