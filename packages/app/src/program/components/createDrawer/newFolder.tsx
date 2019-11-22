import {Button, Drawer, Form, Input, Select} from 'antd';
import lodash from 'lodash';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Folder} from '../../types';

import {DrawerProps, IValidate} from './@types';

interface FolderFormProps {
  folder?: Folder;
  drawer: DrawerProps;
}

const {TextArea} = Input;
const {Option} = Select;

@observer
export class NewFolder extends Component<FolderFormProps> {
  @observable
  private data: Folder = lodash.cloneDeep(this.props.folder) || {
    name: '',
    vaultId: this.context.vaults[0].id,
    describe: '',
    passwords: [],
    id: uuid(),
  };

  @observable
  private vaultValidate: IValidate = {
    status: undefined,
    help: '',
  };

  @observable
  private nameValidate: IValidate = {
    status: undefined,
    help: '',
  };

  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {name, describe, vaultId} = this.data;
    const {visible, onClose, title} = this.props.drawer;
    const {vaults} = this.context;

    return (
      <Drawer
        width={400}
        visible={visible}
        onClose={onClose}
        title={title ? title : 'New Folder'}
        closable={false}
        placement="right"
      >
        <Form className="newFolderForm">
          <Form.Item
            label="vault"
            validateStatus={this.vaultValidate.status}
            help={this.vaultValidate.help}
          >
            <Select
              value={vaultId}
              onChange={(value: any) =>
                this.onDataUpdate({vaultId: String(value)})
              }
            >
              {vaults.map((item, index) => (
                <Option value={item.id} key={String(index)}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="folder name"
            validateStatus={this.nameValidate.status}
            help={this.nameValidate.help}
          >
            <Input
              value={name}
              type="text"
              placeholder="folder name"
              onChange={event => this.onDataUpdate({name: event.target.value})}
            />
          </Form.Item>
          <Form.Item label="describe">
            <TextArea
              value={describe}
              placeholder="describe"
              onChange={event =>
                this.onDataUpdate({describe: event.target.value})
              }
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => this.onSave()} type="primary">
              save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    );
  }

  @action
  private onSave(): void {
    const nameStatus = this.onValidateName();

    if (nameStatus) {
      if (this.props.folder) {
        this.context.updateFolder(this.data);
      } else {
        this.context.addFolder(this.data);
      }
    }
  }

  @action
  private updateNameValidate(value: IValidate): void {
    this.nameValidate = value;
  }

  @action
  private onValidateName(): boolean {
    const {folders} = this.context;
    const {id, name} = this.data;

    if (name) {
      const folder = folders.find(item => {
        return item.name === name && item.id !== id;
      });

      if (folder) {
        this.updateNameValidate({status: 'error', help: 'name is occupied'});
        return false;
      } else {
        this.updateNameValidate({status: 'success', help: ''});
        return true;
      }
    } else {
      this.updateNameValidate({status: 'error', help: 'name is required'});
      return false;
    }
  }

  @action
  private onDataUpdate(value: Partial<Folder>): void {
    this.data = {
      ...this.data,
      ...value,
    };
  }

  static contextType = DataContext;
}
