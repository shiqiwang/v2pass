import {Empty} from 'antd';
import React, {Component, ReactNode} from 'react';

import './passwordList.less';

class NoResult extends Component {
  render(): ReactNode {
    return (
      <div className="noResult">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}>No Result</Empty>
      </div>
    );
  }
}

export default NoResult;
