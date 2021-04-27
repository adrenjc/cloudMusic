import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { getComment, getRelatedSong } from '../../../api/index';
import './index.scss';

const SongComment = (props) => {
  const [comment, setComment] = useState(null);
  const isComment = useRef();

  const [hotComment, setHotComment] = useState(null);
  const isHot = useRef();
  const [loding, setLoding] = useState(false);
  // const [relatedSong, setRelatedSong] = useState(null);

  const dataArr = [];
  const dataArr2 = [];

  const [data, setData] = useState();
  const [data2, setData2] = useState();

  let nowY = new Date().getFullYear();
  //   let nowM = new Date().getMonth() + 1;
  //   let nowD = new Date().getDate();

  useEffect(() => {
    const fetchData = async () => {
      if (props.audioDetails.data !== null) {
        setLoding(true);
        const value = await getComment(props.audioDetails.data[0].id);
        const {
          data: { comments, hotComments },
        } = value;
        await setComment(comments);
        await setHotComment(hotComments);
        // console.log(hotComment);
        isHot.current = hotComments;
        isComment.current = comments;
        for (let i = 0; i < isHot.current.length; i++) {
          let date = new Date(isHot.current[i].time);
          let Y = date.getFullYear();
          //   console.log(date.getHours(), date.getMinutes());
          let M = date.getMonth() + 1;
          let D = date.getDate();
          let H = date.getHours();
          let Min = date.getMinutes();
          dataArr.push({
            commentId: isHot.current[i].commentId,
            content: isHot.current[i].content,
            user: isHot.current[i].user,
            Ytime: Y,
            Mtime: M,
            Dtime: D,
            Htime: H,
            Mintime: Min,
            likedCount: isHot.current[i].likedCount,
            liked: isHot.current[i].liked,
          });
        }
        for (let i = 0; i < isComment.current.length; i++) {
          let date = new Date(isComment.current[i].time);
          let Y = date.getFullYear();
          //   console.log(date.getHours(), date.getMinutes());
          let M = date.getMonth() + 1;
          let D = date.getDate();
          let H = date.getHours();
          let Min = date.getMinutes();
          dataArr2.push({
            commentId: isComment.current[i].commentId,
            content: isComment.current[i].content,
            user: isComment.current[i].user,
            Ytime: Y,
            Mtime: M,
            Dtime: D,
            Htime: H,
            Mintime: Min,
            likedCount: isComment.current[i].likedCount,
            liked: isComment.current[i].liked,
            beReplied: isComment.current[i].beReplied,
          });
        }
        setData(dataArr);
        setData2(dataArr2);
        isComment.current = comments;
        setLoding(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.audioDetails]);
  useEffect(() => {
    const fetchData = async () => {
      const value = await getRelatedSong(props.audioDetails.data[0].id);
      console.log(value);
    };
    fetchData();
  }, [props.audioDetails]);
  return (
    <div>
      {loding === true ? (
        <div>Loding</div>
      ) : (
        <div className="song-comment">
          <div className="comment-box">
            <div className="comment-songs">
              {hotComment === null ? null : (
                <div className="featured-box">
                  {hotComment.length === 0 ? null : (
                    <div>
                      <div className="featured-comment">精选评论</div>

                      {data.map((items, index) => {
                        return (
                          <div className="user-comments" key={index}>
                            <div className="user-comment-img">
                              <img src={items.user.avatarUrl} alt=""></img>
                            </div>
                            <div className="user-comment">
                              <div className="user-comment-Box">
                                <span className="comment-nickname">
                                  {items.user.nickname}:
                                </span>
                                <span className="comment-context">
                                  {items.content}
                                </span>
                              </div>
                              <div className="user-comment-time">
                                {items.Ytime}年{items.Mtime}月{items.Dtime}日
                              </div>
                              <div className="user-comment-like">
                                {items.likedCount}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="new-comment-box">
                {comment === null ? null : (
                  <div>
                    <div className="new-comment">最新评论</div>
                    {data2 === null
                      ? null
                      : data2.map((items, index) => {
                          return (
                            <div className="user-comments" key={index}>
                              <div className="user-comment-img">
                                <img src={items.user.avatarUrl} alt=""></img>
                              </div>
                              <div className="user-comment">
                                <div className="user-comment-Box">
                                  <span className="comment-nickname">
                                    {items.user.nickname}:
                                  </span>
                                  <span className="comment-context">
                                    {items.content}
                                  </span>
                                  {items.beReplied.length === 0 ? null : (
                                    <div className="user-replay">
                                      <span className="replay-name">
                                        @{items.beReplied[0].user.nickname}:
                                      </span>
                                      <span className="replay-content">
                                        {items.beReplied[0].content}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="user-comment-time">
                                  {nowY === items.Ytime ? (
                                    <span>
                                      {items.Mtime}月{items.Dtime}日
                                    </span>
                                  ) : (
                                    <span>
                                      {items.Ytime}年{items.Mtime}月
                                      {items.Dtime}日
                                    </span>
                                  )}
                                </div>
                                <div className="user-comment-like">
                                  {items.likedCount}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
            </div>
            <div className="similar-songs"></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default connect((state) => {
  return {
    audioDetails: state.audioDetails,
  };
})(SongComment);
