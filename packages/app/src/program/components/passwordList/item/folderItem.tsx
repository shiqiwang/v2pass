import {Col, Icon, Row} from 'antd';
import {action, computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ListItemStatus} from '../../../const';
import {ActiveContext} from '../../../store';
import {Folder, IStatus} from '../../../types';

import InductionContainer from './inductionContainer/inductionContainer';

interface FolderProps {
  folder: Folder;
}

@observer
export class FolderItem extends Component<FolderProps> {
  context!: React.ContextType<typeof ActiveContext>;

  @computed
  get isActive(): IStatus {
    return this.context.getFolderStatus(this.props.folder.id);
  }

  render(): ReactNode {
    const {folder} = this.props;
    const {vaultId} = folder;
    const active = this.context.getActive();
    const isShow = vaultId === active.vault;
    const {status} = this.isActive;
    const folderUiStatus = status === ListItemStatus.normal;

    return (
      <div className="folderItem">
        <InductionContainer status={status} isShow={isShow}>
          <Row onClick={() => this.clickItem()}>
            <Col span={2}>
              <Icon type={!folderUiStatus ? 'folder-open' : 'folder'} />
            </Col>
            <Col span={20} className="folderName">
              {folder.name}
            </Col>
            <Col span={2}>
              <Icon type={!folderUiStatus ? 'down' : 'right'} />
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
