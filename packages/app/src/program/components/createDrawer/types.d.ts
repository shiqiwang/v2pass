import Password from '../../types/password';
import Folder from '../../types/folder';
import Vault from '../../types/vault';
import {FormComponentProps} from 'antd/lib/form';

export interface DrawerProps {
  visible: boolean;
  title?: string;
  onClose(): void;
  type: string;
}
