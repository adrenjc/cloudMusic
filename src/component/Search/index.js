/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { inSearch } from '../../api/index';
import moment from 'moment';
import { getSongURL } from '../../api/index';
import PubSub from 'pubsub-js';
import { message } from 'antd';
import { setAudioUrl } from '../../redux/action/Audio_action';
import { getList } from '../../redux/action/Playlist_action';

const Search = (props) => {
  // const [loding, setLoding] = useState(false);
  const [count, setCount] = useState(); //设置歌曲数量
  // const [getData, setGetData] = useState(null);
  const [song, setSong] = useState(null); //为了匹配Audio组件多次一举的操作 看看就好
  const [info, setInfo] = useState(); //同上
  const {
    match: {
      params: { value },
    },
  } = props;

  const getHighlight = (data) => {
    let reg = new RegExp(value, 'ig');
    let newData2 = data.match(reg);
    let newData = data.replace(
      reg,
      `<span class='search-highLight'>${newData2}</span>`
    );
    return newData;
  };
  useEffect(() => {
    const featchData = async () => {
      // setLoding(true);
      const data = await inSearch(value);
      const {
        data: { result },
      } = data;
      let info = [];
      let song = result.songs.map((items) => {
        const { al, ar, id, name, dt } = items;
        //使用moment插件转换歌曲时长
        info.push(id);
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
      setCount(result.songCount);
      // setGetData(result.songs);
      setSong(song);
      setInfo(info);
      // setLoding(false);
    };
    featchData();
    return () => {};
  }, [value]);

  const doubleClick = async (items) => {
    const value = await getSongURL(items.key);
    const {
      data: { data = {} },
    } = value;

    if (data[0].url === null) {
      message.error('没有版权');
    } else {
      const { setAudioUrl } = props;
      setAudioUrl(data);

      const audio = document.getElementById('audio');
      audio.play();
      PubSub.publish('songID', items);
      PubSub.publish('songAllId', info);
      const { getList } = props;
      getList(song);
    }
  };
  return (
    <div>
      <div className="search-return-box">
        <div className="search-return-data">
          {value}
          <span className="search-return-value">找到{count}首</span>
        </div>
        <div className="search-return-table">
          <div className="search-return-null"></div>
          <div className="search-return-title">音乐标题</div>
          <div className="search-return-artist">歌手</div>
          <div className="search-return-albums">专辑</div>
          <div className="search-return-time">时长</div>
        </div>

        <div className="search-return">
          {song
            ? song.map((items, index) => {
                return (
                  <div
                    className={
                      index % 2 === 0
                        ? 'search-return-deatils'
                        : 'search-return-deatils search-active'
                    }
                    key={index}
                    onDoubleClick={() => {
                      doubleClick(items);
                    }}
                  >
                    <div className="search-deatils-index">
                      {index + 1 < 10 ? '0' + (index + 1) : index + 1}
                    </div>
                    <div
                      className="search-deatils-name"
                      dangerouslySetInnerHTML={{
                        __html: getHighlight(items.name),
                      }}
                    ></div>
                    <div
                      className="search-deatils-artist"
                      dangerouslySetInnerHTML={{
                        __html: getHighlight(items.singer),
                      }}
                    ></div>
                    <div
                      className="search-deatils-albums"
                      dangerouslySetInnerHTML={{
                        __html: getHighlight(items.album),
                      }}
                    ></div>
                    <div className="search-deatils-time">{items.duration}</div>
                  </div>
                );
              })
            : null}

          {/* <div className="search-return-deatils">
            <div className="search-deatils-index">1</div>
            <div className="search-deatils-name">海阔天空</div>
            <div className="search-deatils-artist">Beyond</div>
            <div className="search-deatils-albums">海阔天空</div>
            <div className="search-deatils-time">02:12</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default connect(null, { setAudioUrl, getList })(Search);
