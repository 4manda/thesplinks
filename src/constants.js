import XRegExp from 'xregexp';

export const REG_FULL_NAME = XRegExp('^\\pL+ \\pL+$');
export const REG_NAME = XRegExp('^[\\pL- ]+$');
export const REG_INITIAL = /^[a-zA-Z]?$/;
export const REG_PHONE = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
export const REG_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const REG_EMAIL_INPUT = /^\w+[\w@.]*$/;
export const REG_USERNAME = /^\w+$/;

export const MAX_MESSAGE_LENGTH = 500;
export const MOBILE_SCREEN_WIDTH = 1024;
