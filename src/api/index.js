import ajax from './ajax';

// const url = 'https://adrenjc-cloud-music-api.vercel.app';
// const URL = 'http://localhost:3000';
// const URL = 'https://adrenjc-cloud-music-api.vercel.app';
const URL = '/api1';

//登陆接口
export function reqLogin(phone, password) {
  return ajax(URL + '/login/cellphone', { phone, password }, 'GET');
}

//刷新登陆状态
export function reFresh() {
  return ajax(URL + '/login/refresh', {}, 'GET');
}

//登陆状态
export function loginStatus(timestamp) {
  return ajax(URL + '/login/status', { timestamp }, 'GET');
}

//获取用户歌单
export function getPlaylist(uid) {
  return ajax(URL + '/user/playlist', { uid }, 'GET');
}

//首页推荐歌单
export function recommendPlayList() {
  return ajax(URL + '/personalized', {}, 'GET');
}

//登陆后获取推荐歌单
export const getUserRecommendPlaylist = () => {
  return ajax(URL + '/recommend/resource', {}, 'GET');
};

//获取歌曲详情
export function getPlaylistData(id) {
  return ajax(URL + '/playlist/detail', { id }, 'GET');
}

//获取歌曲详情
export function getSongname(ids) {
  return ajax(URL + '/song/detail', { ids }, 'GET');
}

//获取歌曲播放URL
export function getSongURL(id) {
  return ajax(URL + '/song/url', { id }, 'GET');
}

//获取轮播图
export const getBanner = () => {
  return ajax(URL + '/banner', {}, 'GET');
};

//获取歌词
export const getLrc = (id) => {
  return ajax(URL + '/lyric', { id }, 'GET');
};

//获取歌曲评论
export const getComment = (id, offset) => {
  return ajax(URL + '/comment/music', { id, offset }, 'GET');
};

//获取相关音乐
export const getRelatedSong = (id) => {
  return ajax(URL + '/simi/song', { id }, 'GET');
};

//退出登陆
export const logOut = () => {
  return ajax(URL + '/logout', {}, 'GET');
};

export const search = () => {
  return ajax(URL + '/cloudsearch', {}, 'GET');
};

//搜索排行榜
export const getSearchHot = () => {
  return ajax(URL + '/search/hot/detail', {}, 'GET');
};

//搜索关键字
export const getSearchSuggest = (keywords) => {
  return ajax(URL + '/search/suggest', { keywords }, 'GET');
};
