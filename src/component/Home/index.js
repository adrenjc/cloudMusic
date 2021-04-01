import React, { Component } from 'react';
import { Carousel } from 'antd';
import './index.css';
import { Row, Col, Divider, Image, Spin } from 'antd';
import { recommendPlayList, getBanner } from '../../api/index';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default class Home extends Component {
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
    const result = await recommendPlayList();
    const value = result.data.recommend.slice(0, 10);
    this.setState({ arr: value });
  };

  getBanner = async () => {
    const result = await getBanner();
    const value = result.data.banners.slice(0, 6);
    console.log(value);
    this.setState({ banners: value });
  };

  admin = () => {
    const { arr } = this.state;
    return arr.map((items) => {
      if (items.type === 1) {
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
      } else {
        return null;
      }
    });
  };

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
