import React, { Component } from 'react';
import './index.css';
import './icon.css';
import { loginStatus, getPlaylist } from '../../api/index.js';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

// import { playlistID } from './config';

const { SubMenu } = Menu;

export default class Index extends Component {
  componentDidMount() {
    this.init();
  }

  state = {
    name: '',
    userId: '',
    menuList: [],
  };

  init = async () => {
    await this.getLoginStatus();
    await this.getPlayListInfo();
  };

  getLoginStatus = async () => {
    const statusResult = await loginStatus();

    const { data: { data: { profile = {} } = {} } = {} } = statusResult;

    const { nickname: name, userId } = profile;

    // console.log('profile', profile);

    this.setState({ name, userId });
  };

  getPlayListInfo = async () => {
    const { userId } = this.state;

    const result = await getPlaylist(userId);
    const value = result.data.playlist;
    this.setState({ menuList: value });
  };

  //获取歌单
  getMenuNodes = () => {
    const { menuList } = this.state;
    return menuList.map((items) => {
      if (items.subscribed === false) {
        return (
          <Menu.Item
            key={items.id}
            style={{
              backgroundColor: '#202020',
              margin: '0',
              fontSize: '12px',
              padding: '0px 0px 0px 12px',
              // paddingRight: '12px',
            }}
            className="abc"
          >
            <i className="iconfont">&#xe60f;</i>
            <Link
              to={`/App/playlist/${items.id}`}
              className="asd"
              style={{
                fontSize: '14px',
                position: 'relative',
                right: '18px',
                top: '2px',
              }}
            >
              <span className="text">{items.name}</span>
            </Link>
          </Menu.Item>
        );
      }
      // return {};
    });
  };

  getMenuNodes1 = () => {
    const { menuList } = this.state;
    // console.log(menuList);
    return menuList.map((items) => {
      if (items.subscribed === true) {
        return (
          <Menu.Item
            key={items.id}
            style={{
              backgroundColor: '#202020',
              margin: '0',
              fontSize: '12px',
              padding: '0px 0px 0px 18px',
              // paddingRight: '12px',
            }}
            className="abc"
          >
            <i className="iconfont">&#xe60f;</i>
            <Link
              to={`/App/playlist/${items.id}`}
              className="asd"
              style={{
                fontSize: '14px',
                position: 'relative',
                right: '18px',
                top: '2px',
              }}
            >
              <span className="text">{items.name}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  render() {
    const { name } = this.state;

    return (
      <div>
        <div className="side-nav">
          <div className="side-user">
            <div className="user-avatar"></div>
            <div className="user">{name}</div>
          </div>
          <div className="side-page">
            <Menu
              onClick={this.handleClick}
              style={{
                width: '200px',
                color: '#a7a7a7',
                backgroundColor: '#202020',
                fontSize: '12px',
              }}
              mode="inline"
              theme="dark"
            >
              <Menu.Item key="1">
                <Link
                  to="/App/home"
                  className="asd"
                  style={{
                    fontSize: '12px',
                    position: 'relative',
                    right: '11px',
                  }}
                >
                  首页
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link
                  to="/App/playlist"
                  className="asd"
                  style={{
                    fontSize: '12px',
                    position: 'relative',
                    right: '11px',
                  }}
                >
                  发现音乐
                </Link>
              </Menu.Item>
              <SubMenu key="sub3" title="创建的歌单">
                {this.getMenuNodes()}
              </SubMenu>
              <SubMenu key="sub4" title="收藏的歌单">
                {this.getMenuNodes1()}
              </SubMenu>
            </Menu>
          </div>
          {/* <div className="home">123123</div> */}
        </div>
      </div>
    );
  }
}
