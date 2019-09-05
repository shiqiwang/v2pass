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

import Vault from '../../../types/vault';

import './newVault.less';

interface NewVaultDrawerOptions {
  visible: boolean;
  title?: string;
  onClose(): void;
}

interface NewVaultProps extends FormComponentProps {
  drawer: NewVaultDrawerOptions;
  vault?: Vault;
}

interface NewVaultState {
  name: Vault['name'];
  type: Vault['type'];
  describe: Vault['describe'];
}

type NewVaultStateKey = keyof NewVaultState;

@observer
class NewVault extends Component<NewVaultProps> {
  @observable
  private data: NewVaultState = {
    name: '',
    type: 'private',
    describe: '',
  };

  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;
    const {getFieldDecorator} = this.props.form!;
    const {TextArea} = Input;
    const {onClose, visible, title} = drawerOptions;

    return (
      <Drawer
        width={400}
        title={title ? title : 'New Vault'}
        placement="right"
        onClose={onClose}
        visible={visible}
        closable={false}
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
              initialValue: this.data.name,
            })(
              <Input
                type="text"
                placeholder="vault name"
                onChange={event => this.onDataChange('name', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="type">
            <Radio.Group value={this.data.type}>
              <Radio value="private">private</Radio>
              <Radio value="shared" disabled>
                shared
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="describe">
            {getFieldDecorator('describe', {
              initialValue: this.data.describe,
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
    label: NewVaultStateKey,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  @action
  private updateData<TLabel extends NewVaultStateKey>(
    label: TLabel,
    value: NewVaultState[TLabel],
  ): void {
    this.data[label] = value;
  }
}

export default Form.create<NewVaultProps>({name: 'new_vault'})(NewVault);
