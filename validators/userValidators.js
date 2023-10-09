import Joi from "joi";
import { userRole } from "../constants";

const { USER, ADMIN } = userRole;

const passwordPattern = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,15}$/;
const phoneNumberPattern = /^\d{3}-\d{3,4}-\d{4}$/;
const namePattern = /^[a-zA-Z가-힣0-9]{2,12}$/;
const disallowedCharsRegex = /^[^'"]*$/;

const emailJoi = Joi.string().min(10).max(30).email().trim();
const passwordJoi = Joi.string().min(8).max(30).regex(disallowedCharsRegex).trim();
const addressJoi = Joi.string();
const phoneJoi = Joi.string().regex(phoneNumberPattern);
const nameJoi = Joi.string().max(8).allow("");
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
  name: nameJoi,
});

const userUpdateJoiSchema = Joi.object({
  password: passwordJoi,
  address: addressJoi,
  phone: phoneJoi,
  name: nameJoi,
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
  const { name } = user;
  name = name || "";
  return userJoiSchema.validate(user);
}

// 회원 정보 수정 데이터 검증
async function validateUserUpdate(user) {
  return userUpdateJoiSchema.validate(user);
}

export { validateEmail, validateLogin, validateUser, validateUserUpdate };
