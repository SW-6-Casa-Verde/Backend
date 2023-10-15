import { userRole } from "../constants";

export default function checkAuth(user, clientUuid) {
    const { role, uuid } = user;
    if (role === userRole.ADMIN) return;
    else if (uuid !== clientUuid) {
        return { status: 401, message: "Unauthorized" };
    }
    return;
}