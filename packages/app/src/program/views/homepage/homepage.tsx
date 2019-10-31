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
import {UsageData, UserBaseInfo} from '../../types';

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

  @observable
  private userInfo: UserBaseInfo = {
    username: '',
    email: '',
    id: '',
  };

  // @observable
  // private data: UsageData = {};

  render(): ReactNode {
    // const {username, email, id} = this.userInfo;

    return (
      <div className="homePage">
        <Row className="header">
          <Col span={4} className="options">
            <CreateNew />
          </Col>
          <Col span={2} className="options"></Col>
        </Row>
        <Profile userInfo={this.userInfo} />
        {/* <Row className="mainBody">
          <Col span={8}>
            <PasswordList
              vaults={[]}
              select={activeItem => this.updateActiveItem(activeItem)}
            />
          </Col>
          <Col span={16}>
            <Detail vaults={[]} activeItem={this.activeItem} targets={[]} />
          </Col>
        </Row> */}
      </div>
    );
  }

  componentWillMount(): void {
    chrome.storage.local.get(items => {
      console.log('items', items);
      const {username, email, id, data} = items;
      this.updateUserInfo({username, email, id});
    });
  }

  @action
  private updateActiveItem = (states: ActiveItem): void => {
    this.activeItem = states;
  };

  @action
  private updateUserInfo = (value: Partial<UserBaseInfo>): void => {
    this.userInfo = {
      ...this.userInfo,
      ...value,
    };
  };
}

export default HomePage;
