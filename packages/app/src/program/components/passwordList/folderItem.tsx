import {Col, Icon, Row} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

export interface FolderItemProps {
  folderName: string;
  folderId: number;
}

@observer
class FolderItem extends Component<FolderItemProps> {
  @observable
  private folded = true;

  render(): ReactNode {
    const {folderName, folderId} = this.props;

    return (
      <div className="folderItem" data-folderId={folderId}>
        <Row onClick={this.onFoldedChange}>
          <Col span={2}>
            <Icon type={this.folded ? 'folder' : 'folder-open'} />
          </Col>
          <Col span={20} className="folderName">
            {folderName}
          </Col>
          <Col span={2}>
            <Icon type={this.folded ? 'right' : 'down'} />
          </Col>
        </Row>
      </div>
    );
  }

  private onFoldedChange = (): void => {
    console.log('click', this.folded);
    this.updateFolded(!this.folded);
  };

  @action
  private updateFolded(value: boolean): void {
    this.folded = value;
  }

  static defaultProps = {
    folderName: 'New folder',
  };
}

export default FolderItem;
