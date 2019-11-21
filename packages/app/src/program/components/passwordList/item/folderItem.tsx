import {Col, Icon, Row} from 'antd';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ActiveContext} from '../../../store';
import {Folder} from '../../../types';

import InductionContainer from './inductionContainer/inductionContainer';

interface FolderProps {
  folder: Folder;
}

@observer
export class FolderItem extends Component<FolderProps> {
  context!: React.ContextType<typeof ActiveContext>;

  render(): ReactNode {
    const {folder} = this.props;
    const {id, vaultId} = folder;
    const active = this.context.getActive();
    const isShow = vaultId === active.vault;
    const isActive = id === active.folder && isShow;

    return (
      <div className="folderItem">
        <InductionContainer isActive={isActive} isShow={isShow}>
          <Row onClick={() => this.clickItem()}>
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
        {this.props.children}
      </div>
    );
  }

  @action
  private clickItem(): void {
    const {id, vaultId} = this.props.folder;
    this.context.setActive({
      folder: id,
      vault: vaultId,
      pass: '',
    });
  }

  static contextType = ActiveContext;
}
