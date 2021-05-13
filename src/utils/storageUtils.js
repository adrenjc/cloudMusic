import store from 'store';

const USER_KEY = 'user-key';
const USER_SUGGEST = 'user-suggest';
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  //保存用户信息
  saveUser(user) {
    store.set(USER_KEY, user);
  },

  saveSearch(value) {
    store.set(USER_SUGGEST, value);
  },
  //获取用户信息
  getUser() {
    return store.get(USER_KEY);
  },

  getSearch() {
    return store.get(USER_SUGGEST);
  },

  removeUser() {
    store.remove(USER_KEY);
  },
  removeSearch() {
    store.remove(USER_SUGGEST);
  },
};
