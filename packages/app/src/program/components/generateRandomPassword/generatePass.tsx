import {Factor} from './types';

const letters = (() => {
  let tempArray: string[] = [];

  for (let i = 65; i < 91; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  for (let i = 97; i < 123; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  return tempArray;
})();

const numbers = (() => {
  let tempArray: number[] = [];

  for (let i = 0; i < 10; i++) {
    tempArray.push(i);
  }

  return tempArray;
})();

const symbols = (() => {
  let tempArray: string[] = [];

  for (let i = 33; i < 47; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  for (let i = 58; i < 65; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  for (let i = 93; i < 97; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  for (let i = 123; i < 127; i++) {
    tempArray.push(String.fromCharCode(i));
  }

  tempArray.push(String.fromCharCode(91));

  return tempArray;
})();

export function generatePassword(factor: Factor): string {
  // 后面可能需要调整各个类型字符出现的概率，目前字符出现概率太高了，观感不大好
  let sourceArray: (string | number)[] = [];
  const {useLetter, useNumber, useSymbol, length} = factor;

  if (useNumber) {
    sourceArray = [...sourceArray, ...numbers];
  }

  if (useLetter) {
    sourceArray = [...sourceArray, ...letters];
  }

  if (useSymbol) {
    sourceArray = [...sourceArray, ...symbols];
  }

  let randomArray: number[] = [];

  for (let i = 0; i < length; i++) {
    randomArray.push(Math.floor(Math.random() * sourceArray.length));
  }

  return randomArray.map(index => sourceArray[index]).join('');
}

export function generateMasterPassword(): string {
  // 便于记忆的密码
  // 1password 使用了18000+单词，每次随机取4个单词组合，可以借鉴一下，去哪里搞词库？
  return '';
}
