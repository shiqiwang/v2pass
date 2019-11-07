import {Col, Empty, Icon, Modal, Row} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {Folder, VaultInfo} from '../../../types';
import NewFolder from '../../createDrawer/newFolder';

import './folderDetail.less';

interface FolderDetailProps {
  folder: Folder;
  vaultInfoArray: VaultInfo[];
}

@observer
class FolderDetail extends Component<FolderDetailProps> {
  @observable
  private drawerVisible = false;
  @observable
  private modalVisible = false;

  render(): ReactNode {
    const {name, id, describe, vaultId} = this.props.folder;
    const {vaultInfoArray} = this.props;

    return (
      <div className="folderDetail">
        <Modal
          title="Delete Folder"
          visible={this.modalVisible}
          onOk={() => this.deleteFolder(id)}
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
          folder={{id, describe, name, vaultId}}
          vaultInfoArray={vaultInfoArray}
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
            onClick={() => this.onDrawerShow(id)}
          />
          <Icon type="delete" className="delete" onClick={this.showModal} />
        </div>
        <div className="detail">
          {describe || <Empty description="No description" />}
        </div>
      </div>
    );
  }

  private onDrawerClose = (): void => {
    this.updateDrawerVisible(false);
  };

  private onDrawerShow = (folderId: Folder['id']): void => {
    console.log(folderId);
    this.updateDrawerVisible(true);
  };

  private deleteFolder = (folderId: Folder['id']): void => {
    console.log('delete folder', folderId);
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
