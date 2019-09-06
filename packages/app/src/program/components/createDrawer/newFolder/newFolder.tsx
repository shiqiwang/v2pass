import {Button, Form, Input, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';

import {FolderInfo} from '../../../types/folder';
import {vaultInfoArray} from '../../../util/splitData';

type FolderStateKey = keyof FolderInfo;

interface FolderFormProps extends FormComponentProps {
  folder: FolderInfo;
}

@observer
class NewFolder extends Component<FolderFormProps> {
  @observable
  private data: FolderInfo = this.props.folder;

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {TextArea} = Input;
    const {Option} = Select;
    const {name, describe, vaultId} = this.props.folder;

    return (
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
              {vaultInfoArray.map((item, index) => (
                <Option value={item._id} key={String(index)}>
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
              onChange={event => this.onDataChange('name', event.target.value)}
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
    this.data[label] = value;
  }
}

export default Form.create<FolderFormProps>({name: 'new_folder'})(NewFolder);
