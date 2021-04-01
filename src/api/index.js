import ajax from './ajax';

// const url = 'https://adrenjc-cloud-music-api.vercel.app';
// const URL = 'http://localhost:3000';
// const URL = 'https://adrenjc-cloud-music-api.vercel.app';
const URL = '/api1';

export function reqLogin(phone, password, timestamp) {
  return ajax(URL + '/login/cellphone', { phone, password, timestamp }, 'POST');
}

export function loginStatus() {
  return ajax(URL + '/login/status', {}, 'GET');
}

export function getPlaylist(uid) {
  return ajax(URL + '/user/playlist', { uid }, 'GET');
}

//首页推荐歌单
export function recommendPlayList() {
  return ajax(URL + '/recommend/resource', {}, 'GET');
}

export function getPlaylistData(id) {
  return ajax(URL + '/playlist/detail', { id }, 'GET');
}

//获取歌曲详情
export function getSongname(ids) {
  return ajax(URL + '/song/detail', { ids }, 'GET');
}

export function getSongURL(id) {
  return ajax(URL + '/song/url', { id }, 'GET');
}

export const getBanner = () => {
  return ajax(URL + '/banner', {}, 'GET');
};
