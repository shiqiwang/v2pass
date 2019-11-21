import {Empty, Input} from 'antd';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {Active, ActiveContext, DataContext} from '../../store';
import {Password} from '../../types';

import {FolderItem, PasswordItem, VaultItem} from './item';

interface ForSearch {
  text: string;
  result: Password[];
}

@observer
class List extends Component {
  @observable
  private search: ForSearch = {
    text: '',
    result: [],
  };

  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {text, result} = this.search;

    return (
      <div className="list">
        <ActiveContext.Consumer>
          {active => {
            return (
              <DataContext.Consumer>
                {dataProcess => {
                  return (
                    <div>
                      <Input.Search
                        type="text"
                        onSearch={value => this.onSearchPassword(value, active)}
                      />
                      {text && result.length ? (
                        result.map(item => (
                          <PasswordItem
                            password={item}
                            asSearch={true}
                            key={item['pass_name']}
                          />
                        ))
                      ) : (
                        <div>
                          {dataProcess.vaults.map(vault => (
                            <VaultItem vault={vault} key={vault.name}>
                              {vault.folders.map(folder => (
                                <FolderItem folder={folder} key={folder.name}>
                                  {folder.passwords.map(pass => (
                                    <PasswordItem
                                      password={pass}
                                      key={pass['pass_name']}
                                      asSearch={false}
                                    />
                                  ))}
                                </FolderItem>
                              ))}
                            </VaultItem>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
              </DataContext.Consumer>
            );
          }}
        </ActiveContext.Consumer>
      </div>
    );
  }

  private onSearchPassword(value: string, active: Active): void {
    const result = this.context.findPasswordsByName(value);

    if (value && result.length) {
      const {id, folderId, vaultId} = result[0];
      active.setActive({
        folder: folderId,
        vault: vaultId,
        pass: id,
      });
    }

    this.updateSearch({text: value, result});
  }

  @action
  private updateSearch(states: ForSearch): void {
    this.search = states;
  }

  static contextType = DataContext;
}

export default List;
