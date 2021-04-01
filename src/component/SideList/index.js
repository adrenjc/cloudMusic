import React, { useState, useEffect } from 'react';
import './index.css';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
// import PubSub from 'pubsub-js';
// import list from '../../redux/reducers/list_reducers';
// import store from '../../redux/store';

const SideList = (props) => {
  const [title, setTitle] = useState(true);
  const [list, setList] = useState(null);

  useEffect(() => {
    let token = PubSub.subscribe('audioIndex', async (_, data) => {
      await setList(data);
      return () => {
        PubSub.unsubscribe(token);
      };
    });
  }, []);

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

  // const cilckSide = async (items) => {
  //   await setList(items.key);
  //   const audio = document.getElementById('audio');
  //   audio.play();
  // };

  const mapSidelist = () => {
    const result = props.playList.data;
    return result.map((items) => {
      return (
        <tr
          key={items.key}
          // onDoubleClick={async () => {
          //   await cilckSide(items);
          // }}
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
  // console.log(props);
  return (
    <div>
      {props.sideList.data ? (
        <div className="sidelist">
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
              {props.playList.data === null ? '0' : props.playList.data.length}
              首
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
      ) : null}
    </div>
  );
};

export default connect((state) => {
  return {
    sideList: state.sideList,
    playList: state.playList,
  };
}, {})(SideList);
