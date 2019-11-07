import {Button, Drawer, Form, Input, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {FolderInfo, VaultInfo} from '../../types';

import {DrawerProps} from './types';

type FolderStateKey = keyof FolderInfo;

interface FolderFormProps extends FormComponentProps {
  folder: FolderInfo;
  drawer: DrawerProps;
  vaultInfoArray: VaultInfo[];
}

@observer
class NewFolder extends Component<FolderFormProps> {
  @observable
  private changedFolderId: string | undefined;
  @observable
  private changedFolderInfo: Partial<FolderInfo> | undefined;

  @computed
  get data(): FolderInfo {
    let {folder} = this.props;

    if (!this.changedFolderId || this.changedFolderId !== folder.id) {
      return folder;
    }

    return {
      ...folder,
      ...this.changedFolderInfo,
    };
  }

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {TextArea} = Input;
    const {Option} = Select;
    const {name, describe, vaultId} = this.props.folder;
    const {visible, onClose, title} = this.props.drawer;

    return (
      <Drawer
        width={400}
        visible={visible}
        onClose={onClose}
        title={title ? title : 'New Folder'}
        closable={false}
        placement="right"
      >
        <Form onSubmit={this.onFormSubmit} className="newFolderForm">
          <Form.Item label="vault">
            {getFieldDecorator('vaultName', {
              rules: [
                {
                  required: true,
                  message: 'Please select the vault',
                },
              ],
              initialValue: vaultId,
            })(
              <Select
                onChange={value => this.onDataChange('vaultId', String(value))}
              >
                {this.props.vaultInfoArray.map((item, index) => (
                  <Option value={item.id} key={String(index)}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="folder name">
            {getFieldDecorator('folderName', {
              rules: [
                {required: true, message: 'Please input your folder name!'},
              ],
              initialValue: name,
            })(
              <Input
                type="text"
                placeholder="folder name"
                onChange={event =>
                  this.onDataChange('name', event.target.value)
                }
              />,
            )}
          </Form.Item>
          <Form.Item label="describe">
            {getFieldDecorator('describe', {
              initialValue: describe,
            })(
              <TextArea
                placeholder="describe"
                onChange={event =>
                  this.onDataChange('describe', event.target.value)
                }
              />,
            )}
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

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    this.props.form!.validateFields((error, values) => {
      if (!error) {
        console.log('submit', values);
      }
    });
  };

  private onDataChange(label: FolderStateKey, value: string): void {
    this.updateData(label, value);
  }

  @action
  private updateData<TLabel extends FolderStateKey>(
    label: TLabel,
    value: FolderInfo[TLabel],
  ): void {
    let {folder} = this.props;

    if (this.changedFolderId !== folder.id) {
      this.changedFolderId = folder.id;
      this.changedFolderInfo = {};
    }

    this.changedFolderInfo![label] = value;
  }
}

export default Form.create<FolderFormProps>({name: 'new_folder'})(NewFolder);
