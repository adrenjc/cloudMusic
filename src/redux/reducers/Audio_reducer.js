const initialState = { data: null };

const audio = (preState = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case 'setAudioUrl':
      return Object.assign({}, preState, {
        data,
      });
    default:
      return preState;
  }
};

export default audio;
