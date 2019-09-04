import React, {Component, ReactNode} from 'react';

import FolderItem from '../item/folderItem';
import {FolderListProps} from '../types/types';

class FolderLists extends Component<FolderListProps> {
  render(): ReactNode {
    const {folders, activeItem, clickItem} = this.props;

    return (
      <div className="folderLists">
        {folders.map((folder, index) => (
          <div key={String(index)}>
            <FolderItem
              folder={folder}
              activeItem={activeItem}
              clickItem={clickItem}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default FolderLists;
