import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

export interface FolderData {
  folderName: string;
  folderId: number;
}

interface FolderItemProps extends FolderData {
  folded: boolean;
  changeFoldedStatus(folded: boolean, folderId: number): void;
}

@observer
class FolderItem extends Component<FolderItemProps> {
  render(): ReactNode {
    const {folderName, folderId, folded} = this.props;

    return (
      <div className="folderItem" data-folder-id={folderId}>
        <Row onClick={this.onFoldedChange}>
          <Col span={2}>
            <Icon type={folded ? 'folder' : 'folder-open'} />
          </Col>
          <Col span={20} className="folderName">
            {folderName}
          </Col>
          <Col span={2}>
            <Icon type={folded ? 'right' : 'down'} />
          </Col>
        </Row>
      </div>
    );
  }

  private onFoldedChange = (): void => {
    this.props.changeFoldedStatus(!this.props.folded, this.props.folderId);
  };

  static defaultProps = {
    folderName: 'New folder',
  };
}

export default FolderItem;
