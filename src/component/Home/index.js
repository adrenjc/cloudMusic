import React, { Component } from 'react';
import { Carousel } from 'antd';
import './index.css';
import { Row, Col, Divider, Image, Spin } from 'antd';
import {
  recommendPlayList,
  getBanner,
  getUserRecommendPlaylist,
} from '../../api/index';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.setState = () => false;
  }
  state = {
    arr: [],
    banners: [],
    isLoding: false,
  };

  init = async () => {
    await this.getRecommendPlayList();
    await this.getBanner();
    this.setState({ isLoding: false });
  };

  getRecommendPlayList = async () => {
    await this.setState({ isLoding: true });
    const { loginstate } = this.props;
    if (loginstate) {
      const result = await getUserRecommendPlaylist();
      const value = result.data.recommend.slice(0, 10);
      this.setState({ arr: value });
    } else {
      const result = await recommendPlayList();
      const value = result.data.result.slice(0, 10);
      this.setState({ arr: value });
    }
  };

  getBanner = async () => {
    const result = await getBanner();
    const value = result.data.banners.slice(0, 6);
    this.setState({ banners: value });
  };

  admin = () => {
    const { arr } = this.state;
    return arr.map((items) => {
      return (
        <Col
          key={items.id}
          className="gutter-row"
          span={4}
          style={{
            padding: '0',
            margin: '4px 18px 40px 18px',
          }}
        >
          {/* <div > */}
          <Link to={`/App/playlist/${items.id}`} className="content-image">
            <Image src={items.picUrl} preview={false}></Image>
            <div>{items.name}</div>
          </Link>
          {/* </div> */}
        </Col>
      );
    });
  };

  //控制搜索框状态

  render() {
    const antIcon = <LoadingOutlined style={{ fontSize: 200 }} spin />;
    const { isLoding, banners } = this.state;
    return (
      <div className="admin">
        {isLoding ? (
          <div className="home-loding">
            <div>
              <Spin indicator={antIcon} />
            </div>
          </div>
        ) : (
          <div>
            <div className="carousel">
              <Carousel effect="fade" autoplay>
                {/* <img src={img1} alt=""></img>
                </div>
                <div className="home-img">
                  <img src={img2} alt=""></img>
                </div>
                <div className="home-img">
                  <img src={img3} alt=""></img> */}
                {banners.map((items) => {
                  return (
                    <div className="home-img" key={items.imageUrl}>
                      <img src={items.imageUrl} alt=""></img>
                    </div>
                  );
                })}
              </Carousel>
            </div>
            <div className="content-area">
              <Divider
                orientation="left"
                className="content-title"
                style={{
                  color: '#a7a7a7',
                }}
              >
                推荐的歌单
              </Divider>

              <Row gutter={[16, 24]} className="ant-row2">
                {this.admin()}
              </Row>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect((state) => {
  return {
    loginstate: state.loginState.data,
  };
})(Home);
