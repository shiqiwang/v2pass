import {Input} from 'antd';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

interface PasswordSearchProps {
  onSearch(value: string): void;
}

@observer
class PasswordSearch extends Component<PasswordSearchProps> {
  render(): ReactNode {
    const {onSearch} = this.props;

    return (
      <div className="passwordSearch">
        <Input.Search
          placeholder="search password item name"
          onChange={event => onSearch(event.target.value)}
          onSearch={value => onSearch(value)}
        />
      </div>
    );
  }
}

export default PasswordSearch;
