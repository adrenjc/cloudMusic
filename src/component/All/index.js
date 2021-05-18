/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './index.css';
import './icon.css';
import Side from '../Sidenav/index';
import Home from '../Home/index';
import Audio from '../Audio/index';
import PlayList from '../Playlist/index';
import Search from '../Search/index';
import { Redirect, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchHot from '../SearchHot/index';
import { searchInput } from '../../redux/action/SearchInput_action';
import Suggest from '../Suggest/index';
import { getSearchSuggest } from '../../api/index';
import PubSub from 'pubsub-js';
import storageUtils from '../../utils/storageUtils';
import memoryUtils from '../../utils/memoryUtils';
// import storageUtils from '../../utils/storageUtils';

// export default class All extends Component {

//   render() {

//   }
// }

const All = (props) => {
  const [focus, setFocus] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [suggestValue, setSuggestValue] = useState();
  const [suggestData, setSuggestData] = useState();
  const [arrHistory, setArrHistory] = useState(
    !memoryUtils.searchHistory ? [] : memoryUtils.searchHistory
  );
  // const [focusLoding, setFocusLoding] = useState(false); // 请求热度高的歌曲
  const app = useRef();
  const input = useRef();
  const history = useRef();

  let token;
  let token2;
  //监听鼠标是否在搜索框内点击 如果不实在搜索框点击则关闭搜索框
  useEffect(() => {
    token = PubSub.subscribe('searchHot', (_, data) => {
      setFocus(data);
    });
    token2 = PubSub.subscribe('suggest', (_, data) => {
      setSuggest(data);
    });
    document.addEventListener('mousedown', (e) => handleClick(e), false);

    return () => {
      PubSub.unsubscribe(token);
      PubSub.unsubscribe(token2);
      document.removeEventListener('mousedown', (e) => handleClick(e), false);
    };
  }, []);

  const handleClick = (e) => {
    if (app.current !== null) {
      if (app.current.contains(e.target) === false) {
        setFocus(false);
        setSuggest(false);
      }
    }
  };

  const search = useDebounce(async (e) => {
    const {
      target: { value = {} },
    } = e;
    if (value !== '') {
      // console.log('kong');

      const data = await getSearchSuggest(value);
      const {
        data: { result },
      } = data;
      if (result.hasOwnProperty('order')) {
        setSuggest(true);
        setFocus(false);
        setSuggestData(result);
        setSuggestValue(value);
      }
    } else if (value === '') {
      setFocus(true);
      setSuggest(false);
    }
  }, 300);

  //按下回车键后跳转到搜索
  const search2 = (e) => {
    if (e.keyCode === 13) {
      props.history.replace(`/App/search/${e.target.value}`);
      setFocus(false);
      setSuggest(false);
      setArrHistory([...arrHistory, e.target.value]);
      history.current = [...arrHistory, e.target.value];

      storageUtils.saveSearch(history.current);
      memoryUtils.searchHistory = history.current;
    }
  };
  //防抖
  function useDebounce(fn, delay) {
    const { current } = useRef({ fn, timer: null });
    useEffect(
      function () {
        current.fn = fn;
      },
      [fn]
    );
    return useCallback(function f(...args) {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
      }, delay);
      // current
    }, []);
  }

  const inputFocus = (e) => {
    if (focus) {
      e.target.value = '';
    }
    if (!suggest) {
      e.target.value = '';
    }
    setFocus(true);
    // setSuggest
    // const { searchInput } = props;
    // searchInput(true);
  };
  const inputOnBlur = () => {
    // setFocus(false);
    // console.log('失去焦点了');
  };
  return (
    <div className="app">
      <div className="all-app">
        <div className="top">
          <div className="top-nav">
            <Link to="/App/home" className="nav">
              个性推荐
            </Link>
            <Link to="/App/home" className="nav">
              歌单
            </Link>
            <Link to="/App/home" className="nav">
              最新音乐
            </Link>
          </div>
          <div className="top-right" ref={app}>
            <input
              ref={input}
              onInput={search}
              onKeyUp={search2}
              onFocus={inputFocus}
              onBlur={inputOnBlur}
              type="text"
              placeholder="&#xe623;&nbsp;搜索"
              className="top-input iconfont"
            ></input>
            {focus ? <SearchHot></SearchHot> : null}
            {suggest ? (
              <Suggest
                suggestValue={suggestValue}
                suggestData={suggestData}
              ></Suggest>
            ) : null}
          </div>
        </div>

        <Side></Side>
        <Route path="/App/home" component={Home}></Route>
        <Route path="/App/playlist/:id" component={PlayList}></Route>
        {/* <Search></Search> */}
        <Route path="/App/search/:value" component={Search}></Route>
        <Redirect to="/App/home"></Redirect>
        <Audio></Audio>
      </div>
    </div>
  );
};

export default connect(
  (state) => {
    return { searchState: state.searchState.data };
  },
  { searchInput }
)(All);
