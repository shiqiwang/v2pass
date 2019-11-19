import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DataContext} from '../../store';
import {ActiveItem} from '../passwordList/types/types';

import FolderDetail from './folderDetail/folderDetail';
import PasswordDetail from './passwordDetail/passwordDetail';
import VaultDetail from './vaultDetail/vaultDetail';

interface DetailProps {
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

  context!: React.ContextType<typeof DataContext>;

  render(): ReactNode {
    const {vaultSelect, folderSelect, passwordSelect} = this.select;
    const {activeItem} = this.props;
    const {activeFolder, activeVault} = activeItem;

    return (
      <div className="detail">
        {vaultSelect ? (
          <VaultDetail vault={this.context.findVault(activeVault)!} />
        ) : (
          undefined
        )}
        {folderSelect ? (
          <FolderDetail
            folder={this.context.findFolder(activeFolder, activeVault)!}
          />
        ) : (
          undefined
        )}
        {passwordSelect ? (
          <PasswordDetail password={this.context.findPassword(activeItem)!} />
        ) : (
          undefined
        )}
      </div>
    );
  }

  static contextType = DataContext;
}

export default Detail;
