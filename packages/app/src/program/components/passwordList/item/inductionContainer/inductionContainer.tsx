import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import './inductionContainer.less';

const activeStyle = {
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  border: '1px solid rgb(24, 144, 255)',
};
const displayNone = {
  display: 'none',
};

interface InductionContainerProps {
  isActive: boolean;
  isShow: boolean;
}

@observer
class InductionContainer extends Component<InductionContainerProps> {
  render(): ReactNode {
    const {isActive, children, isShow} = this.props;

    return (
      <div
        className="inductionContainer"
        style={isShow ? (isActive ? activeStyle : undefined) : displayNone}
      >
        {children}
      </div>
    );
  }
}

export default InductionContainer;
