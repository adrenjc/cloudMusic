const initialState = {
  data: null,
};

function list(preState = initialState, action) {
  const { type, data } = action;
  switch (type) {
    case 'click':
      return Object.assign({}, preState, {
        data,
      });

    default:
      return preState;
  }
}

export default list;
