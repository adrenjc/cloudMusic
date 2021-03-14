import React, { Component } from 'react';
import { Carousel } from 'antd';
import './index.css';
import img1 from './imgs/1.jpg';
import img2 from './imgs/2.jpg';
import img3 from './imgs/3.jpg';
import { Row, Col, Divider, Image } from 'antd';
import { recommendPlayList, getPlaylistData } from '../../api/index';

export default class Home extends Component {
  componentDidMount() {
    this.init();
  }

  state = {
    arr: [],
  };

  init = async () => {
    await this.getRecommendPlayList();
  };

  getRecommendPlayList = async () => {
    const result = await recommendPlayList();
    const value = result.data.recommend.slice(0, 10);
    // const values = value.slice(0, 10);
    this.setState({ arr: value });
  };

  admin = () => {
    const { arr } = this.state;
    return arr.map((items) => {
      // console.log(items);
      if (items.type === 1) {
        return (
          <Col
            key={items.id}
            className="gutter-row"
            span={4}
            style={{
              height: '210px',
              //   backgroundColor: 'red',
              padding: '0',
              margin: '4px 18px 40px 18px',
            }}
          >
            <div className="content-image">
              <Image src={items.picUrl} preview={false}></Image>
              <div>{items.name}</div>
            </div>
          </Col>
        );
      }
    });
  };

  render() {
    return (
      <div className="admin">
        <div className="carousel">
          <Carousel effect="fade" autoplay>
            <div className="home-img">
              <img src={img1} alt=""></img>
            </div>
            <div className="home-img">
              <img src={img2} alt=""></img>
            </div>
            <div className="home-img">
              <img src={img3} alt=""></img>
            </div>
          </Carousel>
        </div>
        <div className="content-area">
          {/* <Divider
            orientation="left"
            className="content-title"
            style={{
              color: '#a7a7a7',
            }}
          >
            推荐的歌单
          </Divider>

          <Row
          // gutter={[16, 24]}
          // style={{
          //   width: '1100px',
          // }}
          >
            {this.admin()}
          </Row> */}
        </div>
      </div>
    );
  }
}
