import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateNew from '../../components/createNew/createNew';
import Detail from '../../components/detail/detail';
import PasswordList from '../../components/passwordList/list';
import {ActiveItem} from '../../components/passwordList/types/types';
import UserSetting from '../../components/userSetting/userSetting';
import {Router} from '../../router';

import './homepage.less';

import {userData} from './testData';
const {vaults, targets} = userData.data;

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
    // let {match} = this.props;
    // console.log(match.$params.id); 如果有query等可以用该方式获取

    return (
      <div className="homePage">
        <Row className="header">
          <Col span={4} className="options">
            <CreateNew />
          </Col>
          <Col span={2} className="options">
            <UserSetting
              user={{
                _id: userData._id,
                username: userData.username,
                unlockKey: userData.unlockKey,
                email: userData.email,
              }}
            />
          </Col>
        </Row>
        <Row className="mainBody">
          <Col span={8}>
            <PasswordList
              vaults={vaults}
              select={activeItem => this.updateActiveItem(activeItem)}
            />
          </Col>
          <Col span={16}>
            <Detail
              vaults={vaults}
              activeItem={this.activeItem}
              targets={targets}
            />
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
