import { Router } from "express";
import UserService from "../services/user-service";
import asyncHandler from "../utils/asyncHandler";
import validateUser from "../validators/userValidator";
import validateUserUpdate from "../validators/userUpdateValidator";
const router = Router();

// 이메일 중복 검사
router.post(
  "/check-email-duplicate",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
      throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

    const isEmailDuplicate = await UserService.checkEmailDuplicate(email);
    if (isEmailDuplicate) {
      const message = isEmailDuplicate.errorMessage;
      throw { status: 409, message: message };
    }
    res
      .status(200)
      .json({ status: 200, message: "사용 가능한 이메일 주소입니다." });
  }),
);

// 회원 가입 요청
router.post(
  "/sign-up",
  asyncHandler(async (req, res, next) => {
    // 유효성 검사
    const { error, value } = await validateUser(req.body);
    if (error) throw { status: 422, message: "요청한 값을 다시 확인해주세요." };

    const newUser = await UserService.addUser(value);
    if (newUser.errorMessage) {
      const { status, errorMessage } = newUser;
      throw { status, message: errorMessage };
    }
    res
      .status(200)
      .json({ status: 200, message: "회원 가입이 완료되었습니다." });
  }),
);

// 사용자 정보 조회 (jwt 정보 활용 예정)
// :uuid로 받고 role에 따라 분기 처리
router.get(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 헤더 토큰 값 검사
    // const token = req.headers.authorization;
    // token 사용한 인증 및 처리...
    // const jwtCookie = req.cookies.jwt; 쿠키에 저장했다면 이런 방식으로
    const uuid = req.params.uuid;

    // 유저 아이디 고정 (토큰 구현 전)
    const userInfo = await UserService.getUserInfo(uuid);
    if (userInfo.errorMessage) {
      const { status, errorMessage } = userInfo;
      throw { status, message: errorMessage };
    }
    res
      .status(200)
      .json({ status: 200, message: "사용자 조회 성공.", data: userInfo });
  }),
);

// 사용자 정보 수정 (jwt 정보 활용 예정)
router.patch(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 헤더 토큰 값 검사

    // 토큰 구현 이후 header에 토큰 정보를 담아서., role
    const uuid = req.params.uuid;
    const { data } = req.body;

    // 데이터 유효성 검사
    const { error, value } = await validateUserUpdate(data);
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    // id, update data
    const updateUser = await UserService.setUserInfo({ uuid, value });
    // update된 값을 바로 반환할지, 명시적인 rest api 대로 처리할지
    if (updateUser.errorMessage) {
      const { status, errorMessage } = updateUser;
      throw { status, message: errorMessage };
    }
    res.status(200).json({ status: 204, message: "사용자 정보 수정 성공." });
  }),
);

// 사용자 삭제 (회원 탈퇴) (jwt 정보 활용 예정)
router.delete(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 헤더 토큰 값 검사

    // 토큰 구현 이후 header에 토큰 정보를 담아서.
    console.log(req.headers);
    const uuid = req.params.uuid;

    const deleteUser = await UserService.deleteUser(uuid);
    if (deleteUser.errorMessage) {
      const { status, errorMessage } = deleteUser;
      throw { status, message: errorMessage };
    }
    res.status(200).json({ status: 204, message: "사용자 삭제 성공." });
  }),
);

export default router;
