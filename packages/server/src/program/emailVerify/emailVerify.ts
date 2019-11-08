import nodemailer from 'nodemailer';

import {config} from '../config';
import {ERROR_CODE, SERVER_ERROR, SUCCESS, SUCCESS_CODE} from '../dbMethod';
import {Response, UserFactor} from '../types';

const {user, pass} = config.emailAuth;

const resError: Response = {
  code: ERROR_CODE,
  data: SERVER_ERROR,
};

const resSuccess: Response = {
  code: SUCCESS_CODE,
  data: SUCCESS,
};

export async function emailVerify(
  email: UserFactor['email'],
  code: string,
): Promise<Response> {
  const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user,
      pass,
    },
  });
  const info = await transporter.sendMail({
    from: `"v2pass" <${user}>`,
    to: `${email}`,
    subject: `Verification code: ${code}`,
    text: `Enter this verification code to continue setting up your v2pass account: ${code}`,
  });

  if (info) {
    return resSuccess;
  }

  return resError;
}

export function createRandomCode(): string {
  const num = Math.floor(Math.random() * 100000).toString();
  const str = num.toString().padStart(5, '0');
  return str;
}
