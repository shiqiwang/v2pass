import {consume, observer} from '@makeflow/mobx-utils';
import React, {Component, ReactNode} from 'react';

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
    const active = this.activeState.getActive();
    const {folder, vault, pass} = active;

    return (
      <div className="detail">
        {vault && !folder ? (
          <VaultDetail vault={this.dataState.findVault(vault)!} />
        ) : (
          undefined
        )}

        {folder && !pass ? (
          <FolderDetail folder={this.dataState.findFolder(folder, vault)!} />
        ) : (
          undefined
        )}

        {pass ? (
          <PasswordDetail
            password={
              this.dataState.findPassword({
                folderId: folder,
                passId: pass,
                vaultId: vault,
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
