import { Router } from "express";
import UserService from "../services/user-service";
import asyncHandler from "../utils/asyncHandler";
import { verifyJWT } from "../utils/jwt";
import validateUserUpdate from "../validators/userUpdateValidator";
const router = Router();

// 사용자 정보 조회 (jwt 정보 활용 예정)
// :uuid로 받고 role에 따라 분기 처리
router.get(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 사용자 일치 여부 확인
    const decode = await verifyJWT(req.token);
    const uuid = req.params.uuid;

    if (decode.uuid !== uuid) {
      throw { status: 401, message: "Unauthorized" };
    }

    const userInfo = await UserService.getUserInfo(decode.uuid);
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
    // 사용자 일치 여부 확인
    const decode = await verifyJWT(req.token);
    const uuid = req.params.uuid;

    if (decode.uuid !== uuid) {
      throw { status: 401, message: "Unauthorized" };
    }

    const { data } = req.body;

    // 데이터 유효성 검사
    const { error, value } = await validateUserUpdate(data);
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    // id, update data
    const updateUser = await UserService.setUserInfo({
      uuid: decode.uuid,
      value,
    });
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
    // 사용자 일치 여부 확인
    const decode = await verifyJWT(req.token);
    const uuid = req.params.uuid;

    if (decode.uuid !== uuid) {
      throw { status: 401, message: "Unauthorized" };
    }

    const deleteUser = await UserService.deleteUser(decode.uuid);
    if (deleteUser.errorMessage) {
      const { status, errorMessage } = deleteUser;
      throw { status, message: errorMessage };
    }
    res.status(200).json({ status: 204, message: "사용자 삭제 성공." });
  }),
);

export default router;
