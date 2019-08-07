import {Button, Drawer, Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import './index.less';

interface NewFolderDrawerOptions {
  visible: boolean;
  onClose(): void;
}

interface NewFolderProps extends FormComponentProps {
  drawer: NewFolderDrawerOptions;
}

@observer
class NewFolder extends Component<NewFolderProps> {
  @observable
  private data = {
    folderName: '',
    note: '',
  };

  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;
    const {getFieldDecorator} = this.props.form!;
    const {TextArea} = Input;

    return (
      <Drawer
        width={400}
        title="New Folder"
        placement="right"
        closable={false}
        onClose={drawerOptions.onClose}
        visible={drawerOptions.visible}
      >
        <Form onSubmit={this.onFormSubmit} className="newFolderForm">
          <Form.Item label="folder name">
            {getFieldDecorator('folderName', {
              rules: [
                {required: true, message: 'Please input your folder name!'},
              ],
              initialValue: this.data.folderName,
            })(
              <Input
                type="text"
                placeholder="folder name"
                onChange={event => this.onDataChange('folderName', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="note">
            {getFieldDecorator('note', {
              initialValue: this.data.note,
            })(
              <TextArea
                placeholder="note"
                onChange={event => this.onDataChange('note', event)}
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

  private onDataChange(
    label: 'folderName' | 'note',
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  @action
  private updateData(label: 'folderName' | 'note', value: string): void {
    this.data[label] = value;
  }
}

export default Form.create<NewFolderProps>({name: 'new_folder'})(NewFolder);
