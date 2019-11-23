import {observable} from 'mobx';
import React from 'react';

import {ListItemStatus} from '../const';
import {Folder, IActive, IStatus, Password, Vault} from '../types';

export class Active {
  @observable private active: IActive = {
    vault: '',
    folder: '',
    pass: '',
  };

  getActive(): IActive {
    return this.active;
  }

  getVaultStatus(vaultId: Vault['id']): IStatus {
    const {folder, vault} = this.active;
    let status: IStatus['status'];

    if (vault === vaultId) {
      if (folder) {
        status = ListItemStatus.associated;
      } else {
        status = ListItemStatus.active;
      }
    } else {
      status = ListItemStatus.normal;
    }

    return {
      status,
      id: vault,
    };
  }

  getFolderStatus(id: Folder['id']): IStatus {
    const {folder, pass} = this.active;
    let status: IStatus['status'];

    if (folder === id) {
      if (pass) {
        status = ListItemStatus.associated;
      } else {
        status = ListItemStatus.active;
      }
    } else {
      status = ListItemStatus.normal;
    }

    return {
      status,
      id: folder,
    };
  }

  getPassStatus(id: Password['id']): IStatus {
    const {pass} = this.active;
    let status: IStatus['status'];

    if (pass === id) {
      status = ListItemStatus.active;
    } else {
      status = ListItemStatus.normal;
    }

    return {
      status,
      id: pass,
    };
  }

  setActive(newActive: IActive): void {
    this.active = newActive;
  }
}

export const ActiveContext = React.createContext(new Active());
