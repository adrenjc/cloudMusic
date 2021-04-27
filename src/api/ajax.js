import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
  return new Promise((resolve, rej) => {
    axios.defaults.withCredentials = true;
    let promise;
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data,
      });
    } else if (type === 'POST') {
      promise = axios.post(url, data);
    }

    promise
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        message.error('请求出错了:' + err.message);
      });
  });
}
