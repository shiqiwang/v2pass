import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import {findFolder, findPassword, findVault} from '../../../util/util';
import CreateNew from '../../components/createNew/createNew';
import FolderDetail from '../../components/folderDetail/folderDetail';
import PasswordDetail from '../../components/passwordDetail/passwordDetail';
import PasswordList, {
  ActiveItem,
} from '../../components/passwordList/passwordList';
import PasswordSearch from '../../components/passwordSearch/passwordSearch';
import VaultDetail from '../../components/vaultDetail/vaultDetail';
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
    const {activeFolder, activePassword, activeVault} = this.activeItem;
    const vaultSelect = activeVault && !activeFolder && !activePassword;
    const folderSelect = activeFolder && activeVault && !activePassword;
    const passwordSelect = activePassword && activeFolder && activeVault;

    return (
      <div className="homePage">
        <div className="header">
          <PasswordSearch />
          <CreateNew />
        </div>
        <Row className="mainBody">
          <Col span={8}>
            <PasswordList
              vaults={vaults}
              select={activeItem => (this.activeItem = activeItem)}
            />
          </Col>
          <Col span={16}>
            {vaultSelect ? (
              <VaultDetail vault={findVault(vaults, activeVault)} />
            ) : (
              undefined
            )}
            {folderSelect ? (
              <FolderDetail
                folder={findFolder(vaults, activeFolder, activeVault)}
              />
            ) : (
              undefined
            )}
            {passwordSelect ? (
              <PasswordDetail
                password={findPassword(vaults, this.activeItem)}
              />
            ) : (
              undefined
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
