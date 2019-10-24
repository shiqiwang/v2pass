import {Col, Dropdown, Icon, Menu, Modal, Row} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DELETE, EDIT} from '../../../const/const';
import NewItem from '../../createDrawer/newItem';
import {PasswordProps} from '../types/types';

import InductionContainer from './inductionContainer/inductionContainer';

@observer
class PasswordItem extends Component<PasswordProps> {
  @observable
  private editItemDrawerVisible = false;
  @observable
  private collectStatus = this.props.password.collect;
  @observable
  private showDeleteModal = false;

  render(): ReactNode {
    const menu = (
      <Menu onClick={(value): void => this.onMoreButtonClick(value)}>
        <Menu.Item key={EDIT}>Edit</Menu.Item>
        <Menu.Item key={DELETE}>Delete</Menu.Item>
      </Menu>
    );
    const {clickItem, activeItem, asSearch} = this.props;
    const {activePassword, activeFolder, activeVault} = activeItem;
    const {pass_name, id, folderId, vaultId} = this.props.password;
    const isShow =
      asSearch || (activeFolder === folderId && activeVault === vaultId);
    const isActive =
      activePassword === id &&
      activeFolder === folderId &&
      activeVault === vaultId;

    return (
      <InductionContainer isActive={isActive} isShow={isShow}>
        <NewItem
          drawer={{
            visible: this.editItemDrawerVisible,
            onClose: () => this.onDrawerClose(),
            title: 'Edit Item',
          }}
          password={this.props.password}
        />
        <Modal
          title={DELETE}
          visible={this.showDeleteModal}
          onOk={this.deleteItem}
          onCancel={this.cancelDelete}
        >
          <p>if delete, you will lost the data forever, continue?</p>
        </Modal>
        <Row
          onClick={() =>
            clickItem({
              activeFolder: folderId,
              activePassword: id,
              activeVault: vaultId,
            })
          }
        >
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

  private deleteItem = (): void => {
    console.log('delete item');
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

export default PasswordItem;
