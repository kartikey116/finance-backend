import { hasPermission } from "../utils/permisssion.js";

export const allowedRoles = (permission) =>{
    return (req, res, next) => {
        if (hasPermission(req.user, permission)) {
            next();
        } else {
            return res.status(403).json({
                message: "You are not authorized to perform this action"
            });
        }
    };
}