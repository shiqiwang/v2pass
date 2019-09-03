import {Icon, Input} from 'antd';
import React, {Component, ReactNode} from 'react';

class PasswordSearch extends Component {
  render(): ReactNode {
    return (
      <div className="passwordSearch">
        <Input placeholder="Search" suffix={<Icon type="search" />} />
      </div>
    );
  }
}

export default PasswordSearch;
