import React, {ReactNode, Component} from 'react';
import {observer} from 'mobx-react';

import './inductionContainer.less';

const activeStyle = {
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  border: '1px solid rgb(24, 144, 255)',
};

interface InductionContainerProps {
  isActive: boolean;
}

@observer
class InductionContainer extends Component<InductionContainerProps> {
  render(): ReactNode {
    const {isActive, children} = this.props;
    return (
      <div
        className="inductionContainer"
        style={isActive ? activeStyle : undefined}
      >
        {children}
      </div>
    );
  }
}

export default InductionContainer;
