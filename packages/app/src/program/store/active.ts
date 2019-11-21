import {computed, observable} from 'mobx';
import React from 'react';

import {ListItemStatus} from '../const';
import {Folder, Password, Vault} from '../types';

interface IActive {
  vault: Vault['id'];
  folder: Folder['id'];
  pass: Password['id'];
}

interface IStatus {
  status: number;
  id: string;
}

export class Active {
  @observable private active: IActive = {
    vault: '',
    folder: '',
    pass: '',
  };

  getActive(): IActive {
    return this.active;
  }

  @computed get getVaultStatus(): IStatus {
    const {folder, vault} = this.active;
    let status: IStatus['status'];

    if (vault) {
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

  @computed get getFolderStatus(): IStatus {
    const {folder, pass} = this.active;
    let status: IStatus['status'];

    if (folder) {
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

  @computed get getPassStatus(): IStatus {
    const {pass} = this.active;
    let status: IStatus['status'];

    if (pass) {
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
