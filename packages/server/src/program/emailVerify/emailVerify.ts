import nodemailer from 'nodemailer';

import {ERROR_CODE, SERVER_ERROR, SUCCESS, SUCCESS_CODE} from '../dbMethod';
import {Response, UserFactor} from '../types';

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
  code: number,
): Promise<Response> {
  const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: 'v2pass@outlook.com',
      pass: 'Fe3wVuw@hkx.XX-@*H8H',
    },
  });
  const info = await transporter.sendMail({
    from: '"v2pass" <v2pass@outlook.com>',
    to: `${email}`,
    subject: `Verification code: ${code}`,
    text: `Enter this verification code to continue setting up your v2pass account: ${code}`,
  });

  if (info) {
    return resSuccess;
  }

  return resError;
}

export function createRandomCode(): number {
  return Math.floor(Math.random() * 100000);
}
