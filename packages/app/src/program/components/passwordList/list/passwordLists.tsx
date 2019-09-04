import React, {Component, ReactNode} from 'react';

import PasswordItem from '../item/passwordItem';
import {PasswordListProps} from '../types/types';

class PasswordList extends Component<PasswordListProps> {
  render(): ReactNode {
    const {passwords, activeItem, clickItem} = this.props;

    return (
      <div className="passwordLists">
        {passwords.map((password, index) => (
          <div key={String(index)}>
            <PasswordItem
              activeItem={activeItem}
              password={password}
              clickItem={clickItem}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default PasswordList;
