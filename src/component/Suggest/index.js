import './index.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PubSub from 'pubsub-js';
import { message } from 'antd';

// import { SearchOutlined } from '@ant-design/icons';
// import { get } from 'store';

const Suggest = (props) => {
  const [songs, setSongs] = useState(null);
  const [artists, setArtists] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  const { suggestData } = props;
  useEffect(() => {
    if (suggestData !== undefined) {
      if (suggestData.order.includes('songs')) {
        if (suggestData.songs !== undefined) {
          setSongs(suggestData.songs);
        }
      } else if (!suggestData.order.includes('songs')) {
        setSongs(null);
      }
      if (suggestData.order.includes('artists')) {
        if (suggestData.artist !== undefined) {
          setArtists(suggestData.artists);
        }
      } else if (!suggestData.order.includes('artists')) {
        setArtists(null);
      }
      if (suggestData.order.includes('albums')) {
        if (suggestData.albums !== undefined) {
          setAlbums(suggestData.albums);
        }
      } else if (!suggestData.order.includes('albums')) {
        setAlbums(null);
      }
      if (suggestData.order.includes('playlists')) {
        if (suggestData.playlists !== undefined) {
          setPlaylists(suggestData.playlists);
        }
      } else if (!suggestData.order.includes('playlists')) {
        setPlaylists(null);
      }
    }
    return () => {};
  }, [suggestData]);

  const getHighlight = (data) => {
    let reg = new RegExp(props.suggestValue, 'ig');
    let newData2 = data.match(reg);
    let newData = data.replace(
      reg,
      `<span class='highLight'>${newData2}</span>`
    );
    return newData;
  };

  const click = (items) => {
    props.history.replace(`/App/search/${items.name}`);
    PubSub.publish('suggest', false);
  };

  const click2 = () => {
    message.error('还未开发');
  };
  return (
    <div>
      <div className="suggest-input">
        <div className="suggest-input-title">
          搜索“
          <span className="suggset-input-data">{props.suggestValue}</span>
          ”相关的结果
        </div>
        {songs === null ? null : (
          <div>
            <div className="suggest-data">单曲</div>
            {songs.map((items, index) => {
              return (
                <div
                  key={index}
                  className="suggest-data-songname"
                  onClick={() => {
                    click(items);
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      getHighlight(items.name) +
                      '&nbsp;-&nbsp;' +
                      getHighlight(items.artists[0].name),
                  }}
                ></div>
              );
            })}
          </div>
        )}
        {artists === null ? null : (
          <div>
            <div className="suggest-data">歌手</div>
            {artists.map((items, index) => {
              return (
                <div
                  onClick={() => {
                    click2();
                  }}
                  key={index}
                  className="suggest-data-songname"
                  dangerouslySetInnerHTML={{
                    __html: getHighlight(items.name),
                  }}
                ></div>
              );
            })}
          </div>
        )}
        {albums === null ? null : (
          <div>
            <div className="suggest-data">专辑</div>
            {albums.map((items, index) => {
              return (
                <div
                  onClick={() => {
                    click2();
                  }}
                  key={index}
                  className="suggest-data-songname"
                  dangerouslySetInnerHTML={{
                    __html:
                      getHighlight(items.name) +
                      '&nbsp;-&nbsp;' +
                      getHighlight(items.artist.name),
                  }}
                ></div>
              );
            })}
          </div>
        )}
        {playlists === null ? null : (
          <div>
            <div className="suggest-data">歌单</div>
            {playlists.map((items, index) => {
              return (
                <div
                  onClick={() => {
                    click2();
                  }}
                  key={index}
                  className="suggest-data-songname"
                  dangerouslySetInnerHTML={{
                    __html: getHighlight(items.name),
                  }}
                ></div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(connect()(Suggest));
