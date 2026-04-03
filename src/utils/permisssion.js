import { ROLE_PERMISSIONS } from "./roles.js";

export const hasPermission = (user, requiredPermission) => {
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];

  const userPermissions = [
    ...new Set([...rolePermissions, ...user.permissions])
  ];

  return userPermissions.includes(requiredPermission);
};