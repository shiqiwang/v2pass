import {Button, Drawer, Form, Input, Radio, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import lodash from 'lodash';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import Password, {PasswordItem} from '../../types/password';
import {folderGistArray, targets, vaultGistArray} from '../../util/splitData';

import {DrawerProps} from './types';

interface NewItemProps extends FormComponentProps {
  drawer: DrawerProps;
  password: Password;
}

type FormDataLabelType = keyof Password;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
};
const formButtonLayout = {
  wrapperCol: {span: 18, offset: 6},
};

const {Option} = Select;
const {TextArea} = Input;

@observer
class NewItem extends Component<NewItemProps> {
  @observable
  private data: Password = lodash.cloneDeep(this.props.password);

  render(): ReactNode {
    const {title, visible, onClose} = this.props.drawer;
    const {getFieldDecorator} = this.props.form!;
    const {
      pass_name,
      folderId,
      vaultId,
      targetId,
      items,
      collect,
    } = this.props.password;

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
          <h4>必填选项</h4>
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
                {vaultGistArray.map((vault, index) => (
                  <Option value={vault._id} key={String(index)}>
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
                {folderGistArray.map((folder, index) => (
                  <Option value={folder._id} key={String(index)}>
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
                  <Option value={target._id} key={String(index)}>
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
          <Form.Item {...formButtonLayout}>
            <Button type="primary" htmlType="submit">
              save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
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
    this.data[label] = value;
  }
}

export default Form.create<NewItemProps>({name: 'new_item'})(NewItem);
