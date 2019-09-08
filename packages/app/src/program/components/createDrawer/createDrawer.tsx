import {Drawer} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import NewFolder from './newFolder/newFolder';
import NewVault from './newVault/newVault';
import {DrawerProps} from './types';

@observer
export default class CreateDrawer extends Component<DrawerProps> {
  render(): ReactNode {
    const {visible, onClose, title, type} = this.props;

    return (
      <Drawer
        width={400}
        title={title ? title : `New ${type}`}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {type === 'Vault' ? (
          <NewVault
            vault={{name: '', type: 'private', describe: '', _id: ''}}
          />
        ) : (
          undefined
        )}
        {type === 'Folder' ? (
          <NewFolder folder={{name: '', describe: '', _id: '', vaultId: ''}} />
        ) : (
          undefined
        )}
      </Drawer>
    );
  }
}
