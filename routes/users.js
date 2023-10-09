import { Router } from "express";
import { UserService } from "../services";
import asyncHandler from "../utils/asyncHandler";
import { verifyJWT } from "../utils/jwt";
import checkAuth from "../utils/checkAuth";
import { validateUserUpdate } from "../validators";

const usersRouter = Router();

// 사용자 정보 조회 (jwt 정보 활용 예정)
// :uuid로 받고 role에 따라 분기 처리
usersRouter.get(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 사용자 일치 여부 확인
    const decodedToken = await verifyJWT(req.token);
    const clientUuid = req.params.uuid;
    const currentUser = req.user;
    const authResult = checkAuth(currentUser, decodedToken, clientUuid);
    if (authResult) {
      const { status, message } = authResult;
      throw { status, message };
    }

    const userInfo = await UserService.getUserInfo(clientUuid);
    if (userInfo.errorMessage) {
      const { status, errorMessage } = userInfo;
      throw { status, message: errorMessage };
    }
    res.status(200).json({ status: 200, message: "사용자 조회 성공.", data: userInfo });
  })
);

// 사용자 정보 수정 (jwt 정보 활용 예정)
usersRouter.patch(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 사용자 일치 여부 확인
    const decodedToken = await verifyJWT(req.token);
    const clientUuid = req.params.uuid;
    const currentUser = req.user;
    const authResult = checkAuth(currentUser, decodedToken, clientUuid);
    if (authResult) {
      const { status, message } = authResult;
      throw { status, message };
    }

    const { data } = req.body;
    // 데이터 유효성 검사
    const { error, value } = await validateUserUpdate(data);
    if (error) throw { status: 400, message: "요청한 값을 다시 확인해주세요." };

    const updateUser = await UserService.setUserInfo({ currentUser, clientUuid, value });
    if (updateUser.errorMessage) {
      const { status, errorMessage } = updateUser;
      throw { status, message: errorMessage };
    }
    
    res.status(200).json({ status: 204, message: "사용자 정보 수정 성공." });
  })
);

// 사용자 삭제 (회원 탈퇴) (jwt 정보 활용 예정)
usersRouter.delete(
  "/:uuid",
  asyncHandler(async (req, res, next) => {
    // 사용자 일치 여부 확인
    const decodedToken = await verifyJWT(req.token);
    const clientUuid = req.params.uuid;
    const currentUser = req.user;
    const authResult = checkAuth(currentUser, decodedToken, clientUuid);
    if (authResult) {
      const { status, message } = authResult;
      throw { status, message };
    }

    const deleteUser = await UserService.deleteUser(clientUuid);
    if (deleteUser.errorMessage) {
      const { status, errorMessage } = deleteUser;
      throw { status, message: errorMessage };
    }

    res.status(200).json({ status: 204, message: "사용자 삭제 성공." });
  })
);

export { usersRouter };
