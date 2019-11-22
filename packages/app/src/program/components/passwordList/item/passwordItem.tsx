import {Col, Dropdown, Icon, Menu, Modal, Row} from 'antd';
import {ClickParam} from 'antd/lib/menu';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DELETE, EDIT} from '../../../const';
import {ActiveContext} from '../../../store';
import {Password} from '../../../types';
import {NewItem} from '../../createDrawer';

import InductionContainer from './inductionContainer/inductionContainer';

interface PasswordProps {
  password: Password;
  asSearch: boolean;
}

@observer
export class PasswordItem extends Component<PasswordProps> {
  @observable
  private editItemDrawerVisible = false;
  @observable
  private collectStatus = this.props.password.collect;
  @observable
  private showDeleteModal = false;

  context!: React.ContextType<typeof ActiveContext>;

  render(): ReactNode {
    const menu = (
      <Menu onClick={(value): void => this.onMoreButtonClick(value)}>
        <Menu.Item key={EDIT}>Edit</Menu.Item>
        <Menu.Item key={DELETE}>Delete</Menu.Item>
      </Menu>
    );
    const {asSearch} = this.props;
    const {pass_name, id, folderId, vaultId} = this.props.password;
    const active = this.context.getActive();
    const isShow =
      asSearch || (active.folder === folderId && active.vault === vaultId);
    const isActive =
      active.pass === id &&
      active.folder === folderId &&
      active.vault === vaultId;

    return (
      <InductionContainer isActive={isActive} isShow={isShow}>
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
          onOk={this.deleteItem}
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
    this.context.setActive({
      folder: folderId,
      vault: vaultId,
      pass: id,
    });
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

  static contextType = ActiveContext;
}
