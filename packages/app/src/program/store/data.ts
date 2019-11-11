import {message} from 'antd';
import {observable} from 'mobx';
import React from 'react';

import {encryptData} from '../auth';
import DataProcess from '../dataProcess';
import {updateDataApi} from '../request';
import {DataKey, UsageData} from '../types';

interface Record {
  plainData: UsageData;
  dataKey: DataKey;
}

// 明文数据
export class PlainData {
  @observable record: Record;
  @observable hasService: boolean = false;

  constructor(newRecord: Record) {
    this.record = newRecord;
  }

  getRecord(): Record {
    return this.record;
  }

  getHasService(): boolean {
    return this.hasService;
  }

  updateRecord(newRecord: Record): void {
    this.record = newRecord;
  }

  updateHasService(has: boolean): void {
    this.hasService = has;
  }

  updateAllFormOfData(record: Record): void {
    const {plainData, dataKey} = record;
    const cipherData = encryptData(dataKey, plainData);
    chrome.storage.local.set({data: cipherData});
    updateDataApi(cipherData)
      .then(result => {
        if (result) {
          message.success('data update successfully');
        } else {
          // 如果出错了，是否应当稍后自动重试啥的？？？
          message.warning('data update error');
        }
      })
      .catch(error => message.error(error.message));
  }

  dataProcess(): DataProcess {
    return new DataProcess(this.record.plainData);
  }
}

export const PlainDataContext = React.createContext(
  new PlainData({plainData: {vaults: [], targets: []}, dataKey: ''}),
);
