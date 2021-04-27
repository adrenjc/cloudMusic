import React, { Component } from 'react';
import './index.css';
import './icon.css';
import { loginStatus, getPlaylist, logOut } from '../../api/index.js';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import NormalLoginForm from '../../login/index';
import PubSub from 'pubsub-js';
import memoryUtils from '../../utils/memoryUtils';
import { message } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { setLoginState } from '../../redux/action/LoginState_aciton';
import storageUtils from '../../utils/storageUtils';

// import { playlistID } from './config';

const { SubMenu } = Menu;
let data;
let data2;
let data3;
class Index extends Component {
  componentDidMount() {
    // this.init();
    const { setLoginState } = this.props;
    if (memoryUtils.user) {
      this.init();
      setLoginState(true);
    }
    data = PubSub.subscribe('state', (_, data) => {
      if (this.state.log) {
        this.setState({ log: data });
      }
    });
    data2 = PubSub.subscribe('userData', (_, data) => {
      this.init();
      // this.setState({ status: true });
      setLoginState(true);
    });
    data3 = PubSub.subscribe('logOut', (_, data) => {
      setLoginState(false);
    });
    // if(this.state.status) {}
  }

  componentWillUnmount() {
    PubSub.unsubscribe(data);
    PubSub.unsubscribe(data2);
    PubSub.unsubscribe(data3);
    // this.setState = () => false;
  }

  state = {
    name: '',
    userId: '',
    menuList: [],
    avatarUrl: '',
    status: false,
    log: false,
    loginOut: false,
  };

  init = async () => {
    await this.getLoginStatus();
    await this.getPlayListInfo();
  };

  getLoginStatus = async () => {
    const date = new Date().getTime();

    const statusResult = await loginStatus(date);
    const { data: { data: { profile = {} } = {} } = {} } = statusResult;
    const { nickname: name, userId, avatarUrl } = profile;
    this.setState({ name, userId, avatarUrl });
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
            }}
            className="playlist"
          >
            <Link
              to={`/App/playlist/${items.id}`}
              style={{
                fontSize: '14px',
              }}
            >
              <span className="iconfont">&#xe60f; {items.name}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        return null;
      }
    });
  };

  getMenuNodes1 = () => {
    const { menuList } = this.state;
    return menuList.map((items) => {
      if (items.subscribed === true) {
        return (
          <Menu.Item
            key={items.id}
            style={{
              backgroundColor: '#202020',
              margin: '0',
              fontSize: '12px',
            }}
            className="playlist"
          >
            <Link
              to={`/App/playlist/${items.id}`}
              className="asd"
              style={{
                fontSize: '14px',
              }}
            >
              <span className="iconfont">&#xe60f; {items.name}</span>
            </Link>
          </Menu.Item>
        );
      } else {
        return null;
      }
    });
  };

  LoginUser = () => {
    const { log } = this.state;
    if (log === false) {
      this.setState({ log: true });
    } else {
      this.setState({ log: false });
    }
  };

  loginOut = () => {
    const { loginOut } = this.state;
    if (loginOut) {
      this.setState({ loginOut: false });
    } else {
      this.setState({ loginOut: true });
    }
  };
  loginOutState = async () => {
    const value = await logOut();
    console.log(value);
    message.success('登出');
    storageUtils.removeUser();
    PubSub.publish('logOut', false);
    this.setState({ loginOut: false });
  };
  render() {
    const { name, avatarUrl, log, loginOut } = this.state;
    const { loginstate } = this.props;

    return (
      <div>
        {log === true ? <NormalLoginForm></NormalLoginForm> : null}
        {loginstate ? (
          <div>
            {loginOut ? (
              <div className="login-out" onClick={this.loginOutState}>
                <PoweroffOutlined />
                <span className="out-text">退出登陆</span>
              </div>
            ) : null}

            <div className="side-nav">
              <div className="side-user" onClick={this.loginOut}>
                <div className="user-avatar">
                  <img src={avatarUrl} alt="头像"></img>
                </div>
                <div className="user">{name}</div>
              </div>
              <div className="side-page">
                <Menu
                  style={{
                    width: '200px',
                    color: '#a7a7a7',
                    backgroundColor: '#202020',
                    fontSize: '12px',
                  }}
                  mode="inline"
                  theme="dark"
                  defaultOpenKeys={['sub3', 'sub4']}
                >
                  <Menu.Item key="1">
                    <Link
                      to="/App/home"
                      style={{
                        fontSize: '12px',
                        // position: 'relative',
                        marginRight: '12px',
                      }}
                    >
                      首页
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link
                      to="/App/home"
                      style={{
                        fontSize: '12px',
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
            </div>
          </div>
        ) : (
          <div className="side-nav">
            <div className="side-user" onClick={this.LoginUser}>
              <div className="user-avatar">
                {/* <img src={avatarUrl} alt="头像"></img> */}
              </div>
              <div className="user">未登陆</div>
            </div>
            <div className="side-page">
              <Menu
                style={{
                  width: '200px',
                  color: '#a7a7a7',
                  backgroundColor: '#202020',
                  fontSize: '12px',
                }}
                mode="inline"
                theme="dark"
                defaultOpenKeys={['sub3', 'sub4']}
              >
                <Menu.Item key="1">
                  <Link
                    to="/App/home"
                    style={{
                      fontSize: '12px',
                      // position: 'relative',
                      marginRight: '12px',
                    }}
                  >
                    首页
                  </Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link
                    to="/App/home"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    发现音乐
                  </Link>
                </Menu.Item>
                {/* <SubMenu key="sub2" title="创建的歌单"></SubMenu> */}
              </Menu>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      loginstate: state.loginState.data,
    };
  },
  {
    setLoginState,
  }
)(Index);
