import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../../db";
import { strategiesEnum } from "../../constants";

const config = {
    usernameField: 'email',
    passwordField: 'password'
};

const local = new LocalStrategy(config, async (email, password, done) => {
    try {
        const errorJson = { status: 401, message: "로그인에 실패하였습니다." };

        const isEmailMatch = await User.findByEmail(email);
        if (!isEmailMatch) throw errorJson;

        const isPasswordMatch = bcrypt.compareSync(password, isEmailMatch.password);
        if (!isPasswordMatch) throw errorJson;

        const { uuid, role, name } = isEmailMatch;
        const userInfo = {
            uuid, role, name, provider: strategiesEnum.LOCAL 
        };
        // 세션스토어 미리 만들어 두어야 함.
        // 세션아이디를 만듦. (자동 생성이 있다는데?)
        // 세션스토어에 세션아이디와 유저의 정보를 저장

        // 세션아이디로 토큰을 만들어 쿠키로 보냄 (토큰으로 만드는걸 우리가 해야할 듯?)

        done(null, userInfo);
    } catch (error) {
        done(error, null);
    }
})

export default local;