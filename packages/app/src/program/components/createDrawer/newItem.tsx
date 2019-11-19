import {Button, Col, Drawer, Form, Input, Radio, Row, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Password, PasswordItem} from '../../types';

import {DrawerProps} from './types';

interface NewItemProps extends FormComponentProps {
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
// const formButtonLayout = {
//   wrapperCol: {span: 18, offset: 6},
// };

const {Option} = Select;
const {TextArea} = Input;

@observer
class NewItem extends Component<NewItemProps> {
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
    const {getFieldDecorator} = this.props.form!;
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
        <Form
          onSubmit={this.onFormSubmit}
          className="newItemForm"
          layout="horizontal"
        >
          <Form.Item label="title" {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [
                {required: true, message: 'Please input password item title!'},
              ],
              initialValue: pass_name,
            })(
              <Input
                type="text"
                placeholder="title"
                onChange={event =>
                  this.onDataChange('pass_name', event.target.value)
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="vault" {...formItemLayout}>
            {getFieldDecorator('vault', {
              rules: [{required: true, message: 'Please select the vault!'}],
              initialValue: vaultId,
            })(
              <Select
                onChange={value => this.onDataChange('vaultId', String(value))}
              >
                {vaults.map((vault, index) => (
                  <Option value={vault.id} key={String(index)}>
                    {vault.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="folder" {...formItemLayout}>
            {getFieldDecorator('folder', {
              rules: [{required: true, message: 'Please select the folder!'}],
              initialValue: folderId,
            })(
              <Select
                onChange={value => this.onDataChange('folderId', String(value))}
              >
                {folders.map((folder, index) => (
                  <Option value={folder.id} key={String(index)}>
                    {folder.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="target" {...formItemLayout}>
            {getFieldDecorator('target', {
              rules: [{required: true, message: 'Please select the target!'}],
              initialValue: targetId,
            })(
              <Select
                onChange={value => this.onDataChange('targetId', String(value))}
              >
                {targets.map((target, index) => (
                  <Option value={target.id} key={String(index)}>
                    {target.displayName}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="collection" {...formItemLayout}>
            {getFieldDecorator('collect', {
              rules: [{required: true}],
              initialValue: collect,
            })(
              <Radio.Group
                onChange={event =>
                  this.onDataChange('collect', event.target.value)
                }
              >
                <Radio value={true}>true</Radio>
                <Radio value={false}>false</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {items.map((item, index) => {
            const {id, type, label, value} = item;

            return (
              <Row className="item" key={String(index)}>
                <Col span={5}>
                  <Form.Item>
                    {getFieldDecorator(`${id}type`, {
                      rules: [{required: true, message: 'type is needed!'}],
                      initialValue: type,
                    })(
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
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                  <Form.Item>
                    {getFieldDecorator(`${id}label`, {
                      rules: [{required: true, message: 'label is needed!'}],
                      initialValue: label,
                    })(
                      <Input
                        type="text"
                        placeholder="label"
                        onChange={event =>
                          this.onChangePassItem(id, 'label', event.target.value)
                        }
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={9} offset={1}>
                  <Form.Item>
                    {getFieldDecorator(`${id}value`, {
                      rules: [{required: true, message: 'value is needed!'}],
                      initialValue: value,
                    })(
                      type === 'note' ? (
                        <TextArea
                          placeholder="value"
                          onChange={event =>
                            this.onChangePassItem(
                              id,
                              'value',
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <Input
                          placeholder="value"
                          type={type === 'password' ? 'password' : 'text'}
                          onChange={event =>
                            this.onChangePassItem(
                              id,
                              'value',
                              event.target.value,
                            )
                          }
                        />
                      ),
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

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    this.props.form!.validateFields((error, values) => {
      if (!error) {
        console.log('submit', values);
      }
    });
  };

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

export default Form.create<NewItemProps>({name: 'new_item'})(NewItem);
