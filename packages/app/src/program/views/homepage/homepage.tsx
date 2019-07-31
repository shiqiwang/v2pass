import React, {Component, ReactNode} from 'react';

import FolderDetail from '../../components/folderDetail/folderDetail';
import PasswordDetail from '../../components/passwordDetail/passwordDetail';
import PasswordList from '../../components/passwordList/passwordList';
import PasswordSearch from '../../components/passwordSearch/passwordSearch';

class HomePage extends Component {
  render(): ReactNode {
    return (
      <div className="homePage">
        <PasswordSearch />
        <PasswordList />
        <PasswordDetail />
        <FolderDetail />
      </div>
    );
  }
}

export default HomePage;
