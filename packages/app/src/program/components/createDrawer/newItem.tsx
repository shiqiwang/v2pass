import {Button, Col, Drawer, Form, Input, Radio, Row, Select} from 'antd';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Password, PasswordItem} from '../../types';

import {DrawerProps} from './@types';

interface NewItemProps {
  drawer: DrawerProps;
  password: Password;
}

type FormDataLabelType = keyof Password;

type ItemTypeValue = PasswordItem['type'];
const itemType: ItemTypeValue[] = [
  'text',
  'password',
  'userName',
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

@observer
export class NewItem extends Component<NewItemProps> {
  @observable
  private changedItemId: string | undefined;
  @observable
  private changedItemInfo: Partial<Password> | undefined;

  @computed
  get data(): Password {
    let {password} = this.props;

    if (this.changedItemId !== password.id) {
      return password;
    }

    return {
      ...password,
      ...this.changedItemInfo,
    };
  }

  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {title, visible, onClose} = this.props.drawer;
    const {pass_name, folderId, vaultId, targetId, items, collect} = this.data;
    const {vaults, folders, targets} = this.context;

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
          <Form.Item label="title" {...formItemLayout}>
            <Input
              type="text"
              placeholder="title"
              onChange={event =>
                this.onDataChange('pass_name', event.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="vault" {...formItemLayout}>
            <Select
              onChange={value => this.onDataChange('vaultId', String(value))}
            >
              {vaults.map((vault, index) => (
                <Option value={vault.id} key={String(index)}>
                  {vault.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="folder" {...formItemLayout}>
            <Select
              onChange={value => this.onDataChange('folderId', String(value))}
            >
              {folders.map((folder, index) => (
                <Option value={folder.id} key={String(index)}>
                  {folder.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="target" {...formItemLayout}>
            <Select
              onChange={value => this.onDataChange('targetId', String(value))}
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
              onChange={event =>
                this.onDataChange('collect', event.target.value)
              }
            >
              <Radio value={true}>true</Radio>
              <Radio value={false}>false</Radio>
            </Radio.Group>
          </Form.Item>
          {items.map((item, index) => {
            const {id, type, label, value} = item;

            return (
              <Row className="item" key={String(index)}>
                <Col span={5}>
                  <Form.Item>
                    <Select<ItemTypeValue>
                      onChange={value =>
                        this.onChangePassItem(id, 'type', value)
                      }
                    >
                      {itemType.map(item => (
                        <Option value={item} key={item} title={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                  <Form.Item>
                    <Input
                      type="text"
                      placeholder="label"
                      onChange={event =>
                        this.onChangePassItem(id, 'label', event.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={9} offset={1}>
                  <Form.Item>
                    {type === 'note' ? (
                      <TextArea
                        placeholder="value"
                        onChange={event =>
                          this.onChangePassItem(id, 'value', event.target.value)
                        }
                      />
                    ) : (
                      <Input
                        placeholder="value"
                        type={type === 'password' ? 'password' : 'text'}
                        onChange={event =>
                          this.onChangePassItem(id, 'value', event.target.value)
                        }
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={2} offset={1}>
                  <Form.Item>
                    <Button
                      icon="minus"
                      shape="circle"
                      size="small"
                      onClick={event => this.onReducePassItem(id)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            );
          })}
          <Form.Item>
            <Button
              icon="plus"
              shape="circle"
              size="small"
              onClick={event => this.onAddPassItem()}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }

  private onAddPassItem(): void {
    this.updateData('items', [
      ...this.data.items,
      {
        id: uuid(),
        type: 'text',
        label: '',
        value: '',
      },
    ]);
  }

  private onReducePassItem(id: PasswordItem['id']): void {
    this.updateData('items', this.data.items.filter(item => item.id !== id));
  }

  private onChangePassItem<TKey extends 'type' | 'label' | 'value'>(
    id: PasswordItem['id'],
    key: TKey,
    value: PasswordItem[TKey],
  ): void {
    this.updateData(
      'items',
      this.data.items.map(
        (item): PasswordItem => {
          if (item.id === id) {
            return {
              ...item,
              [key]: value,
            };
          }

          return item;
        },
      ),
    );
  }

  private onDataChange(
    label: FormDataLabelType,
    value: string | boolean,
  ): void {
    this.updateData(label, value);
  }

  @action
  private updateData<TLabel extends FormDataLabelType>(
    label: TLabel,
    value: Password[TLabel],
  ): void {
    let {password} = this.props;

    if (this.changedItemId !== password.id) {
      this.changedItemId = password.id;
      this.changedItemInfo = {};
    }

    this.changedItemInfo![label] = value;
  }

  static contextType = DataContext;
}
