import session from "express-session";
import urlSafeBase64 from "../utils/urlSafeBase64";

const SESSION_SECRET_KEY = urlSafeBase64(process.env.SESSION_KEY);
const oneHour = 3600000;
const cookieConfig = {
    maxAge: oneHour * 12,
    httpOnly: true,
};

const sessionConfig = { 
    secret: SESSION_SECRET_KEY, 
    resave: false, 
    saveUninitialized: true,
    // cookie: cookieConfig,
    proxy: true,
    // 데이터베이스 같은 곳에도 저장 가능
    store: new session.MemoryStore(),
};

export default sessionConfig;
