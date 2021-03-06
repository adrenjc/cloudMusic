/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import { message } from 'antd';
import { getSongURL } from '../../api/index';
import { setListFalse } from '../../redux/action/SideList_action';
import { setAudioUrl } from '../../redux/action/Audio_action';
// import PubSub from 'pubsub-js';
// import list from '../../redux/reducers/list_reducers';
// import store from '../../redux/store';

const SideList = (props) => {
  const [title, setTitle] = useState(true);
  const [list, setList] = useState(null);
  const [info, setInfo] = useState(null);

  const [timeState2, setTimeState2] = useState(false);
  const [timeState3, setTimeState3] = useState(false);
  const sideState = useRef();
  const app = useRef();

  useEffect(() => {
    let token = PubSub.subscribe('audioIndex', async (_, data) => {
      setList(data);
    });
    let token2 = PubSub.subscribe('songAllId', (_, data) => {
      setInfo(data);
    });
    return () => {
      PubSub.unsubscribe(token);
      PubSub.unsubscribe(token2);
    };
  }, []);

  useEffect(() => {
    sideState.current = props.sideList;
  }, [props.sideList]);

  // useEffect(() => {
  //   document.addEventListener('mousedown', (e) => handleClick2(e), false);

  //   return () => {
  //     document.removeEventListener('mousedown', (e) => handleClick2(e), false);
  //   };
  // }, []);

  // const handleClick2 = (e) => {
  //   // const { current: node } = app;
  //   if (app.current) {
  //     if (app.current.contains(e.target) === false) {
  //       props.setListFalse(false);
  //     }
  //   }
  // };

  //让组件先渲染出来 然后再执行动画效果
  useEffect(() => {
    if (props.sideList) {
      setTimeState2(true);
      setTimeout(() => {
        setTimeState3(true);
      }, 50);
    } else if (props.sideList === false) {
      setTimeout(() => {
        setTimeState2(false);
      }, 350); //350是动画时间设置了300毫毛 等到动画结束再隐藏组件
      setTimeState3(false);
    }
  }, [props.sideList]);

  const setState = (data) => {
    switch (data) {
      case 'true':
        setTitle(true);
        break;
      case 'false':
        setTitle(false);
        break;
      default:
        break;
    }
  };

  const cilckSide = async (items) => {
    const value = await getSongURL(items.key);
    const {
      data: { data = {} },
    } = value;

    if (data[0].url === null) {
      message.error('没有版权');
    } else {
      const { setAudioUrl } = props;
      setAudioUrl(data);
      setList(items.key);
      const audio = document.getElementById('audio');
      audio.play();
      PubSub.publish('songID', items);
      PubSub.publish('songAllId', info);
    }
  };

  const mapSidelist = () => {
    const result = props.playList.data;
    return result.map((items) => {
      return (
        <tr
          key={items.key}
          onDoubleClick={() => {
            cilckSide(items);
          }}
        >
          <td
            className={`sidelist-songname ${
              items.key === list ? 'active-list' : null
            }`}
            οnfοcus="this.blur()"
          >
            {items.name}
          </td>
          <td
            className={`sidelist-singer ${
              items.key === list ? 'active-list' : null
            }`}
          >
            {items.singer}
          </td>
          <td className="sidelist-songtime">{items.duration}</td>
        </tr>
      );
    });
  };

  return (
    <div
      style={timeState2 ? { display: 'block' } : { display: 'none' }}
      ref={app}
    >
      <div className={timeState3 ? 'sidelist show' : 'sidelist '}>
        <div className="sidelist-title">
          <div
            className={title ? 'sidelist-list true' : 'sidelist-list'}
            onClick={() => {
              setState('true');
            }}
          >
            播放列表
          </div>
          <div
            className={title ? 'sidelist-history' : 'sidelist-history true'}
            onClick={() => {
              setState('false');
            }}
          >
            历史播放
          </div>
        </div>
        <div className="sidelist-subtitle">
          <div className="subtitle">
            总共
            {props.playList.data === null ? '0' : props.playList.data.length}首
          </div>
          <div className="delete">
            <DeleteOutlined />
            &nbsp; 删除
          </div>
        </div>
        <div className="title-flex"></div>
        {props.playList.data == null ? (
          ''
        ) : (
          <div className="sidelist-song">
            <table>
              <tbody>{mapSidelist()}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      sideList: state.sideList.data,
      playList: state.playList,
    };
  },
  { setListFalse, setAudioUrl }
)(SideList);
