const getters = {
  token: state => state.user.token,
  setting: state => state.appsystem.setting,
  user: state => state.user,
  roles: state => state.user.roles,
  userrights: state => state.user.userrights
}
export default getters
