import {Button, Drawer, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import GenerateRandomPassword from '../generateRandomPassword';

import './index.less';

interface NewRandomPassDrawerOptions {
  visible: boolean;
  onClose(): void;
}

interface NewRandomPassProps {
  drawer: NewRandomPassDrawerOptions;
}

@observer
class NewRandomPass extends Component<NewRandomPassProps> {
  @observable
  private password = '';

  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;

    return (
      <Drawer
        width={400}
        title="Generate Password"
        placement="right"
        closable={false}
        onClose={drawerOptions.onClose}
        visible={drawerOptions.visible}
      >
        <Input value={this.password} />
        <Button type="primary">copy</Button>
        <GenerateRandomPassword />
      </Drawer>
    );
  }
}

export default NewRandomPass;
