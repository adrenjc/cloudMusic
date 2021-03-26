const initialState = { data: false };

function playList(preState = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case 'true':
      return Object.assign({}, preState, {
        data,
      });
    case 'false':
      return Object.assign({}, preState, {
        data,
      });
    default:
      return preState;
  }
}

export default playList;
