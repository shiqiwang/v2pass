import {Drawer} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import GenerateRandomPassword from '../generateRandomPassword/generateRandomPassword';

interface NewRandomPassDrawerOptions {
  visible: boolean;
  onClose(): void;
}

interface NewRandomPassProps {
  drawer: NewRandomPassDrawerOptions;
}

@observer
class NewRandomPass extends Component<NewRandomPassProps> {
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
        <GenerateRandomPassword />
      </Drawer>
    );
  }
}

export default NewRandomPass;
