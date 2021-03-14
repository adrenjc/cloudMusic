import React, { Component } from 'react';
import './index.css';
import './icon.css';
import Side from '../Sidenav/index';
import Home from '../Home/index';
import PlayList from '../Playlist/index';
import { Redirect, Route } from 'react-router';
// import storageUtils from '../../utils/storageUtils';

export default class Top extends Component {
  render() {
    // const value = memoryUtils.user && memoryUtils.user.account;
    // console.log(value);
    // if (!value) {
    //   // console.log(user.id);
    //   return <Redirect to="/login"></Redirect>;
    // }

    return (
      <div className="app">
        <div className="all-app">
          <div className="top">
            <div className="top-nav">
              <a href=".top">个性推荐</a>
              <a href=".top">歌单</a>
              <a href=".top">主播电台</a>
              <a href=".top">排行榜</a>
              <a href=".top">歌手</a>
              <a href=".top">最新音乐</a>
            </div>
            <div className="top-right">
              <input
                type="text"
                placeholder="&#xe623;&nbsp;搜索"
                className="top-input iconfont"
              ></input>
              <a href=".top" className="iconfont ">
                &#xe8b7;
              </a>
              <a href=".top" className="iconfont ">
                &#xe8b1;
              </a>
              <a href=".top" className="iconfont ">
                &#xe8b9;
              </a>
              <a href=".top" className="iconfont">
                &#xe8b0;
              </a>
            </div>
          </div>
          <Side></Side>
          <Route path="/App/home" component={Home}></Route>
          <Route path="/App/playlist/:id" component={PlayList}></Route>
          <Redirect to="/App/home"></Redirect>
        </div>
      </div>
    );
  }
}
