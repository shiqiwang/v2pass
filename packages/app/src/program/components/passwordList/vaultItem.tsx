import {Col, Icon, Row} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Vault from '../../../types/vault';

import './index.less';

interface VaultItemProps {
  folded: boolean;
  style: {backgroundColor: string; border: string} | undefined;
  vault: {
    name: Vault['name'];
    _id: Vault['_id'];
  };
  changeVaultStatus(folded: boolean, _id: string): void;
}

@observer
class VaultItem extends Component<VaultItemProps> {
  render(): ReactNode {
    const {name} = this.props.vault;
    const {folded, style} = this.props;

    return (
      <div className="vaultItem" style={style}>
        <Row onClick={this.onFoldedChange}>
          <Col span={2}>
            <Icon type={folded ? 'menu-fold' : 'menu-unfold'} />
          </Col>
          <Col span={20} className="name">
            {name}
          </Col>
          <Col span={2}>
            <Icon type={folded ? 'right' : 'down'} />
          </Col>
        </Row>
      </div>
    );
  }

  private onFoldedChange = (): void => {
    this.props.changeVaultStatus(!this.props.folded, this.props.vault._id);
  };
}

export default VaultItem;
