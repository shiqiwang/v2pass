import {Button, Drawer, Form, Input, Radio} from 'antd';
import lodash from 'lodash';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Vault} from '../../types';

import {DrawerProps, IValidate} from './@types';

interface VaultFormProps {
  vault?: Vault;
  drawer: DrawerProps;
}

type VaultStateKey = keyof Vault;

@observer
export class NewVault extends Component<VaultFormProps> {
  @observable
  private data: Vault = lodash.cloneDeep(this.props.vault) || {
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

  @action
  private onSave(): void {
    const nameStatus = this.onCheckName();

    if (nameStatus) {
      if (this.props.vault) {
        this.context.updateVault(this.data);
      } else {
        this.context.addVault(this.data);
      }
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
  private onCheckName(): boolean {
    const {name, id} = this.data;
    const {vaults} = this.context;

    if (name) {
      const vault = vaults.find(vault => {
        return vault.name === name && vault.id !== id;
      });

      if (vault) {
        this.updateNameValidate({status: 'error', help: 'name occupied'});
        return false;
      } else {
        this.updateNameValidate({status: 'success', help: ''});
        return true;
      }
    } else {
      this.updateNameValidate({status: 'error', help: 'name required'});
      return false;
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
