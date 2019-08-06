import {RouteComponentProps} from 'boring-router-react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component, ReactNode} from 'react';

import FolderDetail from '../../components/folderDetail';
import PasswordDetail from '../../components/passwordDetail';
import PasswordList from '../../components/passwordList';
import PasswordSearch from '../../components/passwordSearch';
import NewFolder from '../../components/public/newFolder';
import NewItem from '../../components/public/newItem';
import {Router} from '../../router';

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
  @observable
  private newFolderDrawerVisible = false;
  @observable
  private newItemDrawerVisible = false;

  render(): ReactNode {
    let {match} = this.props;

    console.log(match.$params.id);

    return (
      <div className="homePage">
        <button onClick={this.onNewFolderButtonClick}>show new folder</button>
        <button onClick={this.onNewItemButtonClick}>show new Item</button>
        <NewFolder
          drawer={{
            visible: this.newFolderDrawerVisible,
            onClose: this.onNewFolderDrawerClose,
          }}
        />
        <NewItem
          drawer={{
            visible: this.newItemDrawerVisible,
            onClose: this.onNewItemDrawerClose,
          }}
        />
        <PasswordSearch />
        <PasswordList />
        <PasswordDetail password={password} />
        <FolderDetail folderName="folderName" folderDetail="folder detail" />
      </div>
    );
  }

  private onNewFolderDrawerClose = (): void => {
    this.toggleNewFolderDrawer(false);
  };

  private onNewFolderButtonClick = (): void => {
    this.toggleNewFolderDrawer(true);
  };

  private onNewItemDrawerClose = (): void => {
    this.toggleNewItemDrawer(false);
  };

  private onNewItemButtonClick = (): void => {
    this.toggleNewItemDrawer(true);
  };

  @action
  private toggleNewFolderDrawer(visible: boolean): void {
    this.newFolderDrawerVisible = visible;
  }

  @action
  private toggleNewItemDrawer(visible: boolean): void {
    this.newItemDrawerVisible = visible;
  }
}

export default HomePage;
