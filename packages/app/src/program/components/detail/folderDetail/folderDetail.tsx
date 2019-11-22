import {consume, observer} from '@makeflow/mobx-utils';
import {Col, Empty, Icon, Modal, Row} from 'antd';
import {action, observable} from 'mobx';
import React, {Component, ReactNode} from 'react';

import {Active, ActiveContext, DataContext, DataProcess} from '../../../store';
import {Folder} from '../../../types';
import {NewFolder} from '../../createDrawer';

import './folderDetail.less';

interface FolderDetailProps {
  folder: Folder;
}

@observer
class FolderDetail extends Component<FolderDetailProps> {
  @consume(ActiveContext.Consumer)
  private activeState!: Active;

  @consume(DataContext.Consumer)
  private dataState!: DataProcess;

  @observable
  private drawerVisible = false;
  @observable
  private modalVisible = false;

  render(): ReactNode {
    const {folder} = this.props;

    return (
      <div className="folderDetail">
        <Modal
          title="Delete Folder"
          visible={this.modalVisible}
          onOk={() =>
            this.deleteFolder(
              folder.id,
              folder.vaultId,
              this.dataState,
              this.activeState,
            )
          }
          onCancel={this.cancelDelete}
        >
          <p>you will lost all the data in this folder, continue?</p>
        </Modal>
        <NewFolder
          drawer={{
            visible: this.drawerVisible,
            onClose: this.onDrawerClose,
            title: 'Edit Folder',
          }}
          folder={folder}
          key={Math.random()}
        />
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>
              <h4>{name}</h4>
            </Col>
          </Row>
        </div>
        <div className="operations">
          <Icon
            type="setting"
            className="setting"
            onClick={() => this.onDrawerShow()}
          />
          <Icon type="delete" className="delete" onClick={this.showModal} />
        </div>
        <div className="detail">
          {folder.describe || <Empty description="No description" />}
        </div>
      </div>
    );
  }

  private onDrawerClose = (): void => {
    this.updateDrawerVisible(false);
  };

  private onDrawerShow = (): void => {
    this.updateDrawerVisible(true);
  };

  private deleteFolder = (
    id: Folder['id'],
    vaultId: Folder['vaultId'],
    dataState: DataProcess,
    activeState: Active,
  ): void => {
    activeState.setActive({
      vault: '',
      folder: '',
      pass: '',
    });
    dataState.deleteFolder(id, vaultId);
    this.updateModalVisible(false);
  };

  private cancelDelete = (): void => {
    this.updateModalVisible(false);
  };

  private showModal = (): void => {
    this.updateModalVisible(true);
  };

  @action
  private updateDrawerVisible(status: boolean): void {
    this.drawerVisible = status;
  }

  @action
  private updateModalVisible(status: boolean): void {
    this.modalVisible = status;
  }
}

export default FolderDetail;
