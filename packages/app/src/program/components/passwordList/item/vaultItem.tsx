import {Col, Icon, Row} from 'antd';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ActiveContext} from '../../../store';
import {Vault} from '../../../types';

import InductionContainer from './inductionContainer/inductionContainer';

interface VaultProps {
  vault: Vault;
}

@observer
export class VaultItem extends Component<VaultProps> {
  context!: React.ContextType<typeof ActiveContext>;

  render(): ReactNode {
    const {name, id} = this.props.vault;
    const active = this.context.getActive();
    const isActive = active.vault === id;

    return (
      <div className="vaultItem">
        <InductionContainer isActive={isActive} isShow>
          <Row onClick={() => this.clickItem()}>
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
