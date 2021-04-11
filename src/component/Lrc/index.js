/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import img from './png.png';
import { getLrc } from '../../api/index';

const Lrc = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(null); //保存歌词和对应时间戳到本地
  const [lrc, setLrc] = useState(null); //保存分离出来的个歌词
  const [currentLrc, setCurrentLrc] = useState(0); //当前歌词的的索引值
  const ref = useRef();
  const LRC = useRef();
  const lrcBox = useRef(); //获取滚动DOM元素
  const lrcIndex = useRef();

  const lrcsrcoll = async () => {
    if (props.data !== null) {
      if (ref.current === props.data[0].id) {
        return null;
      } else {
        ref.current = props.data[0].id;
        setId(ref.current); //保存歌词到本地
        const result = await getLrc(ref.current);
        const value = result && result.data.lrc.lyric;

        LRC.current = parseLyric(value);
        // const data = LRC.current;

        let lrc = [];
        for (let i = 0; i < LRC.current.length; i++) {
          lrc.push(LRC.current[i].content);
          setLrc(lrc); //保存分离出来的歌词
        }
        // console.log(i);
        const audio = document.querySelector('#audio');
        // console.log(audio);

        audio.addEventListener('timeupdate', (event) => {
          // let audioTime = moment(audio.currentTime * 1000).format('mm:ss');
          let audioTime = audio.currentTime * 1000;

          for (let i = 0; i < LRC.current.length; i++) {
            // let lrcAlltime = moment(LRC.current[i].time).format('mm:ss');

            if (LRC.current[i].time <= audioTime) {
              // lrcIndex.current = LRC.current.indexOf(LRC.current[i]);
              if (LRC.current[i].state === false) {
                setCurrentLrc(LRC.current.indexOf(LRC.current[i]));
                lrcIndex.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });

                LRC.current[i].state = true;
              } else if (LRC.current[i].state === true) {
                continue;
              }
            }
          }
        });
        audio.addEventListener('seeked', () => {
          for (let i = 0; i < LRC.current.length; i++) {
            LRC.current[i].state = false;
          }
        });
      }
    }
  };

  useEffect(async () => {
    lrcsrcoll();
  }, [props.data]);

  //处理lrc歌词
  const parseExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  function parseLyric(lyricString) {
    const lineStrings = lyricString.split('\n');
    const lyrics = [];
    for (let line of lineStrings) {
      if (line) {
        if (line.replace(parseExp, '').trim() === '') {
          continue;
        }

        const lrcContent = line.replace(parseExp, '').trim();
        const timeResult = parseExp.exec(line);
        // console.log(lrcContent);
        const milliseconds =
          timeResult[3].length === 3 ? timeResult[3] * 1 : timeResult[3] * 10;
        const lrcTime =
          timeResult[1] * 60 * 1000 + timeResult[2] * 1000 + milliseconds;
        // const LrcTime = moment(lrcTime).format('mm:ss')
        lyrics.push({
          content: lrcContent,
          time: lrcTime,
          state: false,
        });
        // lyrics.content.remove('');
      }
    }
    lyrics.sort((a, b) => {
      return a.time - b.time;
    });

    return lyrics;
  }

  return (
    <div>
      <div
        className="lrc"
        style={props.state ? { display: 'block' } : { display: 'none' }}
      >
        {props.data !== null ? (
          <div className="lrc-box">
            <img
              src={img}
              alt=""
              className="background"
              style={
                props.isPlay
                  ? {
                      animation: 'rotate 20s linear infinite',
                      animationPlayState: 'running',
                    }
                  : {
                      animation: 'rotate 20s linear infinite',
                      animationPlayState: 'paused',
                    }
              }
            ></img>
            <div className="box-img">
              <div className="lrc-box-img">
                <img
                  src={props.data[0].al.picUrl}
                  alt=""
                  style={
                    props.isPlay
                      ? {
                          animation: 'rotate 20s linear infinite',
                          animationPlayState: 'running',
                        }
                      : {
                          animation: 'rotate 20s linear infinite',
                          animationPlayState: 'paused',
                        }
                  }
                ></img>
              </div>
            </div>
            <div className="lrc-list">
              <div className="lrc-list-box">
                <div className="lrc-title">{props.data[0].name}</div>
                <div className="lrc-data">
                  <div className="lrc-album">
                    <div>专辑:</div>
                    <span>{props.data[0].al.name}</span>
                  </div>
                  <div className="lrc-singer">
                    <div>歌手:</div>
                    <span>{props.data[0].ar[0].name}</span>
                  </div>
                </div>
              </div>
              <div className="lrc-lrc">
                <div className="lrc-lrc-box" ref={lrcBox}>
                  {lrc === null
                    ? null
                    : lrc.map((items, index) => {
                        return (
                          <p
                            key={index}
                            className={index === currentLrc ? 'lrc-active' : ''}
                            ref={index === currentLrc ? lrcIndex : null}
                          >
                            {items}
                          </p>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Lrc;
