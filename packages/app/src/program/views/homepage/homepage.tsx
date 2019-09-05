import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateNew from '../../components/createNew/createNew';
import FolderDetail from '../../components/detail/folderDetail/folderDetail';
import PasswordDetail from '../../components/detail/passwordDetail/passwordDetail';
import VaultDetail from '../../components/detail/vaultDetail/vaultDetail';
import PasswordList from '../../components/passwordList/list';
import {ActiveItem} from '../../components/passwordList/types/types';
import UserSetting from '../../components/userSetting/userSetting';
import {Router} from '../../router';
import {findFolder, findPassword, findVault} from '../../util/util';

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
    const {activeFolder, activePassword, activeVault} = this.activeItem;
    const vaultSelect = activeVault && !activeFolder && !activePassword;
    const folderSelect = activeFolder && activeVault && !activePassword;
    const passwordSelect = activePassword && activeFolder && activeVault;

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
            {vaultSelect ? (
              <VaultDetail vault={findVault(vaults, activeVault)!} />
            ) : (
              undefined
            )}
            {folderSelect ? (
              <FolderDetail
                folder={findFolder(vaults, activeFolder, activeVault)!}
              />
            ) : (
              undefined
            )}
            {passwordSelect ? (
              <PasswordDetail
                password={findPassword(vaults, this.activeItem)!}
              />
            ) : (
              undefined
            )}
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
