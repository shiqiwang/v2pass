import {Button, Col, Drawer, Form, Input, Row, Select} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import lodash from 'lodash';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, FormEventHandler, ReactNode} from 'react';
import uuid from 'uuid';

import {Target, TargetEntry} from '../../types';

import {DrawerProps} from './types';

interface TargetFormProps extends FormComponentProps {
  target: Target;
  drawer: DrawerProps;
}

type TargetStateValue = TargetEntry['type'];
const typeList: TargetStateValue[] = [
  'website URL',
  'android-app ID',
  'ios-app ID',
];

type TargetStateKey = keyof Target;

@observer
class NewTarget extends Component<TargetFormProps> {
  @observable
  private changedTargetId: string | undefined;

  @observable
  private changedTarget: Partial<Target> | undefined;

  @computed
  get data(): Target {
    let {target} = this.props;

    if (this.changedTargetId !== target.id) {
      return target;
    }

    return {
      ...target,
      ...this.changedTarget,
    };
  }

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {visible, onClose, title} = this.props.drawer;
    const {displayName, entries} = this.data;

    return (
      <Drawer
        width={400}
        visible={visible}
        onClose={onClose}
        title={title ? title : 'New Target'}
        closable={false}
        placement="right"
      >
        <Form onSubmit={this.onFormSubmit} className="newTargetForm">
          <Form.Item label="name">
            {getFieldDecorator('displayName', {
              rules: [
                {
                  required: true,
                  message: 'Please input the target display name!',
                },
              ],
              initialValue: displayName,
            })(
              <Input
                type="text"
                onChange={event =>
                  this.updateData('displayName', event.target.value)
                }
              />,
            )}
          </Form.Item>
          <h4>Entries</h4>
          {entries.map((entry, index) => {
            return (
              <Row className="entry" key={String(index)}>
                <Col span={6}>
                  <Form.Item>
                    {getFieldDecorator(`${entry.id}type`, {
                      rules: [{required: true, message: 'the type is needed!'}],
                      initialValue: entry.type,
                    })(
                      <Select<TargetStateValue>
                        onChange={value =>
                          this.onChangeEntry(entry.id, 'type', value)
                        }
                      >
                        {typeList.map(item => (
                          <Select.Option value={item} key={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={14} offset={1}>
                  <Form.Item>
                    {getFieldDecorator(`${entry.id}value`, {
                      rules: [
                        {
                          required: true,
                          message: 'the entry value is needed!',
                        },
                      ],
                      initialValue: entry.value,
                    })(
                      <Input
                        type="text"
                        placeholder="value"
                        onChange={event =>
                          this.onChangeEntry(
                            entry.id,
                            'value',
                            event.target.value,
                          )
                        }
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={2} offset={1}>
                  <Form.Item>
                    <Button
                      icon="minus"
                      shape="circle"
                      size="small"
                      onClick={event => this.onReduceEntry(entry.id)}
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
              onClick={event => this.onAddEntry()}
            />
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

  // 类似target的entry和password的item是不是也需要添加id呢，不然怎么做区分
  // 这个id能在前端产生吗

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    this.props.form!.validateFields((error, values) => {
      if (!error) {
        console.log('submit', values);
      }
    });
  };

  private onAddEntry(): void {
    // 这个id要怎么生成

    this.updateData('entries', [
      ...this.data.entries,
      {
        id: uuid(),
        type: 'website URL',
        value: '',
      },
    ]);
  }

  private onReduceEntry(id: TargetEntry['id']): void {
    this.updateData(
      'entries',
      this.data.entries.filter(entry => entry.id !== id),
    );
  }

  private onChangeEntry<TKey extends 'type' | 'value'>(
    id: TargetEntry['id'],
    key: TKey,
    value: TargetEntry[TKey],
  ): void {
    this.updateData(
      'entries',
      this.data.entries.map(
        (entry): TargetEntry => {
          if (entry.id === id) {
            return {
              ...entry,
              [key]: value,
            };
          }

          return entry;
        },
      ),
    );
  }

  @action
  private updateData<TLabel extends TargetStateKey>(
    label: TLabel,
    value: Target[TLabel],
  ): void {
    let {target} = this.props;

    if (this.changedTargetId !== target.id) {
      this.changedTargetId = target.id;
      this.changedTarget = {};
    }

    this.changedTarget![label] = value;
  }
}

export default Form.create<TargetFormProps>({name: 'new_target'})(NewTarget);
