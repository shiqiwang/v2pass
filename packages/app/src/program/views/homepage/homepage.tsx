import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateNew from '../../components/createDrawer/createNew';
import Detail from '../../components/detail/detail';
import PasswordList from '../../components/passwordList/list';
import {ActiveItem} from '../../components/passwordList/types/types';
import Profile from '../../components/profile/profile';
import {Router} from '../../router';

import './homepage.less';

export interface HomePageProps
  extends RouteComponentProps<Router['homepage']> {}

@observer
class HomePage extends Component<HomePageProps> {
  @observable
  private activeItem: ActiveItem = {
    activePassword: '',
    activeFolder: '',
    activeVault: '',
  };

  render(): ReactNode {
    return (
      <div className="homePage">
        <Row className="header">
          <Col span={4} className="options">
            <CreateNew />
          </Col>
          <Col span={4} className="options">
            <Profile />
          </Col>
        </Row>
        <Row className="mainBody">
          <Col span={8}>
            <PasswordList
              select={activeItem => this.updateActiveItem(activeItem)}
            />
          </Col>
          <Col span={16}>
            <Detail activeItem={this.activeItem} />
          </Col>
        </Row>
      </div>
    );
  }

  @action
  private updateActiveItem = (states: ActiveItem): void => {
    this.activeItem = states;
  };
}

export default HomePage;
