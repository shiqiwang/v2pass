import React, {Component, ReactNode} from 'react';
import PasswordSearch from '../../components/passwordSearch/passwordSearch';
import PasswordList from '../../components/passwordList/passwordList';
import PasswordDetail from '../../components/passwordDetail/passwordDetail';
import FolderDetail from '../../components/folderDetail/folderDetail';

class HomePage extends Component {
  render(): ReactNode {
    return (
      <div class="homePage">
        <PasswordSearch />
        <PasswordList />
        <PasswordDetail />
        <FolderDetail />
      </div>
    );
  }
}

export default HomePage;
