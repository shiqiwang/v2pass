import {Col, Icon, Row} from 'antd';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface PasswordItemProps {
  name: string;
}

class PasswordItem extends Component<PasswordItemProps> {
  render(): ReactNode {
    return (
      <div className="passwordItem">
        <Row>
          <Col span={2} offset={2}>
            <Icon type="file" />
          </Col>
          <Col span={18} className="name">
            {this.props.name}
          </Col>
          <Col span={2}>
            <Icon className="moreInfo" type="small-dash" />
          </Col>
        </Row>
      </div>
    );
  }

  static defaultProps = {
    name: 'New Item',
  };
}

export default PasswordItem;
