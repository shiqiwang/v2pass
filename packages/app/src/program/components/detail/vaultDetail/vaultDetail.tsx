import {Col, Empty, Icon, Modal, Row} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {Vault} from '../../../types';
import NewVault from '../../createDrawer/newVault';

import './vaultDetail.less';

interface VaultProps {
  vault: Vault;
}

// 目前只有private的vault，暂时不考虑权限问题，好难思考
// 例如：shared文件有些人没有删除和编辑权限等
@observer
class VaultDetail extends Component<VaultProps> {
  @observable
  private drawerVisible = false;
  @observable
  private modalVisible = false;

  render(): ReactNode {
    const {id, name, type, describe} = this.props.vault;

    return (
      <div className="vaultDetail">
        <Modal
          title="Delete Vault"
          visible={this.modalVisible}
          onOk={() => this.deleteVault(id)}
          onCancel={this.cancelDelete}
        >
          <p>you will lost all the data in this vault, continue?</p>
        </Modal>
        <NewVault
          drawer={{
            visible: this.drawerVisible,
            onClose: this.onDrawerClose,
            title: 'Edit Vault',
          }}
          vault={{name, id, type, describe}}
        />
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>{name}</Col>
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

  private deleteVault = (id: string): void => {
    console.log('delete vault', id);
    this.updateModalVisible(false);
  };

  private cancelDelete = (): void => {
    this.updateModalVisible(false);
  };

  private showModal = (): void => {
    this.updateModalVisible(true);
  };

  private onDrawerClose = (): void => {
    this.updateDrawerVisible(false);
  };

  private onDrawerShow = (id: Vault['id']): void => {
    console.log(id);
    this.updateDrawerVisible(true);
  };

  @action
  private updateModalVisible(status: boolean): void {
    this.modalVisible = status;
  }

  @action
  private updateDrawerVisible(status: boolean): void {
    this.drawerVisible = status;
  }
}

export default VaultDetail;
