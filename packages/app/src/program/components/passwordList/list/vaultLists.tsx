import React, {Component, ReactNode} from 'react';

import VaultItem from '../item/vaultItem';
import {VaultListProps} from '../types/types';

class VaultLists extends Component<VaultListProps> {
  render(): ReactNode {
    const {vaults, activeItem, clickItem} = this.props;

    return (
      <div className="vaultLists">
        {vaults.map((vault, index) => (
          <div key={String(index)}>
            <VaultItem
              vault={vault}
              activeItem={activeItem}
              clickItem={clickItem}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default VaultLists;
