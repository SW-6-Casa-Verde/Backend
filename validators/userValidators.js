import Joi from "joi";
import { userRole } from "../constants";

const { USER, ADMIN } = userRole;

/**
 * 정규 표현식 패턴을 나타내는 문자열.
 * 
 * 이 정규 표현식은 다음을 나타냅니다:
 * - 최소한 하나의 알파벳 문자(영어 대문자 또는 소문자)를 포함해야 합니다.
 * - 최소한 하나의 특수 문자 (!,@,#,$)를 포함해야 합니다.
 * - 작은따옴표(') 또는 큰따옴표(")를 포함해서는 안 됩니다.
 * - 문자열은 알파벳 문자, 숫자, 특수 문자로만 구성될 수 있으며,
 *   숫자가 포함되어도 되고 포함되지 않아도 됩니다.
 * - 문자열 내의 알파벳과 숫자의 순서는 상관 없습니다.
 *
 * @type {RegExp}
 * @const
 */
const passwordPattern = /^(?=.*[A-Za-z])(?=.*[!@#$])[A-Za-z0-9!@#$]*$/;
/**
 * 문자열 패턴을 나타내는 정규 표현식.
 *
 * 이 정규 표현식은 다음을 나타냅니다:
 * - 문자열은 알파벳 대소문자, 한글, 숫자로 구성될 수 있습니다.
 * - 문자열의 길이는 최소 2자에서 최대 12자까지 허용됩니다.
 *
 * @type {RegExp}
 * @const
 */
const namePattern = /^[a-zA-Z가-힣0-9]{2,12}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;

const emailJoi = Joi.string().trim().min(10).max(30).email();
const passwordJoi = Joi.string().trim().min(8).max(30).regex(passwordPattern);
const addressJoi = Joi.string().trim();
const phoneJoi = Joi.string().trim().regex(phoneNumberPattern);
const nameJoi = Joi.string().trim().max(8);
const roleJoi = Joi.string().valid(USER, ADMIN);

const emailJoiSchema = Joi.object({
  email: emailJoi.required()
});

const loginJoiSchema = Joi.object({
  email: emailJoi.required(),
  password: passwordJoi.required()
});

const userJoiSchema = Joi.object({
  email: emailJoi.required(),
  password: passwordJoi.required(),
  address: addressJoi.required(),
  phone: phoneJoi.required(),
  name: nameJoi.allow(""),
});

const userUpdateJoiSchema = Joi.object({
  password: passwordJoi,
  address: addressJoi,
  phone: phoneJoi,
  name: nameJoi.regex(namePattern),
  role: roleJoi,
});

// 이메일 데이터 검증
async function validateEmail(email) {
  return emailJoiSchema.validate(email);
}

// 로그인 데이터 검증
async function validateLogin(login) {
  return loginJoiSchema.validate(login);
}

// 회원가입 데이터 검증
async function validateUser(user) {
  let { name } = user;
  name = !name ? "" : name;
  return userJoiSchema.validate(user);
}

// 회원 정보 수정 데이터 검증
async function validateUserUpdate(user) {
  return userUpdateJoiSchema.validate(user);
}

export { validateEmail, validateLogin, validateUser, validateUserUpdate };
