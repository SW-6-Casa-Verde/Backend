import { userRole } from "../constants";

export default function checkAuth(adminUser, decodedToken, clientUuid) {
    if (adminUser.role === userRole.ADMIN) return;
    else if (decodedToken.uuid !== clientUuid) {
        return { status: 401, message: "Unauthorized" };
    }
    return;
}