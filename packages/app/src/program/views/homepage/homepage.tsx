import {Col, Row} from 'antd';
import {RouteComponentProps} from 'boring-router-react';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import CreateNew from '../../components/createNew';
import FolderDetail from '../../components/folderDetail';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList';
import PasswordSearch from '../../components/passwordSearch';
import {Router} from '../../router';

import './homepage.less';

import {userData} from './testData';
const password = {
  title: 'password',
  iconType: 'file',
  note: 'note',
  pass: '1234567',
  userName: 'emi',
  target: ['taobao.com', 'tianmao.com'],
  moreInfo: [{label: 'more', value: 'info'}],
};

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
            <PasswordList />
          </Col>
          <Col span={16}>
            <PasswordDetail password={password} />
            <FolderDetail
              folderName="folderName"
              folderDetail="folder detail"
              folderId={0}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
