import React, {Component, ReactNode} from 'react';

import FolderDetail from '../../components/folderDetail';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList';
import PasswordSearch from '../../components/passwordSearch';

const password = {
  title: 'password',
  iconType: 'file',
  note: 'note',
  pass: '1234567',
  userName: 'emi',
  target: ['taobao.com', 'tianmao.com'],
  moreInfo: [{label: 'more', value: 'info'}],
};

class HomePage extends Component {
  render(): ReactNode {
    return (
      <div className="homePage">
        <PasswordSearch />
        <PasswordList />
        <PasswordDetail password={password} />
        <FolderDetail folderName="folderName" folderDetail="folder detail" />
      </div>
    );
  }
}

export default HomePage;
