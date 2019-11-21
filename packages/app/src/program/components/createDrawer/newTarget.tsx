import {Button, Col, Drawer, Form, Input, Row, Select} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';
import uuid from 'uuid';

import {DataContext} from '../../store';
import {Target, TargetEntry} from '../../types';

import {DrawerProps, IValidate} from './@types';

interface TargetFormProps {
  target?: Target;
  drawer: DrawerProps;
}

type TargetStateValue = TargetEntry['type'];
const typeList: TargetStateValue[] = [
  'website URL',
  'android-app ID',
  'ios-app ID',
];

@observer
export class NewTarget extends Component<TargetFormProps> {
  @observable data: Target = this.props.target || {
    displayName: '',
    entries: [
      {
        id: uuid(),
        type: 'website URL',
        value: '',
      },
    ],
    id: uuid(),
  };

  @observable nameValidate: IValidate = {
    status: undefined,
    help: '',
  };

  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {visible, onClose, title} = this.props.drawer;
    const {displayName, entries} = this.data;
    const {status, help} = this.nameValidate;

    return (
      <Drawer
        width={400}
        visible={visible}
        onClose={onClose}
        title={title ? title : 'New Target'}
        closable={false}
        placement="right"
      >
        <Form className="newTargetForm">
          <Form.Item label="name" validateStatus={status} help={help}>
            <Input
              value={displayName}
              type="text"
              onChange={event => this.updateTargetName(event.target.value)}
            />
          </Form.Item>
          <h4>Entries</h4>
          {entries.map((entry, index) => {
            return (
              <Row className="entry" key={String(index)}>
                <Col span={6}>
                  <Form.Item>
                    <Select<TargetStateValue>
                      onChange={value =>
                        this.onChangeEntry(entry.id, {type: value})
                      }
                      defaultValue="website URL"
                    >
                      {typeList.map(item => (
                        <Select.Option value={item} key={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={14} offset={1}>
                  <Form.Item>
                    <Input
                      type="text"
                      placeholder="value"
                      onChange={event =>
                        this.onChangeEntry(entry.id, {
                          value: event.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={2} offset={1}>
                  <Form.Item>
                    <Button
                      icon="minus"
                      shape="circle"
                      size="small"
                      onClick={() => this.onReduceEntry(entry.id)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            );
          })}
          <Form.Item>
            <Button
              shape="circle"
              icon="plus"
              size="small"
              onClick={() => this.onAddEntry()}
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

  private onSave(): void {
    const {displayName, entries} = this.data;
    const nameStatus = this.checkName(displayName);

    if (nameStatus) {
      const data = {
        ...this.data,
        entries: entries.filter(entry => !!entry.value),
      };

      if (this.props.target) {
        this.context.updateTarget(data);
      } else {
        this.context.addTarget(data);
      }
    }
  }

  private onAddEntry(): void {
    this.updateTargetEntry([
      ...this.data.entries,
      {
        id: uuid(),
        type: 'website URL',
        value: '',
      },
    ]);
  }

  private onReduceEntry(id: TargetEntry['id']): void {
    this.updateTargetEntry(this.data.entries.filter(entry => entry.id !== id));
  }

  private onChangeEntry(
    id: TargetEntry['id'],
    value: Partial<TargetEntry>,
  ): void {
    this.updateTargetEntry(
      this.data.entries.map(
        (entry): TargetEntry => {
          if (entry.id === id) {
            return {
              ...entry,
              ...value,
            };
          }

          return entry;
        },
      ),
    );
  }

  private checkName(value: Target['displayName']): boolean {
    if (value) {
      if (
        this.context.targets.findIndex(item => item.displayName === value) >= 0
      ) {
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
  private updateTargetEntry(value: TargetEntry[]): void {
    this.data.entries = value;
  }

  @action
  private updateTargetName(value: Target['displayName']): void {
    this.data.displayName = value;
  }

  @action
  private updateNameValidate(value: IValidate): void {
    this.nameValidate = value;
  }

  static contextType = DataContext;
}
