import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderItem, {FolderData} from './folderItem';
import PasswordItem, {PasswordItemData} from './passwordItem';

interface OnePasswordFolder {
  folder: FolderData;
  item: PasswordItemData[];
}

type PasswordListStates = OnePasswordFolder[];

interface ActiveFolder {
  id: number;
  folded: boolean;
}

interface ActiveItem {
  id: number;
  parentId: number;
}

@observer
class PasswordList extends Component {
  @observable
  private data: PasswordListStates = [
    {
      folder: {
        folderName: 'Collection',
        folderId: 1,
      },
      item: [
        {
          name: 'test',
          collect: true,
          id: 1,
          parentId: 1,
        },
      ],
    },
    {
      folder: {
        folderName: 'Code',
        folderId: 2,
      },
      item: [
        {
          name: 'github',
          collect: false,
          id: 1,
          parentId: 2,
        },
        {
          name: 'gitlab',
          collect: false,
          id: 2,
          parentId: 2,
        },
      ],
    },
    {
      folder: {
        folderName: 'Test',
        folderId: 3,
      },
      item: [
        {
          name: 'github',
          collect: false,
          id: 1,
          parentId: 3,
        },
        {
          name: 'gitlab',
          collect: false,
          id: 2,
          parentId: 3,
        },
      ],
    },
  ];
  @observable
  private foldedMap = new Map(
    this.data.map(folder => [folder.folder.folderId, true]),
  );
  @observable
  private activeFolder: ActiveFolder = {
    id: 0,
    folded: true,
  };
  @observable
  private activeItem: ActiveItem = {
    id: 0,
    parentId: 0,
  };

  render(): ReactNode {
    return (
      <div className="passwordList">
        {this.data.map((folder, index) => {
          const {folderId} = folder.folder;

          return (
            <div className="singleFolder" key={String(index)}>
              <FolderItem
                style={
                  this.activeFolder.id === folderId
                    ? {
                        backgroundColor: 'rgba(24, 144, 255, 0.1)',
                        border: '1px solid rgb(24, 144, 255)',
                      }
                    : undefined
                }
                {...folder.folder}
                folded={this.foldedMap.get(folderId)!}
                changeFoldedStatus={(folded, id) =>
                  this.changeFoldedStatus(folded, id)
                }
              />
              {this.foldedMap.get(folderId) ||
                folder.item.map((item, index) => {
                  return (
                    <PasswordItem
                      style={
                        item.id === this.activeItem.id &&
                        item.parentId === this.activeFolder.id
                          ? {
                              backgroundColor: 'rgba(24, 144, 255, 0.1)',
                              border: '1px solid rgb(24, 144, 255)',
                            }
                          : undefined
                      }
                      {...item}
                      key={String(index)}
                      onItemClick={() => this.onItemClick(item.id, folderId)}
                    />
                  );
                })}
            </div>
          );
        })}
      </div>
    );
  }

  private changeFoldedStatus(folded: boolean, id: number): void {
    this.updateActiveFolder({id, folded});
    this.updateActiveItem({id: NaN, parentId: NaN});
    this.updateFoldedMap(folded, id);
  }

  private onItemClick(id: number, parentId: number): void {
    this.updateActiveItem({id, parentId});
    // item活跃意味着包含它的folder也活跃
    this.updateActiveFolder({id: parentId, folded: true});
  }

  @action
  private updateFoldedMap(folded: boolean, id: number): void {
    this.foldedMap.set(id, folded);
  }

  @action
  private updateActiveFolder(states: ActiveFolder): void {
    this.activeFolder = states;
  }

  @action
  private updateActiveItem(states: ActiveItem): void {
    this.activeItem = states;
  }
}

export default PasswordList;
export * from './folderItem';
export * from './passwordItem';
