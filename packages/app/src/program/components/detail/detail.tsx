import {consume, observer} from '@makeflow/mobx-utils';
import React, {Component, ReactNode} from 'react';

import {ListItemStatus} from '../../const';
import {Active, ActiveContext, DataContext, DataProcess} from '../../store';

import FolderDetail from './folderDetail/folderDetail';
import PasswordDetail from './passwordDetail/passwordDetail';
import VaultDetail from './vaultDetail/vaultDetail';

@observer
class Detail extends Component {
  @consume(ActiveContext.Consumer)
  private activeState!: Active;

  @consume(DataContext.Consumer)
  private dataState!: DataProcess;

  render(): ReactNode {
    const vault = this.activeState.getVaultStatus;
    const folder = this.activeState.getFolderStatus;
    const pass = this.activeState.getPassStatus;

    return (
      <div className="detail">
        {vault.status === ListItemStatus.active ? (
          <VaultDetail vault={this.dataState.findVault(vault.id)!} />
        ) : (
          undefined
        )}

        {folder.status === ListItemStatus.active ? (
          <FolderDetail
            folder={this.dataState.findFolder(folder.id, vault.id)!}
          />
        ) : (
          undefined
        )}

        {pass.status === ListItemStatus.active ? (
          <PasswordDetail
            password={
              this.dataState.findPassword({
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
  }
}

export default Detail;
