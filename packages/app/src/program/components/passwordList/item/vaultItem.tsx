import {Col, Icon, Row} from 'antd';
import {action, computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ListItemStatus} from '../../../const';
import {ActiveContext} from '../../../store';
import {IStatus, Vault} from '../../../types';

import InductionContainer from './inductionContainer/inductionContainer';

interface VaultProps {
  vault: Vault;
}

@observer
export class VaultItem extends Component<VaultProps> {
  context!: React.ContextType<typeof ActiveContext>;

  @computed
  get isActive(): IStatus {
    return this.context.getVaultStatus(this.props.vault.id);
  }

  render(): ReactNode {
    const {name} = this.props.vault;
    const {status} = this.isActive;
    const vaultUiStatus = status === ListItemStatus.normal;

    return (
      <div className="vaultItem">
        <InductionContainer status={status} isShow>
          <Row onClick={() => this.clickItem()}>
            <Col span={2}>
              <Icon type={vaultUiStatus ? 'menu-fold' : 'menu-unfold'} />
            </Col>
            <Col span={20} className="name">
              {name}
            </Col>
            <Col span={2}>
              <Icon type={vaultUiStatus ? 'right' : 'down'} />
            </Col>
          </Row>
        </InductionContainer>
        {this.props.children}
      </div>
    );
  }

  @action
  private clickItem(): void {
    const {id} = this.props.vault;
    this.context.setActive({
      vault: id,
      folder: '',
      pass: '',
    });
  }

  static contextType = ActiveContext;
}
