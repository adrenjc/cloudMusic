import React, { Component } from 'react';
import { getPlaylistData, getSongname } from '../../api/index';
import { Button, Menu, Table, Image } from 'antd';
import {
  CaretRightOutlined,
  FolderOpenOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import './index.css';

export default class PlayList extends Component {
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(props) {
    const {
      match: {
        params: { id = {} },
      },
    } = props;
    if (this.props.match.params.id !== id) {
      const { id } = this.props.match.params;
      this.init2(id);
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  state = {
    //路由组件传过来的歌单ID
    data: this.props.match.params.id,
    current: 'mail',
    //用于页面动态显示文本
    result: {},
    //歌单
    song: '',
  };

  //第一次组件挂载加载歌单
  init = async () => {
    await this.getPlayList();
  };

  //用于点击歌单后更新歌单
  init2 = async (data) => {
    await this.UpdataPlayList(data);
    // await loginStatus();
  };

  //获取歌曲 歌名 专辑 歌曲名字 (info 为当前歌单所有歌曲的id)
  getSongname = async (b) => {
    const value = await getSongname(b);
    const {
      data: { songs = {} },
    } = value;
    const result = songs;
    console.log(result);
    let song = result.map((items) => {
      const { al, ar, id, name } = items;
      // return console.log(al.name, );
      return {
        key: id,
        name,
        singer: ar[0].name,
        album: al.name,
      };
    });
    this.setState({ song });
  };

  //更新state里 歌单Id
  UpdataPlayList = async (data) => {
    const value = await getPlaylistData(data);
    const result = value && value.data.playlist;

    //收集歌单所有歌曲详情
    let info = [];
    let b = '';
    const values = result && result.trackIds;
    for (var i = 0; i < values.length; i++) {
      info.push(values[i].id);
      b = info.toString();
    }
    // console.log(b);
    this.getSongname(b);
    // console.log(result.trackIds[0].id);

    // let song = values.map((items) => {
    //   return {
    //     key: items.id,
    //     name: items.name,
    //     singer: items.ar[0].name,
    //     album: items.al.name,
    //   };
    // });

    this.setState({ result });
  };

  //第一次渲染获取歌单ID
  getPlayList = async () => {
    const { data } = this.state;
    const value = await getPlaylistData(data);

    const result = value.data.playlist;
    const values = result && result.tracks;

    let song = values.map((items) => {
      return {
        key: items.id,
        name: items.name,
        singer: items.ar[0].name,
        album: items.al.name,
      };
    });

    this.setState({ result, arr: song });
  };

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };

  render() {
    let { song = {} } = this.state;
    const {
      name,
      trackCount,
      playCount,
      coverImgUrl,
      creator = {},
      createTime,
    } = this.state.result;

    //获取歌单创建时间
    var date = new Date(createTime);
    let Y = date.getFullYear() + '-';
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    const { current } = this.state;

    const columns = [
      // {
      //   title: '',
      //   key: 'key',
      //   width: '5%',
      //   // dataIndex: 'key',

      //   ellipsis: true,
      // },
      {
        title: '歌名',
        dataIndex: 'name',
        key: 'name',
        width: '45%',
        ellipsis: true,
      },
      {
        title: '歌手',
        dataIndex: 'singer',
        key: 'singer',
        ellipsis: true,
        width: '25%',
      },
      {
        width: '30%',
        title: '专辑',
        dataIndex: 'album',
        key: 'album',

        ellipsis: true,
      },
    ];

    const { avatarUrl = 'defaultAvatarURL' } = creator;

    return (
      <div className="playlist">
        <div className="playlist-header">
          <div className="playlist-header-img">
            <Image src={coverImgUrl} />
          </div>
          <div className="playlist-header-username">{name}</div>
          <div className="playlist-header-userimg">
            {avatarUrl && <Image src={creator.avatarUrl} />}
            <Image src={creator && creator.avatarUrl}></Image>
          </div>
          <div className="playlist-header-userid">
            <div>{creator && creator.nickname}</div>
            <div className="playlist-header-creattime">{Y + M + D}创建</div>
          </div>
          <div className="playlist-header-button">
            <Button
              type="primary"
              shape="round"
              icon={<CaretRightOutlined />}
              size="middle"
              style={{
                backgroundColor: '#df4036',
                fontSize: '13px',
                marginRight: '4px',
              }}
            >
              播放全部
            </Button>
            <Button
              shape="round"
              icon={<FolderOpenOutlined />}
              style={{
                backgroundColor: '#202020',
                borderColor: '#949494',
                color: '#949494',
                margin: '0 4px',
              }}
            >
              已收藏(0)
            </Button>
            <Button
              shape="round"
              icon={<ShareAltOutlined />}
              style={{
                backgroundColor: '#202020',
                borderColor: '#949494',
                color: '#949494',
                margin: '0 4px',
              }}
            >
              分享(0)
            </Button>
            <Button
              shape="round"
              icon={<FolderOpenOutlined />}
              style={{
                backgroundColor: '#202020',
                borderColor: '#949494',
                color: '#949494',
                margin: '0 4px',
              }}
            >
              下载到本地
            </Button>
          </div>
          <div className="playlist-header-data">
            歌曲数:<span>{trackCount}</span> &nbsp;&nbsp;播放数:
            <span>{playCount}</span>
          </div>
        </div>
        <div className="playlist-content">
          <div className="playlist-content-title">
            <Menu
              onClick={this.handleClick}
              selectedKeys={[current]}
              mode="horizontal"
              style={{
                backgroundColor: '#252525',
                borderColor: '#303030',
                color: '#b3b3b3',
              }}
            >
              <Menu.Item key="mail">歌曲</Menu.Item>
              <Menu.Item key="app">评论</Menu.Item>
              <Menu.Item key="alipay">收藏者</Menu.Item>
            </Menu>

            <Table
              dataSource={song}
              columns={columns}
              pagination={false}
              size="small"
              onChange={this.handleChange}
              // rowKey = (items)=>{items.id}
            />
          </div>
        </div>
      </div>
    );
  }
}
