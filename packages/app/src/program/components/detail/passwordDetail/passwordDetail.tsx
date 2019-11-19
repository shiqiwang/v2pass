import {Col, Icon, Row} from 'antd';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {DataContext} from '../../../store';
import {Password, Target} from '../../../types';
import {CopyableContainer} from '../../copyableContainer';

import './passwordDetail.less';

interface PasswordProps {
  password: Password;
}

@observer
class PasswordDetail extends Component<PasswordProps> {
  context!: React.ContextType<typeof DataContext>;

  @computed
  private get target(): Target | undefined {
    const {targetId} = this.props.password;
    const target = this.context.findTarget(targetId);
    return target;
  }

  render(): ReactNode {
    const {password} = this.props;

    return (
      <div className="passwordDetail">
        <div className="header">
          <Row>
            <Col span={2}>
              <Icon type="book" />
            </Col>
            <Col span={22}>
              <h4>{password.pass_name}</h4>
            </Col>
          </Row>
          <div className="main">
            <h5>Main Info</h5>
            {password.items.map((item, index) => (
              <CopyableContainer key={String(index)} data={item} />
            ))}
            <h5>Target：{this.target ? this.target.displayName : null}</h5>
            {this.target
              ? this.target.entries.map((item, index) => (
                  <CopyableContainer
                    key={String(index)}
                    data={{label: item.type, value: item.value}}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    );
  }

  static contextType = DataContext;
}

export default PasswordDetail;
