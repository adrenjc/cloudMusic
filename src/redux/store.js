import { createStore, combineReducers } from 'redux';

import sideList from './reducers/SideList_reducer';
import playList from './reducers/Playlist_reducer';
import audio from './reducers/Audio_reducer';
import audioDetails from './reducers/AudioDetails_reducer';

const allReducers = combineReducers({
  sideList,
  playList,
  audio,
  audioDetails,
});

export default createStore(allReducers);
