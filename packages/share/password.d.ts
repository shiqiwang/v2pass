/**
 * 使用Password接口时，前端和后端都需要引入_id，folderId, targetId
 */
export default Password;

interface Password {
  items: PasswordItem[];
  collect: boolean; // 是否被收藏
  avatar: File; // 密码项头像文件
  pass_name: string; // 整个密码项的名字
} // 这好像不对吧...???

type PasswordItem =
  | NameInfoItem
  | PhoneNumberInfoItem
  | EmailInfoItem
  | TextInfoItem
  | PasswordInfoItem
  | DateInfoItem
  | NoteInfoItem;

interface NameInfoItem {
  type: 'userName';
  label: string;
  value: string;
}
interface PhoneNumberInfoItem {
  type: 'phone';
  label: string;
  value: number; // 加入电话号码校验
}

interface EmailInfoItem {
  type: 'email';
  label: string;
  value: string; // 加入邮箱校验
}

interface TextInfoItem {
  type: 'text';
  label: string;
  value: string;
}

interface PasswordInfoItem {
  type: 'password';
  label: string;
  value: string;
}

interface DateInfoItem {
  type: 'date';
  label: string;
  value: Date;
}

interface OneTimePasswordInfoItem {
  // 像谷歌验证码这种要如何做呢
}

interface AddressInfoItem {
  type: 'address';
  label: string;
  value: string;
}

interface NoteInfoItem {
  type: 'note';
  label: string;
  value: string;
}
