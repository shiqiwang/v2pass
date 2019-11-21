import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {CreateNew} from '../../components/createDrawer';
import Detail from '../../components/detail/detail';
import PasswordList from '../../components/passwordList/list';
import Profile from '../../components/profile/profile';
import {Router} from '../../router';

import './homepage.less';

export interface HomePageProps
  extends RouteComponentProps<Router['homepage']> {}

@observer
class HomePage extends Component<HomePageProps> {
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
            <PasswordList />
          </Col>
          <Col span={16}>
            <Detail />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
