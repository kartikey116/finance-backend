export const ROLE_PERMISSIONS = {
  admin: [
    "CREATE_RECORD",
    "READ_RECORD",
    "UPDATE_RECORD",
    "DELETE_RECORD",
    "READ_ANALYTICS"
  ],

  analyst: [
    "READ_RECORD",
    "READ_ANALYTICS"
  ],

  viewer: [
    "READ_ANALYTICS"   
  ]
};