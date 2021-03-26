import React, { Component } from 'react';
import './index.css';
import './icon.css';
import Side from '../Sidenav/index';
import Home from '../Home/index';
import Audio from '../Audio/index';
import PlayList from '../Playlist/index';
import { Redirect, Route } from 'react-router';
import { Link } from 'react-router-dom';
// import storageUtils from '../../utils/storageUtils';

export default class All extends Component {
  render() {
    return (
      <div className="app">
        <div className="all-app">
          <div className="top">
            <div className="top-nav">
              <Link to="/App/home" className="nav">
                个性推荐
              </Link>
              <Link to="/App/home" className="nav">
                歌单
              </Link>
              <Link to="/App/home" className="nav">
                最新音乐
              </Link>
            </div>
            <div className="top-right">
              <input
                type="text"
                placeholder="&#xe623;&nbsp;搜索"
                className="top-input iconfont"
              ></input>
            </div>
          </div>
          <Side></Side>
          <Route path="/App/home" component={Home}></Route>
          <Route path="/App/playlist/:id" component={PlayList}></Route>
          <Redirect to="/App/home"></Redirect>
          <Audio></Audio>
        </div>
      </div>
    );
  }
}
