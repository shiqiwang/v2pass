import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ListItemStatus} from '../../const';
import {ActiveContext, DataContext} from '../../store';

import FolderDetail from './folderDetail/folderDetail';
import PasswordDetail from './passwordDetail/passwordDetail';
import VaultDetail from './vaultDetail/vaultDetail';

@observer
class Detail extends Component {
  render(): ReactNode {
    return (
      <div className="detail">
        <DataContext.Consumer>
          {dataProcess => {
            return (
              <ActiveContext.Consumer>
                {active => {
                  const vault = active.getVaultStatus;
                  const folder = active.getFolderStatus;
                  const pass = active.getPassStatus;

                  return (
                    <div>
                      {vault.status === ListItemStatus.active ? (
                        <VaultDetail vault={dataProcess.findVault(vault.id)!} />
                      ) : (
                        undefined
                      )}

                      {folder.status === ListItemStatus.active ? (
                        <FolderDetail
                          folder={dataProcess.findFolder(folder.id, vault.id)!}
                        />
                      ) : (
                        undefined
                      )}

                      {pass.status === ListItemStatus.active ? (
                        <PasswordDetail
                          password={
                            dataProcess.findPassword({
                              folderId: folder.id,
                              passId: pass.id,
                              vaultId: vault.id,
                            })!
                          }
                        />
                      ) : (
                        undefined
                      )}
                    </div>
                  );
                }}
              </ActiveContext.Consumer>
            );
          }}
        </DataContext.Consumer>
      </div>
    );
  }
}

export default Detail;
