import {consume, observer} from '@makeflow/mobx-utils';
import {Col, Dropdown, Icon, Menu, Modal, Row} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, computed, observable} from 'mobx';
import React, {Component, ReactNode} from 'react';

import {DELETE, EDIT} from '../../../const';
import {Active, ActiveContext, DataContext, DataProcess} from '../../../store';
import {IStatus, Password} from '../../../types';
import {NewItem} from '../../createDrawer';

import InductionContainer from './inductionContainer/inductionContainer';

interface PasswordProps {
  password: Password;
}

@observer
export class PasswordItem extends Component<PasswordProps> {
  @consume(DataContext.Consumer)
  private dataState!: DataProcess;
  @consume(ActiveContext.Consumer)
  private activeState!: Active;
  @observable
  private editItemDrawerVisible = false;
  @observable
  private collectStatus = this.props.password.collect;
  @observable
  private showDeleteModal = false;

  @computed
  get isActive(): IStatus {
    return this.activeState.getPassStatus(this.props.password.id);
  }

  render(): ReactNode {
    const menu = (
      <Menu onClick={(value): void => this.onMoreButtonClick(value)}>
        <Menu.Item key={EDIT}>Edit</Menu.Item>
        <Menu.Item key={DELETE}>Delete</Menu.Item>
      </Menu>
    );
    const {pass_name, id, folderId, vaultId} = this.props.password;
    const active = this.activeState.getActive();
    const isShow = active.folder === folderId && active.vault === vaultId;
    const {status} = this.isActive;

    return (
      <InductionContainer status={status} isShow={isShow}>
        <NewItem
          drawer={{
            visible: this.editItemDrawerVisible,
            onClose: () => this.onDrawerClose(),
            title: 'Edit Item',
          }}
          password={this.props.password}
          key={Math.random()}
        />
        <Modal
          title={DELETE}
          visible={this.showDeleteModal}
          onOk={() => this.deleteItem(id, folderId, vaultId)}
          onCancel={this.cancelDelete}
        >
          <p>if delete, you will lost the data forever, continue?</p>
        </Modal>
        <Row onClick={() => this.clickItem()}>
          <Col span={2} offset={2}>
            {this.collectStatus ? (
              <Icon
                type="heart"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.onCollectIconClick(false)}
              />
            ) : (
              <Icon
                type="heart"
                onClick={() => this.onCollectIconClick(true)}
              />
            )}
          </Col>
          <Col span={18} className="name">
            {pass_name}
          </Col>
          <Col span={2}>
            <Dropdown overlay={menu}>
              <Icon className="moreInfo" type="more" />
            </Dropdown>
          </Col>
        </Row>
      </InductionContainer>
    );
  }

  private onMoreButtonClick = (value: ClickParam): void => {
    if (value.key === EDIT) {
      this.toggleDrawer(true);
    }

    if (value.key === DELETE) {
      this.updateShowDeleteModal(true);
    }
  };

  private clickItem = (): void => {
    const {id, vaultId, folderId} = this.props.password;
    this.activeState.setActive({
      folder: folderId,
      vault: vaultId,
      pass: id,
    });
  };

  private deleteItem = (
    id: Password['id'],
    folderId: Password['folderId'],
    vaultId: Password['vaultId'],
  ): void => {
    this.activeState.setActive({
      vault: '',
      folder: '',
      pass: '',
    });
    this.dataState.deletePassword(id, folderId, vaultId);
    this.updateShowDeleteModal(false);
  };

  private cancelDelete = (): void => {
    this.updateShowDeleteModal(false);
  };

  private onDrawerClose = (): void => {
    this.toggleDrawer(false);
  };

  private onCollectIconClick = (value: boolean): void => {
    this.updateCollectStatus(value);
  };

  @action
  private toggleDrawer = (value: boolean): void => {
    this.editItemDrawerVisible = value;
  };

  @action
  private updateCollectStatus(status: boolean): void {
    this.collectStatus = status;
  }

  @action
  private updateShowDeleteModal(status: boolean): void {
    this.showDeleteModal = status;
  }

  static defaultProps = {
    name: 'New Item',
    collect: false,
  };
}
