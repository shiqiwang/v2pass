import {Button, Drawer, Form, Input, Radio} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import {VaultInfo} from '../../types/vault';

import {DrawerProps} from './types';

interface VaultFormProps extends FormComponentProps {
  vault: VaultInfo;
  drawer: DrawerProps;
}

type VaultStateKey = keyof VaultInfo;

@observer
class NewVault extends Component<VaultFormProps> {
  @observable
  private data: VaultInfo = this.props.vault;

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {TextArea} = Input;
    const {name, type, describe} = this.data;
    const {visible, title, onClose} = this.props.drawer;

    return (
      <Drawer
        placement="right"
        visible={visible}
        closable={false}
        width={400}
        title={title ? title : `New Vault`}
        onClose={onClose}
      >
        <Form onSubmit={this.onFormSubmit} className="newVaultForm">
          <Form.Item label="vault name">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'Please input your vault name!',
                },
              ],
              initialValue: name,
            })(
              <Input
                type="text"
                placeholder="vault name"
                onChange={event => this.onDataChange('name', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="type">
            <Radio.Group value={type}>
              <Radio value="private">private</Radio>
              <Radio value="shared" disabled>
                shared
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="describe">
            {getFieldDecorator('describe', {
              initialValue: describe,
            })(
              <TextArea
                placeholder="describe"
                onChange={event => this.onDataChange('describe', event)}
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
    label: VaultStateKey,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  @action
  private updateData<TLabel extends VaultStateKey>(
    label: TLabel,
    value: VaultInfo[TLabel],
  ): void {
    this.data[label] = value;
  }
}

export default Form.create<VaultFormProps>({name: 'new_vault'})(NewVault);
