import {Binary} from 'crypto';

// 注册时检测重名
function checkUserName(username: string): boolean {
  return true;
}

function register(username: string, email: string, verify: string): boolean {
  return true;
}

function authenticate(
  username: string,
  email: string,
  unlockKey: string,
): object | false {
  // 用户身份验证成功需要返回用户所有数据
  const authenticateResult = true;

  if (authenticateResult) {
    return {};
  }

  return false;
}

// 加密数据应当是二进制类型的吗
// updateData需要验证身份吗
function updateData(
  username: string,
  email: string,
  encryptData: Binary,
  unlockKey?: string,
): boolean {
  return true;
}

// 数据只有在用户身份验证通过后才能给
// 这里返回值应当是用户全部的数据，暂时不知道类型
function getData(username: string, email: string): boolean {
  return true;
}

// 账户设置
function editAccount(
  username: string,
  email: string,
  unlockKey: string,
  newDataObject: object,
  verify: string,
): boolean {
  return true;
}
