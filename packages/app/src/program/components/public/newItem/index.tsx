import {Button, Drawer, Form, Input} from 'antd';
import {FormProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import './index.less';

import AdditionSection, {AdditionalSectionInterface} from './additionalSection';

interface NewItemDrawerOptionsInterface {
  visible: boolean;
  onClose(): void;
}

interface NewItemPropsInterface extends FormProps {
  drawer: NewItemDrawerOptionsInterface;
}

interface FormDataInterface {
  title: string;
  note: string;
  userName: string;
  password: string;
  target: string[];
  additionalSections: AdditionalSectionInterface[];
}

type FormDataLabelType = keyof FormDataInterface;

@observer
class NewItem extends Component<NewItemPropsInterface> {
  @observable
  private data: FormDataInterface = {
    title: '',
    note: '',
    userName: '',
    password: '',
    target: [],
    additionalSections: [
      {
        sectionName: '',
        items: [
          {
            name: '',
            value: '',
            type: '',
          },
        ],
      },
    ],
  };

  @observable
  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;
    const {getFieldDecorator} = this.props.form!;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
    };
    const formButtonLayout = {
      wrapperCol: {span: 18, offset: 6},
    };
    const selt = this;

    return (
      <Drawer
        width={400}
        title="New Item"
        placement="right"
        closable={false}
        onClose={drawerOptions.onClose}
        visible={drawerOptions.visible}
      >
        <Form
          onSubmit={this.onFormSubmit}
          className="newItemForm"
          layout="horizontal"
        >
          <Form.Item label="title" {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{required: true, message: 'Please input title!'}],
              initialValue: this.data.title,
            })(
              <Input
                type="text"
                placeholder="title"
                onChange={event => this.onDataChange('title', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="note" {...formItemLayout}>
            {getFieldDecorator('note', {
              initialValue: this.data.note,
            })(
              <Input.TextArea
                placeholder="note"
                onChange={event => this.onDataChange('note', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="user name" {...formItemLayout}>
            {getFieldDecorator('user name', {
              rules: [{required: true, message: 'Please input user name!'}],
              initialValue: this.data.userName,
            })(
              <Input
                type="text"
                placeholder="user name"
                onChange={event => this.onDataChange('userName', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="password" {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [{required: true, message: 'Please input user password!'}],
              initialValue: this.data.password,
            })(
              <Input
                type="password"
                placeholder="password"
                onChange={event => this.onDataChange('password', event)}
              />,
            )}
          </Form.Item>
          <Form.Item label="target" {...formItemLayout}>
            {getFieldDecorator('target', {
              initialValue: this.data.target,
            })(
              <Input.TextArea
                placeholder="Please input target, use line breaks to separate!"
                onChange={event => this.onDataChange('password', event)}
              />,
            )}
          </Form.Item>
          {this.data.additionalSections.map((item, index) => (
            <Form.Item label="additional" {...formItemLayout} key={index}>
              <AdditionSection data={item} />
            </Form.Item>
          ))}
          <Form.Item {...formButtonLayout}>
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
    label: FormDataLabelType,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  @action
  private updateData<TLabel extends FormDataLabelType>(
    label: TLabel,
    value: FormDataInterface[TLabel],
  ): void {
    this.data[label] = value;
  }
}

export default Form.create({name: 'new_item'})(NewItem);
export * from './additionalSection';
