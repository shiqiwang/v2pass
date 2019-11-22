import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Radio,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Folder, Password, PasswordItem, Vault} from '../../types';

import './index.less';

import {DrawerProps, IValidate} from './@types';

interface NewItemProps {
  drawer: DrawerProps;
  password?: Password;
}

type ItemTypeValue = PasswordItem['type'];
const itemType: ItemTypeValue[] = [
  'text',
  'password',
  'username',
  'email',
  'phone',
  'date',
  'note',
];

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};

const {Option} = Select;
const {TextArea} = Input;
const {TreeNode} = TreeSelect;

@observer
export class NewItem extends Component<NewItemProps> {
  @computed
  private get vaults(): Vault[] {
    return this.context.vaults.filter(vault => !!vault.folders.length);
  }

  context!: React.ContextType<typeof DataContext>;

  @observable
  private data: Password = this.props.password || {
    pass_name: '',
    id: uuid(),
    folderId: this.vaults[0].folders[0].id,
    vaultId: this.vaults[0].id,
    collect: false,
    targetId: this.context.targets[0].id,
    items: [],
  };

  @observable
  private titleValidate: IValidate = {
    status: undefined,
    help: '',
  };

  render(): ReactNode {
    const {title, visible, onClose} = this.props.drawer;
    const {pass_name, targetId, items, collect, folderId} = this.data;
    const {targets} = this.context;
    const {status, help} = this.titleValidate;

    return (
      <Drawer
        width={400}
        title={title ? title : 'New Item'}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Form className="newItemForm" layout="horizontal">
          <Form.Item
            label="title"
            {...formItemLayout}
            validateStatus={status}
            help={help}
          >
            <Input
              type="text"
              placeholder="title"
              value={pass_name}
              onChange={event =>
                this.updateData({['pass_name']: event.target.value})
              }
            />
          </Form.Item>
          <Form.Item label="vault-folder" {...formItemLayout}>
            <TreeSelect
              onChange={(value: any) => this.changeFolderId(value)}
              value={folderId}
            >
              {this.vaults.map(vault => (
                <TreeNode
                  value={vault.id}
                  title={vault.name}
                  key={`vault-${vault.name}`}
                  selectable={false}
                >
                  {vault.folders.map(folder => (
                    <TreeNode
                      value={folder.id}
                      title={folder.name}
                      key={`folder-${folder.name}`}
                    />
                  ))}
                </TreeNode>
              ))}
            </TreeSelect>
          </Form.Item>
          <Form.Item label="target" {...formItemLayout}>
            <Select
              defaultValue={targetId}
              onChange={(value: any) =>
                this.updateData({targetId: String(value)})
              }
            >
              {targets.map((target, index) => (
                <Option value={target.id} key={String(index)}>
                  {target.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="collection" {...formItemLayout}>
            <Radio.Group
              defaultValue={collect}
              onChange={event => this.updateData({collect: event.target.value})}
            >
              <Radio value={true}>true</Radio>
              <Radio value={false}>false</Radio>
            </Radio.Group>
          </Form.Item>
          <h4>Filed</h4>
          <div className="filedList">
            {items.map((item, index) => {
              const {id, type, label, value} = item;

              return (
                <Row className="filedItem" key={String(index)}>
                  <Col span={5}>
                    <Select<ItemTypeValue>
                      defaultValue={type}
                      onChange={value => this.updatePassItem(id, {type: value})}
                    >
                      {itemType.map(item => (
                        <Option value={item} key={item} title={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={5} offset={1}>
                    <Input
                      value={label}
                      type="text"
                      placeholder="label"
                      onChange={event =>
                        this.updatePassItem(id, {label: event.target.value})
                      }
                    />
                  </Col>
                  <Col span={9} offset={1}>
                    {type === 'note' ? (
                      <TextArea
                        placeholder="value"
                        value={value}
                        onChange={event =>
                          this.updatePassItem(id, {value: event.target.value})
                        }
                      />
                    ) : (
                      <Input
                        value={value}
                        placeholder="value"
                        type={type === 'password' ? 'password' : 'text'}
                        onChange={event =>
                          this.updatePassItem(id, {value: event.target.value})
                        }
                      />
                    )}
                  </Col>
                  <Col span={2} offset={1}>
                    <Button
                      icon="minus"
                      shape="circle"
                      size="small"
                      onClick={() => this.onReducePassItem(id)}
                    />
                  </Col>
                </Row>
              );
            })}
          </div>
          <Form.Item>
            <Button
              icon="plus"
              shape="circle"
              size="small"
              onClick={() => this.onAddPassItem()}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.onSave()}>
              save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }

  onSave(): void {
    const titleStatus = this.checkTitle();

    if (titleStatus) {
      const data = {
        ...this.data,
        items: this.data.items.filter(item => !!item.value),
      };

      if (this.props.password) {
        this.context.updatePassword(data);
      } else {
        this.context.addPassword(data);
      }
    }
  }

  onAddPassItem(): void {
    this.updateData({
      items: [
        ...this.data.items,
        {
          id: uuid(),
          type: 'text',
          label: '',
          value: '',
        },
      ],
    });
  }

  private checkTitle(): boolean {
    const {id, pass_name} = this.data;

    if (pass_name) {
      const {passwords} = this.context;
      const password = passwords.find(item => {
        return item.pass_name === pass_name && item.id !== id;
      });

      if (password) {
        this.updateValidate({status: 'error', help: 'title is occupied'});
        return false;
      } else {
        this.updateValidate({status: 'success', help: ''});
        return true;
      }
    } else {
      this.updateValidate({status: 'error', help: 'title is Required'});
      return false;
    }
  }

  private onReducePassItem(id: PasswordItem['id']): void {
    this.updateData({items: this.data.items.filter(item => item.id !== id)});
  }

  private changeFolderId(folderId: Folder['id']): void {
    const folder = this.context.folders.find(folder => folder.id === folderId);

    if (folder) {
      this.updateData({folderId, vaultId: folder.vaultId});
    }
  }

  @action
  private updateValidate(value: IValidate): void {
    this.titleValidate = value;
  }

  @action
  private updateData(value: Partial<Password>): void {
    this.data = {
      ...this.data,
      ...value,
    };
  }

  @action
  private updatePassItem(
    id: PasswordItem['id'],
    value: Partial<PasswordItem>,
  ): void {
    this.data.items = this.data.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...value,
        };
      } else {
        return item;
      }
    });
  }

  static contextType = DataContext;
}
