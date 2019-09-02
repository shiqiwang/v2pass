import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateNew from '../../components/createNew';
import FolderDetail from '../../components/folderDetail';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList/passwordList';
import PasswordSearch from '../../components/passwordSearch';
import VaultDetail from '../../components/vaultDetail';
import {Router} from '../../router';

import './homepage.less';

import {userData} from './testData';
const {vaults, targets} = userData.data;

export interface HomePageProps
  extends RouteComponentProps<Router['homepage']> {}

@observer
class HomePage extends Component<HomePageProps> {
  render(): ReactNode {
    // let {match} = this.props;
    // console.log(match.$params.id); 如果有query等可以用该方式获取

    return (
      <div className="homePage">
        <div className="header">
          <PasswordSearch />
          <CreateNew />
        </div>
        <Row className="mainBody">
          <Col span={8}>
            <PasswordList vaults={vaults} select={this.contentChange} />
          </Col>
          <Col span={16}>
            {/* <PasswordDetail password={} />
            <FolderDetail
              folderName="folderName"
              folderDetail="folder detail"
              folderId={0}
            /> */}
          </Col>
        </Row>
      </div>
    );
  }

  private contentChange(): void {}
}

export default HomePage;
