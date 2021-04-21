import React, { Component } from 'react';
// import ReactDom from 'react-dom';
import { getPlaylistData, getSongname, getSongURL } from '../../api/index';
// eslint-disable-next-line no-unused-vars
import { Button, Menu, Table, Image, Spin, message } from 'antd';
import {
  CaretRightOutlined,
  FolderOpenOutlined,
  ShareAltOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import './index.css';
import PubSub from 'pubsub-js';
import './index.less';
import moment from 'moment';
import { getList } from '../../redux/action/Playlist_action';
import { setAudioUrl } from '../../redux/action/Audio_action';
import { connect } from 'react-redux';
import { AutoSizer, List } from 'react-virtualized';

class PlayList extends Component {
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

  //防止内存泄漏
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
    info: '',
    list: null,
    index: null,
    //搜索关键词
    initArr: [],
    //搜索状态
    searc: false,
  };

  //第一次组件挂载加载歌单
  init = async () => {
    await this.getPlayList();
    await PubSub.subscribe('audioIndex', async (_, data) => {
      await this.setState({ list: data });
    });
  };

  //用于点击歌单后更新歌单
  init2 = async (data) => {
    await this.UpdataPlayList(data);
    await PubSub.subscribe('audioIndex', async (_, data) => {
      await this.setState({ list: data });
    });
  };

  //更新state里 歌单Id
  UpdataPlayList = async (data) => {
    await this.setState({ isLoding: true });
    const value = await getPlaylistData(data);
    const result = value && value.data.playlist;
    //收集歌单所有歌曲详情

    const values = result && result.trackIds;
    let info = [];
    let e = '';
    for (var i = 0; i < values.length; i++) {
      info.push(values[i].id);
      e = info.toString();
    }

    //将当前歌单所有歌曲id传递到Audio组件

    //更新歌单

    this.getSongname(e);

    this.setState({ result, info });
  };

  //获取歌曲 歌名 专辑 歌曲名字 (info 为当前歌单所有歌曲的id)
  getSongname = async (b) => {
    await this.setState({ isLoding: true });
    const value = await getSongname(b);
    const {
      data: { songs = {} },
    } = value;
    const result = songs;
    let arr = [];
    let song = result.map((items) => {
      const { al, ar, id, name, dt } = items;
      //使用moment插件转换歌曲时长
      arr.push(name, al.name, ar[0].name);

      const duration = moment(dt).format('mm:ss');
      return {
        key: id,
        name,
        singer: ar[0].name,
        album: al.name,
        songimg: al.picUrl,
        duration,
      };
    });
    this.setState({ song, isLoding: false, initArr: song });
  };

  //第一次渲染获取歌单ID
  getPlayList = async () => {
    const { data } = this.state;
    this.setState({ isLoding: true });
    const value = await getPlaylistData(data);
    const result = value && value.data.playlist;
    const values = result && result.trackIds;

    let info = [];
    let e = '';
    for (var i = 0; i < values.length; i++) {
      info.push(values[i].id);
      e = info.toString();
    }

    //将当前歌单所有歌曲id传递到Audio组件

    //更新歌单
    this.getSongname(e);
    this.setState({ result, info });
  };

  // 歌曲 ｜ 评论
  handleClick = (e) => {
    this.setState({ current: e.key });
  };

  getSongUrl = async (key) => {
    const value = await getSongURL(key);
    const {
      data: { data = {} },
    } = value;
    console.log(data);
    if (data[0].url === null) {
      message.error('没有版权');
    } else {
      const { setAudioUrl } = this.props;
      setAudioUrl(data);

      const audio = document.getElementById('audio');
      audio.play();
    }
  };

  //给每行上类名设定每行不同的颜色
  // getRowClassName = (record, index) => {
  //   let className = '';
  //   className = index % 2 === 0 ? 'oddRow' : 'evenRow';
  //   return className;
  // };
  // function rowRenderer({key, index, style}) {

  // }

  rowRenderer = ({ key, index, style }) => {
    const { song, list } = this.state;

    return (
      <div key={key} style={style}>
        <div
          onDoubleClick={() => {
            this.doubleClick(song[index]);
          }}
          className={index % 2 === 0 ? 'playlist-song' : 'playlist-song table2'}
        >
          <div className="playlist-index">{index + 1}</div>
          <div
            className={
              song[index].key === list
                ? 'playlist-song-name active-list'
                : 'playlist-song-name'
            }
          >
            {song[index].name}
          </div>
          <div className="playlist-song-singer">{song[index].singer}</div>
          <div className="playlist-song-album">{song[index].album}</div>
          <div className="playlist-song-time">{song[index].duration}</div>
        </div>
        {/* {this.playlist2(song, index)} */}
      </div>
    );
  };

  doubleClick = async (items) => {
    const { song, info } = this.state;
    const value = await getSongURL(items.key);
    const {
      data: { data = {} },
    } = value;
    if (data[0].url === null) {
      message.error('没有版权');
    } else {
      const { setAudioUrl } = this.props;
      setAudioUrl(data);

      const audio = document.getElementById('audio');
      audio.play();
      PubSub.publish('songID', items);
      PubSub.publish('songAllId', info);
      const { getList } = this.props;
      getList(song);
    }
  };

  //歌单搜索(本地搜索)
  search = async (event) => {
    await this.setState({ search: true });
    const {
      target: { value },
    } = event;

    const { initArr } = this.state;
    const name = initArr.filter((items) => {
      return items.name.includes(value);
    });
    const singer = initArr.filter((items) => {
      return items.singer.includes(value);
    });
    const album = initArr.filter((items) => {
      return items.album.includes(value);
    });
    let allArr = name.concat(singer, album);

    let newArr = [...new Set(allArr)];
    this.setState({ song: newArr });
  };
  render() {
    const {
      name,
      trackCount,
      playCount,
      coverImgUrl,
      creator = {},
      createTime,
    } = this.state.result;

    //获取歌单创建时间
    let date = new Date(createTime);
    let Y = date.getFullYear() + '-';
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';

    //表头信息
    // const columns = [
    //   {
    //     title: '歌名',
    //     dataIndex: 'name',
    //     key: 'name',
    //     width: '40%',
    //     ellipsis: true,
    //   },
    //   {
    //     title: '歌手',
    //     dataIndex: 'singer',
    //     key: 'singer',
    //     ellipsis: true,
    //     width: '25%',
    //   },
    //   {
    //     width: '25%',
    //     title: '专辑',
    //     dataIndex: 'album',
    //     key: 'album',

    //     ellipsis: true,
    //   },
    //   {
    //     width: '10%',
    //     title: '时长',
    //     dataIndex: 'duration',
    //     key: 'duration',
    //     ellipsis: true,
    //   },
    // ];
    const { avatarUrl = 'defaultAvatarURL' } = creator;
    const antIcon = <LoadingOutlined style={{ fontSize: 200 }} spin />;

    //是否处于加载状态，当前菜单的key值， 歌曲详情
    const { isLoding, current, song = {} } = this.state;
    return (
      <div className="playlist">
        {isLoding ? (
          <div className="playlist-loding">
            <div>
              <Spin indicator={antIcon} />
            </div>
          </div>
        ) : (
          <div>
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
                </Menu>
                <div className="playlist-search-box">
                  <SearchOutlined
                    style={{
                      color: '#b3b3b3',
                    }}
                  />
                  <input
                    type="text"
                    className="playlist-search"
                    placeholder="搜索歌单音乐"
                    onChange={this.search}
                  ></input>
                </div>

                {/* <Table
                  dataSource={song}
                  columns={columns}
                  pagination={false}
                  size="small"
                  onRow={this.onClickRow}
                  rowClassName={this.getRowClassName}
                  // rowKey = (items)=>{items.id}
                /> */}
              </div>
              {/* <table className="playlist-table">
                <tbody>
                  <tr className="playlist-song">
                    <td className="playlist-song-name">音乐标题</td>
                    <td className="playlist-song-singer">歌手</td>
                    <td className="playlist-song-album">专辑</td>
                    <td className="playlist-song-time">时长</td>
                  </tr>
                </tbody>
              </table> */}
              <div className="playlist-table1">
                <div className="playlist-song1">
                  <div className="playlist-index"></div>
                  <div className="playlist-song-name">音乐标题</div>
                  <div className="playlist-song-singer">歌手</div>
                  <div className="playlist-song-album">专辑</div>
                  <div className="playlist-song-time">时长</div>
                </div>
              </div>
            </div>
            <div className="playlist-table">
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    className="playlist-table"
                    rowCount={song.length}
                    rowHeight={35}
                    rowRenderer={this.rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, {
  getList,
  setAudioUrl,
})(PlayList);
