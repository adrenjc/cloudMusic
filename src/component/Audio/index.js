import React, { Component } from 'react';
import './index.css';
// import { CaretRightOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';

var token; //获取被双击的歌曲

var token2; //获取被双击的歌曲所在歌单的所有歌曲ID

export default class Audio extends Component {
  componentDidMount() {
    //（待修改）
    token = PubSub.subscribe('songID', async (_, data) => {
      await this.setState({ details: data, isPlay: true }, () => {});
    });

    //订阅被双击的歌曲所在的歌单的所有歌曲ID 将当前被双击的歌曲索引值保存在state
    token2 = PubSub.subscribe('songAllId', async (_, data) => {
      const result = data.indexOf(this.state.details.key);
      await this.setState({ allSongId: data, audioIndex: result });
      const audio = document.getElementById(`audio`);
      audio.play();
    });
  }

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
      //静音（待完成）
      case 'muted':
        this.setState({
          isMuted: !audio.muted,
        });
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
      await this.setState({ audioIndex: audioIndex + 1, isPlay: true });
      audio.play();
    } else if (audioIndex + 2 > allSongId.length) {
      await this.setState({ audioIndex: 0, isPlay: true });
      audio.play();
    }
  };

  render() {
    const {
      isPlay,
      currentTime,
      allTime,
      isMuted,
      volume,
      progress,
      // details,
      allSongId,
      audioIndex,
    } = this.state;
    const data = { backgroundSize: progress + '% 100%' }; //显示进度条
    const data2 = { backgroundSize: volume + '% 100%' }; //音量

    const url =
      'https://music.163.com/song/media/outer/url?id=' + allSongId[audioIndex];

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

          <div>
            <span className="current">
              {this.millisecondToDate(currentTime) +
                '/' +
                this.millisecondToDate(allTime)}
            </span>
          </div>

          <div
            className="bottom"
            onClick={() => this.controlAudio(isPlay ? 'pause' : 'play')}
          >
            <div className={isPlay ? 'pause' : 'play'} />
          </div>

          {/* <div className="progress"></div> */}

          <i
            className={isMuted ? 'mute' : 'nomute'}
            onClick={() => this.controlAudio('muted')}
          />
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
    );
  }
}
