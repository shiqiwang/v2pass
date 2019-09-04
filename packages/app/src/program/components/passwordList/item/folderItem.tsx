import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {FolderProps} from '../types/types';

import InductionContainer from './inductionContainer/inductionContainer';

@observer
class FolderItem extends Component<FolderProps> {
  render(): ReactNode {
    const {activeItem, clickItem, folder} = this.props;
    const {activeFolder, activeVault} = activeItem;
    const {_id, vaultId} = folder;
    const isActive = _id === activeFolder && vaultId === activeVault;

    return (
      <InductionContainer isActive={isActive}>
        <Row
          onClick={() =>
            clickItem({
              activePassword: '',
              activeFolder: folder._id,
              activeVault: folder.vaultId,
            })
          }
        >
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
      </InductionContainer>
    );
  }
}

export default FolderItem;
