import {Col, Empty, Icon, Modal, Row} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import NewFolder from '../public/newFolder';

import './index.less';

interface FolderDetailProps {
  folderName: string;
  folderDetail: string;
  folderId: number;
}

@observer
class FolderDetail extends Component<FolderDetailProps> {
  @observable
  private drawerVisible = false;
  @observable
  private modalVisible = false;

  render(): ReactNode {
    const {folderDetail, folderId, folderName} = this.props;

    return (
      <div className="folderDetail">
        <Modal
          title="Delete Folder"
          visible={this.modalVisible}
          onOk={() => this.deleteFolder(folderId)}
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
        />
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>
              <h4>{folderName}</h4>
            </Col>
          </Row>
        </div>
        <div className="operations">
          <Icon
            type="setting"
            className="setting"
            onClick={() => this.onDrawerShow(folderId)}
          />
          <Icon type="delete" className="delete" onClick={this.showModal} />
        </div>
        <div className="detail">
          {folderDetail || <Empty description="No description" />}
        </div>
      </div>
    );
  }

  private onDrawerClose = (): void => {
    this.updateDrawerVisible(false);
  };

  private onDrawerShow = (folderId: number): void => {
    console.log(folderId);
    this.updateDrawerVisible(true);
  };

  private deleteFolder = (folderId: number): void => {
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
