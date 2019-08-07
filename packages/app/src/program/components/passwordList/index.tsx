import React, {Component, ReactNode} from 'react';

import FolderItem from './folderItem';
import PasswordItem from './passwordItem';

class PasswordList extends Component {
  render(): ReactNode {
    return (
      <div>
        <FolderItem />
        <PasswordItem collect={true} name="hello" />
      </div>
    );
  }
}

export default PasswordList;
export * from './folderItem';
export * from './passwordItem';
