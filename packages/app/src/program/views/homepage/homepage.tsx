import React, {Component, ReactNode} from 'react';

import FolderDetail from '../../components/folderDetail';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList';
import PasswordSearch from '../../components/passwordSearch';

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
