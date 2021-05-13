import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.less';
import store from './redux/store';
import { Provider } from 'react-redux';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';
import { loginStatus } from './api/index';

const result = async () => {
  const date = new Date().getTime();
  const value = await loginStatus(date);
  const {
    data: {
      data: { profile },
    },
  } = value;
  if (!profile) {
    console.log('111');
    const value = storageUtils.removeUser();
    const value2 = storageUtils.saveSearch([]);
    memoryUtils.user = value;
    memoryUtils.searchHistory = value2;
  }
};
result();
const value = storageUtils.getUser();
const value2 = storageUtils.getSearch();
memoryUtils.user = value;
memoryUtils.searchHistory = value2;

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
