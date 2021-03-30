import React, { Component } from 'react';
// import ReactDom from 'react-dom';
import { getPlaylistData, getSongname, getSongURL } from '../../api/index';
import { Button, Menu, Table, Image, Spin } from 'antd';
import {
  CaretRightOutlined,
  FolderOpenOutlined,
  ShareAltOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import './index.css';
import PubSub from 'pubsub-js';
import './index.less';
import moment from 'moment';
import { getList } from '../../redux/action/Playlist_action';
import { setAudioUrl } from '../../redux/action/Audio_action';
import { connect } from 'react-redux';

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
  };

  //第一次组件挂载加载歌单
  init = async () => {
    await this.getPlayList();
  };

  //用于点击歌单后更新歌单
  init2 = async (data) => {
    await this.UpdataPlayList(data);
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

    let song = result.map((items) => {
      const { al, ar, id, name, dt } = items;
      //使用moment插件转换歌曲时长
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
    this.setState({ song, isLoding: false });
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

  onClickRow = (items) => {
    return {
      onDoubleClick: (event) => {
        const { song, info } = this.state;

        this.getSongUrl(items.key);

        PubSub.publish('songID', items);
        PubSub.publish('songAllId', info);
        const { getList } = this.props;
        getList(song);
      },
    };
  };

  getSongUrl = async (key) => {
    const value = await getSongURL(key);
    const {
      data: { data = {} },
    } = value;
    const { setAudioUrl } = this.props;
    setAudioUrl(data);
    const audio = document.getElementById('audio');
    audio.play();
  };

  //给每行上类名设定每行不同的颜色
  getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? 'oddRow' : 'evenRow';
    return className;
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
    var date = new Date(createTime);
    let Y = date.getFullYear() + '-';
    let M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';

    //表头信息
    const columns = [
      {
        title: '歌名',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
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
        width: '25%',
        title: '专辑',
        dataIndex: 'album',
        key: 'album',

        ellipsis: true,
      },
      {
        width: '10%',
        title: '时长',
        dataIndex: 'duration',
        key: 'duration',
        ellipsis: true,
      },
    ];
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

                <Table
                  dataSource={song}
                  columns={columns}
                  pagination={false}
                  size="small"
                  onRow={this.onClickRow}
                  rowClassName={this.getRowClassName}
                  // rowKey = (items)=>{items.id}
                />
              </div>
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
