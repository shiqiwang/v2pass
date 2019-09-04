import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Vault from '../../types/vault';

import './passwordList.less';

interface VaultItemProps {
  isActive: boolean;
  style: {backgroundColor: string; border: string} | undefined;
  vault: Vault;
  clickVault(_id: Vault['_id']): void;
}

@observer
class VaultItem extends Component<VaultItemProps> {
  render(): ReactNode {
    const {name, _id} = this.props.vault;
    const {isActive, style, clickVault} = this.props;

    return (
      <div className="vaultItem" style={style}>
        <Row onClick={() => clickVault(_id)}>
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
      </div>
    );
  }
}

export default VaultItem;
