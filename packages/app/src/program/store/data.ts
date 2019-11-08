import {message} from 'antd';
import {observable} from 'mobx';
import React from 'react';

import {encryptData} from '../auth';
import DataProcess from '../dataProcess';
import {updateDataApi} from '../request';
import {DataKey, UsageData} from '../types';

// 明文数据
export class PlainData {
  @observable data: UsageData;
  @observable dataKey: DataKey;

  constructor(newData: UsageData, newDataKey: DataKey) {
    this.data = newData;
    this.dataKey = newDataKey;
  }

  getData(): UsageData {
    return this.data;
  }

  updateDataKey(newDataKey: DataKey): void {
    this.dataKey = newDataKey;
  }

  updateData(newData: UsageData): void {
    this.data = newData;
    chrome.storage.local.set({data: newData});
    const cipherData = encryptData(this.dataKey, newData); // 加密后的数据
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
    return new DataProcess(this.data);
  }
}

export const PlainDataContext = React.createContext(
  new PlainData({vaults: [], targets: []}, ''),
);
