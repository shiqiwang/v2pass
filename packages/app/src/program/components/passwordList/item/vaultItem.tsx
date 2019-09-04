import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import '../passwordList.less';

import FolderLists from '../list/folderLists';
import {VaultProps} from '../types/types';

import InductionContainer from './inductionContainer/inductionContainer';

@observer
class VaultItem extends Component<VaultProps> {
  render(): ReactNode {
    const {name, _id} = this.props.vault;
    const {activeItem, vault, clickItem} = this.props;
    const isActive = activeItem.activeVault === vault._id;

    return (
      <InductionContainer isActive={isActive}>
        <Row
          onClick={() =>
            clickItem({activeFolder: '', activePassword: '', activeVault: _id})
          }
        >
          <Col span={2}>
            <Icon type={isActive ? 'menu-unfold' : 'menu-fold'} />
          </Col>
          <Col span={20} className="name">
            {name}
          </Col>
          <Col span={2}>
            <Icon type={isActive ? 'down' : 'right'} />
          </Col>
        </Row>
        <FolderLists
          folders={vault.folders}
          clickItem={clickItem}
          activeItem={activeItem}
        />
      </InductionContainer>
    );
  }
}

export default VaultItem;
