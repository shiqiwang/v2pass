import {Col, Empty, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface MoreInfo {
  label: string;
  value: string;
}

interface Password {
  title: string;
  iconType: string;
  note?: string;
  pass: string;
  userName: string;
  target: string[];
  moreInfo?: MoreInfo[];
}

interface PasswordDetailProps {
  password: Password;
}

@observer
class PasswordDetail extends Component<PasswordDetailProps> {
  render(): ReactNode {
    const {
      title,
      note,
      iconType,
      pass,
      userName,
      target,
      moreInfo,
    } = this.props.password;

    return (
      <div className="passwordDetail">
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type={iconType} />
            </Col>
            <Col span={22}>
              <h4>{title}</h4>
            </Col>
          </Row>
        </div>
        {note && <div className="note">{note}</div>}
        <div className="main">
          <div>{userName}</div>
          <div>{pass}</div>
        </div>
        <div className="matchTarget">
          <h4>匹配目标</h4>
          {target.map((item, index) => (
            <div key={String(index)}>{item}</div>
          ))}
        </div>
        <div className="moreInfo">
          {moreInfo &&
            moreInfo.map((item, index) => (
              <div key={String(index)}>
                <h4>{item.label}</h4>
                <div>{item.value}</div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default PasswordDetail;
