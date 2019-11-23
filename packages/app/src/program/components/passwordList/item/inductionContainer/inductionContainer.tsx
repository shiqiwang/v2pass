import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {ListItemStatus} from '../../../../const';

import './inductionContainer.less';

interface IBackground {
  backgroundColor: string;
  border: string;
}

const activeStyle: IBackground = {
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  border: '1px solid rgb(24, 144, 255)',
};
const displayNone = {
  display: 'none',
};

const associatedStyle: IBackground = {
  backgroundColor: 'rgba(221, 221, 221, 0.5)',
  border: '1px solid #ccc',
};

interface InductionContainerProps {
  status: number;
  isShow: boolean;
}

@observer
class InductionContainer extends Component<InductionContainerProps> {
  render(): ReactNode {
    const {children, isShow} = this.props;

    return (
      <div
        className="inductionContainer"
        style={isShow ? this.getBackgroundStyle : displayNone}
      >
        {children}
      </div>
    );
  }

  @computed
  get getBackgroundStyle(): IBackground | undefined {
    const {status} = this.props;

    if (status === ListItemStatus.active) {
      return activeStyle;
    } else if (status === ListItemStatus.associated) {
      return associatedStyle;
    } else {
      return undefined;
    }
  }
}

export default InductionContainer;
