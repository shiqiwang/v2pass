import {Button, Drawer, Form, Input, Radio} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Vault} from '../../types';

import {DrawerProps, IValidate} from './types';

interface VaultFormProps {
  vault?: Vault;
  drawer: DrawerProps;
}

type VaultStateKey = keyof Vault;

@observer
export default class NewVault extends Component<VaultFormProps> {
  @observable
  private data: Vault = {
    name: '',
    type: 'private',
    describe: '',
    id: uuid(),
    folders: [],
  };

  @observable
  private nameValidate: IValidate = {
    status: undefined,
    help: '',
  };
  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {TextArea} = Input;
    const {name, type, describe} = this.data;
    const {visible, title, onClose} = this.props.drawer;
    const {status, help} = this.nameValidate;

    return (
      <Drawer
        placement="right"
        visible={visible}
        closable={false}
        width={400}
        title={title ? title : `New Vault`}
        onClose={onClose}
      >
        <Form className="newVaultForm">
          <Form.Item
            label="vault name"
            hasFeedback
            validateStatus={status}
            help={help}
          >
            <Input
              value={name}
              type="text"
              placeholder="vault name"
              onChange={event => this.onNameChange(event.target.value)}
              onBlur={event => this.onCheckName(event.target.value)}
            />
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
            <TextArea
              value={describe}
              placeholder="describe"
              onChange={event => this.onDescribeChange(event.target.value)}
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

  componentWillMount(): void {
    const {vault} = this.props;

    if (vault) {
      this.data = vault;
    }
  }

  @action
  private onSave(): void {
    const {status} = this.nameValidate;

    if (status === 'success') {
      this.context.addVault({
        ...this.data,
        folders: [],
      });
    }
  }

  @action
  private onDescribeChange(value: Vault['describe']): void {
    this.updateData('describe', value);
  }

  @action
  private onNameChange(value: Vault['name']): void {
    this.updateData('name', value);
  }

  @action
  private onCheckName(value: Vault['name']): void {
    if (value) {
      const {vaults} = this.context;

      if (vaults.findIndex(item => item.name === value) >= 0) {
        this.updateNameValidate({status: 'error', help: 'name occupied'});
      } else {
        this.updateNameValidate({status: 'success', help: ''});
      }
    } else {
      this.updateNameValidate({status: 'error', help: 'name required'});
    }
  }

  @action
  private updateData<Label extends VaultStateKey>(
    label: Label,
    value: Vault[Label],
  ): void {
    this.data[label] = value;
  }

  @action
  private updateNameValidate(value: IValidate): void {
    this.nameValidate = value;
  }

  static contextType = DataContext;
}
