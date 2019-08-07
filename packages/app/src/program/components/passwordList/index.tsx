import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderItem, {FolderItemProps} from './folderItem';
import PasswordItem, {PasswordItemProps} from './passwordItem';

interface OnePasswordFolder {
  folder: FolderItemProps;
  item: PasswordItemProps[];
}

type PasswordListStates = OnePasswordFolder[];

@observer
class PasswordList extends Component {
  @observable
  private data: PasswordListStates = [
    {
      folder: {
        folderName: 'Collection',
        folderId: 0,
      },
      item: [
        {
          name: 'test',
          collect: true,
          id: 0,
        },
      ],
    },
    {
      folder: {
        folderName: 'Code',
        folderId: 1,
      },
      item: [
        {
          name: 'github',
          collect: false,
          id: 0,
        },
        {
          name: 'gitlab',
          collect: false,
          id: 1,
        },
      ],
    },
  ];

  render(): ReactNode {
    return (
      <div className="passwordList">
        {this.data.map((folder, index) => (
          <div className="singleFolder" key={String(index)}>
            <FolderItem {...folder.folder} />
            {folder.item.map((item, index) => (
              <PasswordItem {...item} key={String(index)} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default PasswordList;
export * from './folderItem';
export * from './passwordItem';
