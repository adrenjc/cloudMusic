import { createStore, combineReducers } from 'redux';

import sideList from './reducers/SideList_reducer';
import playList from './reducers/Playlist_reducer';
import audio from './reducers/Audio_reducer';
import audioDetails from './reducers/AudioDetails_reducer';
import loginState from './reducers/LoginState_rudecuer';
import searchInput from './reducers/SearchInput_reducer';

const allReducers = combineReducers({
  sideList,
  playList,
  audio,
  audioDetails,
  loginState,
  searchState: searchInput,
});

export default createStore(allReducers);
