import React, { Component } from 'react';
import './index.css';
import SideList from '../SideList/index';
import PubSub from 'pubsub-js';
import {
  UnorderedListOutlined,
  SoundOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { setListTrue, setListFalse } from '../../redux/action/SideList_action';
import { setAudioUrl } from '../../redux/action/Audio_action';
import { setAudioDetails } from '../../redux/action/AudioDetails_action';
import { getSongURL, getSongname } from '../../api/index';
import { Image, message } from 'antd';

// import store from '../../redux/store';

let token; //获取被双击的歌曲

let token2; //获取被双击的歌曲所在歌单的所有歌曲ID

class Audio extends Component {
  componentDidMount() {
    this.init();
  }

  init = () => {
    //（待修改）
    token = PubSub.subscribe('songID', async (_, data) => {
      await this.setState({ details: data, isPlay: true });
      const value = await getSongname(data.key);
      const {
        data: { songs = {} },
      } = value;
      const { setAudioDetails } = this.props;
      setAudioDetails(songs);
    });

    //订阅被双击的歌曲所在的歌单的所有歌曲ID 将当前被双击的歌曲索引值保存在state
    token2 = PubSub.subscribe('songAllId', async (_, data) => {
      const {
        details: { key = {} },
      } = this.state;
      const result = data.indexOf(key);
      await this.setState({ allSongId: data, audioIndex: result }, () => {
        PubSub.publish(
          'audioIndex',
          this.state.allSongId[this.state.audioIndex]
        );
      });

      // const { allSongId, audioIndex } = this.state;
      // console.log(allSongId[audioIndex]);
    });
  };
  //取消订阅 防止内存泄漏
  componentWillUnmount() {
    PubSub.unsubscribe(token);
    PubSub.unsubscribe(token2);
  }

  state = {
    isPlay: false, //是否播放
    isMuted: false,
    volume: 100, //音量大小
    allTime: 0, //获取歌曲总时长
    currentTime: 0, //获取当前时间
    progress: 0, //获取进度条百分比
    details: {}, //音乐详情
    allSongId: '', //对列歌单所有ID
    audioIndex: '', //当前播放歌曲在队列歌单ID里的索引值
    iconPlaylist: false, //是否选中队列歌单
  };

  //格式化歌曲时长
  millisecondToDate(time) {
    const second = Math.floor(time % 60);
    let minite = Math.floor(time / 60);
    return `${minite}:${second >= 10 ? second : `0${second}`}`;
  }

  controlAudio(type, value) {
    const audio = document.getElementById(`audio`);
    const data = document.getElementById('time');
    if (data.value > 0) {
      const values = (data.value / this.state.allTime) * 100;
      this.setState({ progress: values });
    }

    //播放器判断
    switch (type) {
      //获取当前播放歌曲总时长
      case 'allTime':
        this.setState({
          allTime: audio.duration,
        });
        break;
      //播放
      case 'play':
        audio.play();
        this.setState({
          isPlay: true,
        });
        break;
      //暂停
      case 'pause':
        audio.pause();
        this.setState({
          isPlay: false,
        });
        break;
      //静音
      case 'muted':
        const { isMuted } = this.state;
        if (isMuted === false) {
          this.setState({
            isMuted: true,
            volume: 0,
          });
        } else {
          this.setState({
            isMuted: false,
            volume: audio.volume * 100,
          });
        }
        audio.muted = !audio.muted;
        break;
      //拖动进度条
      case 'changeCurrentTime':
        this.setState({
          currentTime: value,
        });
        audio.currentTime = value;
        break;

      case 'getCurrentTime':
        this.setState({
          currentTime: audio.currentTime,
        });
        break;
      case 'changeVolume':
        audio.volume = value / 100;
        this.setState({
          volume: value,
          isMuted: !value,
        });
        break;
      default:
        return null;
    }
  }

  //列表播放 自动播放下一首
  controlNextAudio = async () => {
    const { allSongId, audioIndex } = this.state;
    const audio = document.getElementById(`audio`);

    if (audioIndex + 1 < allSongId.length) {
      await this.setState(
        { audioIndex: audioIndex + 1, isPlay: true },
        async () => {
          const { allSongId, audioIndex } = this.state;
          const value = await getSongURL(allSongId[audioIndex]);
          const {
            data: { data = {} },
          } = value;
          const result = await getSongname(allSongId[audioIndex]);
          const {
            data: { songs = {} },
          } = result;
          const { setAudioUrl, setAudioDetails } = this.props;
          await setAudioDetails(songs);
          await setAudioUrl(data);
          PubSub.publish(
            'audioIndex',
            this.state.allSongId[this.state.audioIndex]
          );
          audio.play();
        }
      );
    } else if (audioIndex + 2 > allSongId.length) {
      await this.setState({ audioIndex: 0, isPlay: true }, async () => {
        const { allSongId, audioIndex } = this.state;
        const value = await getSongURL(allSongId[audioIndex]);
        const {
          data: { data = {} },
        } = value;
        const result = await getSongname(allSongId[audioIndex]);
        const {
          data: { songs = {} },
        } = result;
        const { setAudioUrl, setAudioDetails } = this.props;
        await setAudioDetails(songs);
        await setAudioUrl(data);
        PubSub.publish(
          'audioIndex',
          this.state.allSongId[this.state.audioIndex]
        );
        audio.play();
      });
    }
  };

  //控制播放列表是否显示
  setIcon = async () => {
    const { setListFalse, setListTrue } = this.props;
    const { iconPlaylist } = this.state;
    if (iconPlaylist === false) {
      this.setState({ iconPlaylist: true }, () => {
        setListTrue(true);
      });
      // PubSub.publish('listState', true);
    } else {
      this.setState({ iconPlaylist: false }, () => {
        setListFalse(false);
      });
      // PubSub.publish('listState', false);
    }
  };

  //上一首
  previous = async () => {
    const { audio } = this.props;
    const { audioIndex, allSongId } = this.state;
    if (audio.data === null) {
      message.warning('歌单队列里还没有歌曲');
    } else {
      const audio = document.getElementById(`audio`);
      if (audioIndex === 0) {
        const info = allSongId.length - 1;
        this.setState({ audioIndex: info }, async () => {
          const { audioIndex, allSongId } = this.state;
          const value = await getSongURL(allSongId[audioIndex]);
          const {
            data: { data = {} },
          } = value;
          const result = await getSongname(allSongId[audioIndex]);
          const {
            data: { songs = {} },
          } = result;
          const { setAudioUrl, setAudioDetails } = this.props;
          await setAudioDetails(songs);
          await setAudioUrl(data);
          PubSub.publish(
            'audioIndex',
            this.state.allSongId[this.state.audioIndex]
          );
          audio.play();
        });
      } else if (audioIndex - 1 >= 0) {
        console.log(audioIndex);
        await this.setState(
          { audioIndex: audioIndex - 1, isPlay: true },
          async () => {
            const { allSongId, audioIndex } = this.state;
            const value = await getSongURL(allSongId[audioIndex]);
            const {
              data: { data = {} },
            } = value;
            const result = await getSongname(allSongId[audioIndex]);
            const {
              data: { songs = {} },
            } = result;
            const { setAudioUrl, setAudioDetails } = this.props;
            await setAudioDetails(songs);
            await setAudioUrl(data);
            PubSub.publish(
              'audioIndex',
              this.state.allSongId[this.state.audioIndex]
            );
            audio.play();
          }
        );
      }
    }
  };

  //下一首
  next = async () => {
    const { audio } = this.props;
    if (audio.data === null) {
      message.warning('歌单队列里还没有歌曲');
    } else {
      const { allSongId, audioIndex } = this.state;
      const audio = document.getElementById(`audio`);

      if (audioIndex + 1 < allSongId.length) {
        await this.setState(
          { audioIndex: audioIndex + 1, isPlay: true },
          async () => {
            const { allSongId, audioIndex } = this.state;
            const value = await getSongURL(allSongId[audioIndex]);
            const {
              data: { data = {} },
            } = value;
            const result = await getSongname(allSongId[audioIndex]);
            const {
              data: { songs = {} },
            } = result;
            const { setAudioUrl, setAudioDetails } = this.props;
            await setAudioDetails(songs);
            await setAudioUrl(data);
            PubSub.publish(
              'audioIndex',
              this.state.allSongId[this.state.audioIndex]
            );
            audio.play();
          }
        );
      } else if (audioIndex + 2 > allSongId.length) {
        await this.setState({ audioIndex: 0, isPlay: true }, async () => {
          const { allSongId, audioIndex } = this.state;
          const value = await getSongURL(allSongId[audioIndex]);
          const {
            data: { data = {} },
          } = value;
          const result = await getSongname(allSongId[audioIndex]);
          const {
            data: { songs = {} },
          } = result;
          const { setAudioUrl, setAudioDetails } = this.props;
          await setAudioDetails(songs);
          await setAudioUrl(data);
          PubSub.publish(
            'audioIndex',
            this.state.allSongId[this.state.audioIndex]
          );
          audio.play();
        });
      }
    }
  };

  teeeext = () => {
    console.log(this.props.audio);
  };

  render() {
    const {
      isPlay,
      currentTime,
      allTime,
      isMuted,
      volume,
      progress,
    } = this.state;
    const data = { backgroundSize: progress + '% 100%' }; //显示进度条
    const data2 = { backgroundSize: volume + '% 100%' }; //音量

    const { audio } = this.props;
    let url;
    if (audio.data === null) {
      url = null;
    } else {
      url = audio.data[0].url;
    }
    const { audioDetails } = this.props;
    return (
      <div className="all-audio">
        <input
          type="range"
          id="time"
          className="time"
          step="0.01"
          max={allTime}
          value={currentTime}
          style={data}
          onChange={(e) => {
            const value = e.target.value;

            this.controlAudio('changeCurrentTime', value);
          }}
        />
        <div className="audioBox">
          <audio
            // loop={true}
            // crossOrigin="true"
            src={url}
            // preload={true}
            id="audio"
            onCanPlay={() => this.controlAudio('allTime')}
            onTimeUpdate={(e) => this.controlAudio('getCurrentTime')}
            onEnded={() => {
              this.controlNextAudio();
            }}
          >
            您的浏览器不支持 audio 标签。
          </audio>

          {audioDetails.data === null ? (
            <div className="song-details"></div>
          ) : (
            <div className="song-details ">
              <div className="song-details-Img">
                <Image
                  preview={false}
                  src={audioDetails.data[0].al.picUrl}
                  onClick={this.teeeext}
                />
              </div>
              <div className=" song-details-data">
                <span className="details-name">
                  {audioDetails.data[0].name}
                </span>
                <span className="delimiter">-</span>
                <span className="datailis-singer">
                  {'出错啦' && audioDetails.data[0].al.name}
                </span>
              </div>
              <span className="current">
                {this.millisecondToDate(currentTime) +
                  '/' +
                  this.millisecondToDate(allTime)}
              </span>
            </div>
          )}
          <div className="button-area">
            <StepBackwardOutlined
              style={{ color: '#d33a31', fontSize: 22, marginRight: 10 }}
              onClick={this.previous}
            />
            <div
              className="bottom"
              onClick={() => this.controlAudio(isPlay ? 'pause' : 'play')}
            >
              <div className={isPlay ? 'pause' : 'play'} />
            </div>
            <StepForwardOutlined
              style={{ color: '#d33a31', fontSize: 22, marginLeft: 10 }}
              onClick={this.next}
            />
          </div>
          <div className="control-area">
            <div>
              <UnorderedListOutlined
                className={
                  this.state.iconPlaylist
                    ? 'icon-playlist-true'
                    : 'icon-playlist-false'
                }
                onClick={this.setIcon}
              />
            </div>

            <div>
              <SoundOutlined
                className={isMuted ? 'mute' : 'nomute'}
                onClick={() => this.controlAudio('muted')}
              />
            </div>
            <input
              type="range"
              style={data2}
              className="volume"
              onChange={(e) => {
                const {
                  target: { value = {} },
                } = e;

                this.controlAudio('changeVolume', value);
              }}
              value={isMuted ? 0 : volume}
            />
          </div>
        </div>
        <SideList></SideList>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      audio: state.audio,
      audioDetails: state.audioDetails,
    };
  },
  {
    setListFalse,
    setListTrue,
    setAudioUrl,
    setAudioDetails,
  }
)(Audio);
