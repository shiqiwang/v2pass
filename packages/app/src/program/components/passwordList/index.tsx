import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderItem, {FolderData} from './folderItem';
import PasswordItem, {PasswordItemProps} from './passwordItem';

interface OnePasswordFolder {
  folder: FolderData;
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
  @observable
  private foldedMap = new Map(
    this.data.map(folder => [folder.folder.folderId, true]),
  );

  render(): ReactNode {
    return (
      <div className="passwordList">
        {this.data.map((folder, index) => (
          <div className="singleFolder" key={String(index)}>
            <FolderItem
              {...folder.folder}
              folded={this.foldedMap.get(folder.folder.folderId)!}
              changeFoldedStatus={(folded, id) =>
                this.changeFoldedStatus(folded, id)
              }
            />
            {this.foldedMap.get(folder.folder.folderId) ||
              folder.item.map((item, index) => (
                <PasswordItem {...item} key={String(index)} />
              ))}
          </div>
        ))}
      </div>
    );
  }

  private changeFoldedStatus(folded: boolean, id: number): void {
    this.updateFoldedMap(folded, id);
  }

  @action
  private updateFoldedMap(folded: boolean, id: number): void {
    this.foldedMap.set(id, folded);
  }
}

export default PasswordList;
export * from './folderItem';
export * from './passwordItem';
