import {Button, Drawer, Form, Input} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './index.less';

interface NewFolderDrawerOptions {
  visible: boolean;
  onClose(): void;
}

interface NewFolderProps {
  drawer: NewFolderDrawerOptions;
}

@observer
class NewFolder extends Component<NewFolderProps> {
  render(): ReactNode {
    const {drawer: drawerOptions} = this.props;

    return (
      <Drawer
        width={400}
        title="New Folder"
        placement="right"
        closable={false}
        onClose={drawerOptions.onClose}
        visible={drawerOptions.visible}
      >
        new folder
      </Drawer>
    );
  }
}

export default NewFolder;
