import './index.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getSearchHot } from '../../api/index';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import Pubsub from 'pubsub-js';
import memoryUtils from '../../utils/memoryUtils';

const SearchHot = (props) => {
  const [loding, setLoding] = useState(false);
  const [data, setData] = useState(null);
  const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

  useEffect(() => {
    const featchData = async () => {
      setLoding(true);

      const value = await getSearchHot();
      const {
        data: { data = {} },
      } = value;
      setData(data);
      setLoding(false);
    };
    featchData();
  }, []);

  //跳转到搜索
  const click = (items) => {
    props.history.replace(`/App/search/${items.searchWord}`);
    Pubsub.publish('searchHot', false);
  };

  return (
    <div>
      <div className="search-input">
        {!memoryUtils.searchHistory ? null : (
          <div className="search-history">
            <div className="search-history-title">搜索历史</div>
            {memoryUtils.searchHistory.map((items, index) => {
              return (
                <div className="search-history-data" key={index}>
                  {items}
                </div>
              );
            })}
          </div>
        )}

        <div className="search-hot">
          <div className="search-hot-title">热搜榜</div>
          {loding ? (
            <div>
              <Spin indicator={antIcon} />
            </div>
          ) : (
            <div>
              {data !== null
                ? data.map((items, index) => {
                    return (
                      <div
                        className="search-hot-data"
                        key={index}
                        onClick={() => {
                          click(items);
                        }}
                      >
                        <div
                          className={
                            index + 1 <= 3
                              ? 'search-hot-index hot'
                              : 'search-hot-index '
                          }
                        >
                          {index + 1}
                        </div>
                        <div className="search-hot-name">
                          <div className="search-hot-songname">
                            {items.searchWord}
                          </div>

                          {items.iconUrl ? (
                            <img
                              className="search-hot-img"
                              src={items.iconUrl}
                              alt=""
                            ></img>
                          ) : null}
                          <span className="search-ishot">{items.score}</span>
                          <div className="search-hot-details">
                            {items.content}
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          )}

          {/* <div className="search-hot-data">
            <div className="search-hot-index">1</div>
            <div className="search-hot-name">
              <div className="search-hot-songname">周杰伦</div>
              <img
                className="search-hot-img"
                src="https://p1.music.126.net/2zQ0d1ThZCX5Jtkvks9aOQ==/109951163968000522.png"
                alt=""
              ></img>
              <span className="search-ishot">12415123</span>
              <div className="search-hot-details">阿巴巴爸爸</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect()(SearchHot));
