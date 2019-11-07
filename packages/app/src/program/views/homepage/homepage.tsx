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
import DataProcess from '../../dataProcess';
import {Router} from '../../router';
import {UsageData} from '../../types';

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
  private data: UsageData = {
    vaults: [
      {
        id: '1',
        name: 'vault1',
        type: 'private',
        describe: 'test',
        folders: [
          {
            id: '1',
            vaultId: '1',
            name: 'folder1',
            describe: 'test',
            passwords: [
              {
                id: '1',
                folderId: '1',
                vaultId: '1',
                pass_name: 'password',
                collect: true,
                targetId: '1',
                items: [
                  {
                    id: '1',
                    type: 'userName',
                    label: 'username',
                    value: 'emi wang',
                  },
                ],
              },
            ],
          },
          {
            id: '2',
            vaultId: '1',
            name: 'folder2',
            describe: 'test',
            passwords: [],
          },
        ],
      },
    ],
    targets: [
      {
        id: '1',
        displayName: 'target',
        entries: [{id: '1', type: 'website URL', value: 'baidu.com'}],
      },
    ],
  };

  render(): ReactNode {
    const dataProcess = new DataProcess(this.data);

    return (
      <div className="homePage">
        <Row className="header">
          <Col span={4} className="options">
            <CreateNew dataProcess={dataProcess} />
          </Col>
          <Col span={4} className="options">
            <Profile />
          </Col>
        </Row>
        <Row className="mainBody">
          <Col span={8}>
            <PasswordList
              dataProcess={dataProcess}
              select={activeItem => this.updateActiveItem(activeItem)}
            />
          </Col>
          <Col span={16}>
            <Detail activeItem={this.activeItem} dataProcess={dataProcess} />
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
