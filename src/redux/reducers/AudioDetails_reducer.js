const initialState = { data: null };

const audioDetails = (pre = initialState, action) => {
  const { type, data } = action;
  switch (type) {
    case 'setAudioDetails':
      return Object.assign({}, pre, { data });

    default:
      return pre;
  }
};

export default audioDetails;
