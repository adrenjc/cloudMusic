/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { inSearch } from '../../api/index';
import moment from 'moment';

const Search = (props) => {
  const [loding, setLoding] = useState(false);
  const [count, setCount] = useState(); //设置歌曲数量
  const [getData, setGetData] = useState(null);
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
      setLoding(true);
      const data = await inSearch(value);
      const {
        data: { result },
      } = data;
      console.log(result.songs);
      setCount(result.songCount);
      setGetData(result.songs);
      setLoding(false);
    };
    featchData();
    return () => {};
  }, [value]);

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
          {getData
            ? getData.map((items, index) => {
                return (
                  <div
                    className={
                      index % 2 === 0
                        ? 'search-return-deatils'
                        : 'search-return-deatils search-active'
                    }
                    key={index}
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
                        __html: getHighlight(items.ar[0].name),
                      }}
                    ></div>
                    <div
                      className="search-deatils-albums"
                      dangerouslySetInnerHTML={{
                        __html: getHighlight(items.al.name),
                      }}
                    ></div>
                    <div className="search-deatils-time">
                      {moment(items.dt).format('mm:ss')}
                    </div>
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

export default connect()(Search);
