import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.less';
import store from './redux/store';
import { Provider } from 'react-redux';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

const value = storageUtils.getUser();
memoryUtils.user = value;
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
