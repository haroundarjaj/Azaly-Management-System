/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['superAdmin'],
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  onlyGuest: [],
};

export default authRoles;
