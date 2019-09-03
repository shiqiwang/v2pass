import {Button, Drawer, Form, Icon, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {
  ChangeEvent,
  Component,
  FormEventHandler,
  ReactNode,
} from 'react';

import User from '../../../types/user';

interface UserInfo {
  _id: User['_id'];
  username: User['username'];
  unlockKey: User['unlockKey'];
  email: User['email'];
}

interface UserSettingProps extends FormComponentProps {
  user: UserInfo;
}

interface UserSettingStates extends UserInfo {
  newPassword: string;
  checkPassword: string;
}

type UserLabelType = keyof UserSettingStates;

@observer
class UserSetting extends Component<UserSettingProps> {
  @observable
  private drawerVisible = false;
  @observable
  private data: UserSettingStates = {
    ...this.props.user,
    newPassword: '',
    checkPassword: '',
  };

  render(): ReactNode {
    const {getFieldDecorator} = this.props.form!;
    const {username, email, newPassword, checkPassword} = this.data;

    return (
      <div className="userSetting">
        <Drawer
          width={400}
          placement="right"
          closable={false}
          title="User Setting"
          visible={this.drawerVisible}
          onClose={this.onDrawerClose}
        >
          <Form onSubmit={this.onFormSubmit} className="userSettingForm">
            <Form.Item label="username">
              {getFieldDecorator('username', {
                rules: [{required: true, message: 'user name is needed!'}],
                initialValue: username,
              })(
                <Input
                  type="text"
                  onChange={event => this.onDataChange('username', event)}
                />,
              )}
            </Form.Item>
            <Form.Item label="master password">
              {getFieldDecorator('masterPassword', {
                rules: [
                  {required: true, message: 'old master password is needed!'},
                ],
              })(
                <Input
                  type="password"
                  onChange={event => this.onCheckPassword(event.target.value)}
                />,
              )}
            </Form.Item>
            <Form.Item label="new master password">
              {getFieldDecorator('newMasterPassword', {
                initialValue: newPassword,
              })(
                <Input
                  type="password"
                  onChange={event => this.onDataChange('newPassword', event)}
                />,
              )}
            </Form.Item>
            <Form.Item label="check new master password">
              {getFieldDecorator('checkNewMasterPassword', {
                initialValue: checkPassword,
              })(
                <Input
                  type="password"
                  onChange={event => this.onDataChange('checkPassword', event)}
                  onBlur={this.onConfirmPassword}
                />,
              )}
            </Form.Item>
            <Form.Item label="email">
              {getFieldDecorator('email', {
                rules: [{required: true, message: 'email is needed!'}],
                initialValue: checkPassword,
              })(
                <Input
                  type="text"
                  onChange={event => this.onDataChange('email', event)}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary">save</Button>
            </Form.Item>
          </Form>
        </Drawer>
        <Button type="primary" onClick={this.onDrawerShow}>
          <Icon type="setting" />
        </Button>
      </div>
    );
  }

  private onDrawerClose = (): void => {
    this.updateDrawerVisible(false);
  };

  private onDrawerShow = (): void => {
    this.updateDrawerVisible(true);
  };

  private onCheckPassword = (password: string): boolean => {
    // 在更改前需要检测用户的旧密码
    // 通过衍生与unlockKey做对比
    return false;
  };

  private onConfirmPassword = (): boolean => {
    // 校验新输入密码是否相同
    const {newPassword, checkPassword} = this.data;

    if (newPassword === checkPassword) {
      return true;
    }

    return false;
  };

  private onCheckName = (): boolean => {
    const oldName = this.props.user.username;
    const newName = this.data.username;

    if (oldName === newName) {
      return true;
    }

    // newName与远程其它人名字做对比，查重
    return false;
  };

  private onCheckEmail = (): boolean => {
    // 用正则检验输入的email
    return false;
  };

  private onDataChange(
    label: UserLabelType,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    this.updateData(label, event.target.value);
  }

  private onFormSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    this.props.form!.validateFields((error, values) => {
      if (!error) {
        console.log('submit', values);
      }
    });
  };

  @action
  private updateDrawerVisible = (status: boolean): void => {
    this.drawerVisible = status;
  };

  @action
  private updateData<TLabel extends UserLabelType>(
    label: TLabel,
    value: UserSettingStates[TLabel],
  ): void {
    this.data[label] = value;
  }
}

export default Form.create<UserSettingProps>({name: 'user_setting'})(
  UserSetting,
);
