import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import Vault from '../../types/vault';
import {findFolder, findPassword, findVault} from '../../util/util';
import {ActiveItem} from '../passwordList/types/types';

import FolderDetail from './folderDetail/folderDetail';
import PasswordDetail from './passwordDetail/passwordDetail';
import VaultDetail from './vaultDetail/vaultDetail';

interface DetailProps {
  vaults: Vault[];
  activeItem: ActiveItem;
}

interface Select {
  vaultSelect: boolean;
  folderSelect: boolean;
  passwordSelect: boolean;
}

@observer
class Detail extends Component<DetailProps> {
  @computed
  private get select(): Select {
    const {activeFolder, activePassword, activeVault} = this.props.activeItem;
    const vaultSelect = !!(activeVault && !activeFolder && !activePassword);
    const folderSelect = !!(activeFolder && activeVault && !activePassword);
    const passwordSelect = !!(activePassword && activeFolder && activeVault);

    return {
      vaultSelect,
      folderSelect,
      passwordSelect,
    };
  }

  render(): ReactNode {
    const {vaultSelect, folderSelect, passwordSelect} = this.select;
    const {vaults, activeItem} = this.props;
    const {activeFolder, activeVault} = activeItem;

    return (
      <div className="detail">
        {vaultSelect ? (
          <VaultDetail vault={findVault(vaults, activeVault)!} />
        ) : (
          undefined
        )}
        {folderSelect ? (
          <FolderDetail
            folder={findFolder(vaults, activeFolder, activeVault)!}
          />
        ) : (
          undefined
        )}
        {passwordSelect ? (
          <PasswordDetail
            password={findPassword(vaults, this.props.activeItem)!}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default Detail;
