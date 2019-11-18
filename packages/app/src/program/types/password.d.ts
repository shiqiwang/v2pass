export interface Password {
  id: string;
  folderId: string;
  vaultId: string;
  pass_name: string;
  collect: boolean;
  targetId: string;
  items: PasswordItem[];
}

export type PasswordItem =
  | NameInfoItem
  | PhoneNumberInfoItem
  | EmailInfoItem
  | TextInfoItem
  | PasswordInfoItem
  | DateInfoItem
  | NoteInfoItem;

interface NameInfoItem {
  id: string;
  type: 'userName';
  label: string;
  value: string;
}
interface PhoneNumberInfoItem {
  id: string;
  type: 'phone';
  label: string;
  value: string; // 加入电话号码校验
}

interface EmailInfoItem {
  id: string;
  type: 'email';
  label: string;
  value: string; // 加入邮箱校验
}

interface TextInfoItem {
  id: string;
  type: 'text';
  label: string;
  value: string;
}

interface PasswordInfoItem {
  id: string;
  type: 'password';
  label: string;
  value: string;
}

interface DateInfoItem {
  id: string;
  type: 'date';
  label: string;
  value: string;
}

interface OneTimePasswordInfoItem {
  // 像谷歌验证码这种要如何做呢
}

interface AddressInfoItem {
  id: string;
  type: 'address';
  label: string;
  value: string;
}

interface NoteInfoItem {
  id: string;
  type: 'note';
  label: string;
  value: string;
}
