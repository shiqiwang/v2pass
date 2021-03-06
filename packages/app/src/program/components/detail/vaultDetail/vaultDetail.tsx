import {consume, observer} from '@makeflow/mobx-utils';
import {Col, Empty, Icon, Modal, Row} from 'antd';
import {action, observable} from 'mobx';
import React, {Component, ReactNode} from 'react';

import {Active, ActiveContext, DataContext, DataProcess} from '../../../store';
import {Vault} from '../../../types';
import {NewVault} from '../../createDrawer';

import './vaultDetail.less';

interface VaultProps {
  vault: Vault;
}

@observer
class VaultDetail extends Component<VaultProps> {
  @consume(ActiveContext.Consumer)
  private activeState!: Active;

  @consume(DataContext.Consumer)
  private dataState!: DataProcess;

  @observable
  private drawerVisible = false;
  @observable
  private modalVisible = false;

  render(): ReactNode {
    const {vault} = this.props;

    return (
      <div className="vaultDetail">
        <Modal
          title="Delete Vault"
          visible={this.modalVisible}
          onOk={() => this.deleteVault(vault.id)}
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
          vault={vault}
          key={Math.random()}
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
            onClick={() => this.onDrawerShow()}
          />
          <Icon type="delete" className="delete" onClick={this.showModal} />
        </div>
        <div className="detail">
          {vault.describe || <Empty description="No description" />}
        </div>
      </div>
    );
  }

  private deleteVault = (id: string): void => {
    this.activeState.setActive({
      vault: '',
      folder: '',
      pass: '',
    });
    this.dataState.deleteVault(id);
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

  private onDrawerShow = (): void => {
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
