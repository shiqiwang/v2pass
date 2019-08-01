import {Col, Empty, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface FolderDetailProps {
  folderName: string;
  folderDetail: string;
}

@observer
class FolderDetail extends Component<FolderDetailProps> {
  render(): ReactNode {
    return (
      <div className="folderDetail">
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>
              <h4>{this.props.folderName}</h4>
            </Col>
          </Row>
        </div>
        <div className="operations">
          <Icon type="setting" className="setting" />
          <Icon type="delete" className="delete" />
        </div>
        <div className="detail">
          {this.props.folderDetail || <Empty description="No description" />}
        </div>
      </div>
    );
  }
}

export default FolderDetail;
