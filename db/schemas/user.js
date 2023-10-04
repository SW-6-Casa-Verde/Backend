import { Schema } from 'mongoose';
import randStr from '../../utils/randomString';
import { userRole } from '../../constants';

const UserSchema = new Schema({
    // 내부적 유저 식별 필드
    id: { 
        type: String, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    phone: {
        type: String, 
        required: true
    },
    name: {
        type: String, 
        default: () => `${randStr(7)}-user`
    },
    role: { 
        type: String, 
        enum: userRole
    },
});

export default UserSchema;