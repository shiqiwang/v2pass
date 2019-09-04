import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Folder from '../../types/folder';

import './passwordList.less';

interface FolderItemProps {
  folder: Folder;
  isActive: boolean;
  style: {backgroundColor: string; border: string} | undefined;
  clickFolder(folderId: Folder['_id'], vaultId: Folder['vaultId']): void;
}

@observer
class FolderItem extends Component<FolderItemProps> {
  render(): ReactNode {
    const {isActive, style, clickFolder, folder} = this.props;

    return (
      <div className="folderItem" style={style}>
        <Row onClick={() => clickFolder(folder._id, folder.vaultId)}>
          <Col span={2}>
            <Icon type={isActive ? 'folder-open' : 'folder'} />
          </Col>
          <Col span={20} className="folderName">
            {folder.name}
          </Col>
          <Col span={2}>
            <Icon type={isActive ? 'down' : 'right'} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FolderItem;
