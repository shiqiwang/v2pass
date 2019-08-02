import {Button, Drawer, Form, Input} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface NewItemDrawerOptions {
  visible: boolean;
  onClose(): void;
}

interface NewItemProps {
  drawer: NewItemDrawerOptions;
}

@observer
class NewItem extends Component<NewItemProps> {
  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;

    return (
      <Drawer
        width={400}
        title="New Item"
        placement="right"
        closable={false}
        onClose={drawerOptions.onClose}
        visible={drawerOptions.visible}
      >
        new item
      </Drawer>
    );
  }
}

export default NewItem;
